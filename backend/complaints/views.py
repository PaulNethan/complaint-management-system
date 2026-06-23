from typing import Self
from django.core.checks import messages
import jwt
from django.conf import settings
from jwt import DecodeError, ExpiredSignatureError, algorithms
from rest_framework import response
from rest_framework.views import APIView
from rest_framework.response import Response
from complaints.models import Complaints
from users.models import Users
from rest_framework.serializers import ModelSerializer
from django.utils.html import escape
import os
import magic
from rest_framework.throttling import UserRateThrottle, AnonRateThrottle
from complaints.agents.workflow import app
from complaints.agents.tools import post_to_discord_tool, post_to_twitter_tool
from complaints.agents.workflow import llm
from .authentication import CentralizedCookieCheck
from .permissions import isAdmin, isAuthority, isUser
from rest_framework.permissions import IsAuthenticated


class bodyguard1(UserRateThrottle):
    scope = "complaint_submission"


def safe_escape(value):
    if value is not None:
        return escape(str(value))
    return value


class ComplaintsModelSerializer(ModelSerializer):
    class Meta:
        model = Complaints
        fields = "__all__"


class RaiseComplaintView(APIView):
    authentication_classes = [CentralizedCookieCheck]
    permission_classes = [isUser]

    throttle_classes = [bodyguard1, AnonRateThrottle]

    def post(self, request):

        # 1. Configuration
        ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".pdf"]
        ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "application/pdf"]
        MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

        complaint_type = safe_escape(request.data.get("complaint_type"))
        severity_level = safe_escape(request.data.get("severity_level"))
        incident_date = request.data.get("incident_date")
        incident_time = request.data.get("incident_time") or None
        incident_location = safe_escape(request.data.get("incident_location"))
        on_going = request.data.get("on_going") == "true"
        victim = request.data.get("victim") == "true"
        victim_name = safe_escape(request.data.get("victim_name"))
        victim_email = safe_escape(request.data.get("victim_email"))
        victim_phone_no = request.data.get("victim_phone_no")
        accused_name = safe_escape(request.data.get("accused_name"))
        relationship_to_victim = safe_escape(request.data.get("relationship_to_victim"))
        accused_physical_description = safe_escape(
            request.data.get("accused_physical_description")
        )
        accused_location = safe_escape(request.data.get("accused_location"))
        detailed_description = safe_escape(request.data.get("detailed_description"))
        evidence_file = request.FILES.get("evidence_file")  # for file uploads
        urgent = request.data.get("urgent") == "true"
        sos = request.data.get("sos") == "true"
        request_authority_reach_out = (
            request.data.get("request_authority_reach_out") == "true"
        )

        valid_details_consent = request.data.get("valid_details_consent") == "true"
        privacy_policy_consent = request.data.get("privacy_policy_consent") == "true"

        if evidence_file:
            if evidence_file.size > MAX_FILE_SIZE:
                return Response({"message": "File size exceeds 10MB limit"}, status=400)
            _, extension = os.path.splitext(evidence_file.name.lower())
            if extension not in ALLOWED_EXTENSIONS:
                return Response({"message": "Invalid file extension"}, status=400)
            file_content = evidence_file.read(2048)
            detected_mime = magic.from_buffer(file_content, mime=True)

            evidence_file.seek(0)
            if detected_mime not in ALLOWED_MIME_TYPES:
                return Response({"message": "Invalid file type"}, status=400)

            new_Complaint = Complaints.objects.create(
                user=request.user,
                complaint_type=complaint_type,
                severity_level=severity_level,
                incident_date=incident_date,
                incident_time=incident_time,
                incident_location=incident_location,
                on_going=on_going,
                victim=victim,
                victim_name=victim_name,
                victim_email=victim_email,
                victim_phone_no=victim_phone_no,
                accused_name=accused_name,
                relationship_to_victim=relationship_to_victim,
                accused_physical_description=accused_physical_description,
                accused_location=accused_location,
                detailed_description=detailed_description,
                evidence_file=evidence_file,
                urgent=urgent,
                sos=sos,
                request_authority_reach_out=request_authority_reach_out,
                valid_details_consent=valid_details_consent,
                privacy_policy_consent=privacy_policy_consent,
            )
            return Response({"message": "complaint registered successfully"})


class DisplayComplaintsView(APIView):

    authentication_classes = [CentralizedCookieCheck]
    permission_classes = [isUser]

    def get(self, request):

        user_complaints = Complaints.objects.filter(user=request.user.id)
        serializer = ComplaintsModelSerializer(user_complaints, many=True)
        return Response({"all_complaint_details": serializer.data})


class AuthorityReceiveComplaintsView(APIView):
    authentication_classes = [CentralizedCookieCheck]
    permission_classes = [isAuthority]

    def post(self, request):

        current_authority = Users.objects.filter(id=request.user.id).first()
        if current_authority.is_approved == False:
            return Response(
                {"message": "Your account was banned from approval."}, status=403
            )
        if current_authority.authority_type == "police":
            police_complaints = Complaints.objects.filter(
                complaint_type__in=[
                    "Harassment",
                    "Domestic violence",
                    "Stalking",
                    "assault",
                    "workspaceHarassment",
                ],
                assigned_to__isnull=True,
            )
            police_serialized = ComplaintsModelSerializer(police_complaints, many=True)
            return Response({"complaints": police_serialized.data})

        elif current_authority.authority_type == "cyber_crime":
            cyber_crime_complaints = Complaints.objects.filter(
                complaint_type__in=["cyber_crime"], assigned_to__isnull=True
            )
            cyber_serialized = ComplaintsModelSerializer(
                cyber_crime_complaints, many=True
            )
            return Response({"complaints": cyber_serialized.data})


class AssignedToView(APIView):
    authentication_classes = [CentralizedCookieCheck]
    permission_classes = [isAuthority]

    def post(self, request):
        complaint_id = request.data.get("complaint_id")

        found_complaints = Complaints.objects.filter(id=complaint_id).first()

        current_auth = Users.objects.filter(id=request.user.id).first()
        if current_auth.is_approved == False:
            return Response(
                {"message": "authority is not approved class assigned complaints"}
            )
        if found_complaints.assigned_to is None:
            found_complaints.assigned_to = current_auth
            found_complaints.save()
            return Response(
                {
                    "message": f"complaint was successfully assigned to authority {request.user.id}"
                }
            )
        else:
            return Response(
                {"message": "complaint has been assigned to a different user"}
            )


class AssignedComplaintView(APIView):
    authentication_classes = [CentralizedCookieCheck]
    permission_classes = [isAuthority]

    def post(self, request):

        found_complaints = Complaints.objects.filter(assigned_to=request.user.id)
        Complaints_serialized = ComplaintsModelSerializer(found_complaints, many=True)
        return Response({"complaints": Complaints_serialized.data})


class UpdateStatusView(APIView):
    authentication_classes = [CentralizedCookieCheck]
    permission_classes = [isAuthority]

    def post(self, request):

        complaint_id = request.data.get("complaint_id")
        complaint_status = request.data.get("complaint_status")

        if Users.objects.filter(id=request.user.id).first().is_approved == False:
            return Response({"message": "authority is not approved"})
        if Complaints.objects.filter(assigned_to=request.user.id):
            complaint = Complaints.objects.filter(id=complaint_id).first()
            complaint.complaint_status = complaint_status
            complaint.save()
            return Response({"message": "complaint status updated successfully"})
        else:
            return Response({"message": "no assigned complaints"})


class GetAuthorityComplaintsView(APIView):
    authentication_classes = [CentralizedCookieCheck]
    permission_classes = [isAdmin]

    def post(self, request):
        authority_id = request.data.get("authority_id")

        found_complaints = Complaints.objects.filter(assigned_to=authority_id)
        serialized = ComplaintsModelSerializer(found_complaints, many=True)
        return Response({"message": serialized.data})


class RevokeComplaintAssignmentView(APIView):
    authentication_classes = [CentralizedCookieCheck]
    permission_classes = [isAdmin]

    def post(self, request):

        complaint_id = request.data.get("complaint_id")
        complaint = Complaints.objects.filter(id=complaint_id).first()
        if not complaint:
            return Response({"message": "Complaint not found"}, status=404)

        complaint.assigned_to = None
        complaint.complaint_status = "pending"
        complaint.save()

        return Response({"message": "Complaint assignment revoked successfully"})


class BanuserView(APIView):
    authentication_classes = [CentralizedCookieCheck]
    permission_classes = [isAdmin]

    def post(self, request):

        authority_id = request.data.get("authority_id")

        user = Users.objects.filter(id=authority_id).first()
        complaint = Complaints.objects.filter(assigned_to=authority_id)
        if not user:
            return Response({"message": "user not found"}, status=404)
        user.is_approved = False
        user.save()
        if complaint:
            complaint.update(assigned_to=None, complaint_status="pending")

        return Response(
            {"message": "authority banned successfully and complaints are revoked "}
        )


class GetMasterComplaintsView(APIView):

    authentication_classes = [CentralizedCookieCheck]
    permission_classes = [isAdmin]

    def post(self, request):

        role = request.data.get("role")

        # Fetch complaints based on role
        if role == "police":
            complaints = Complaints.objects.filter(
                complaint_type__in=[
                    "Harassment",
                    "Domestic violence",
                    "Stalking",
                    "assault",
                    "workspaceHarassment",
                ]
            )
        elif role == "cyber_crime":
            complaints = Complaints.objects.filter(complaint_type="cyber_crime")
        else:
            return Response({"message": "Invalid role"}, status=400)
        serialized = ComplaintsModelSerializer(complaints, many=True)
        return Response({"message": serialized.data})


class DraftPublicPostView(APIView):

    authentication_classes = [CentralizedCookieCheck]
    permission_classes = [isUser]

    def post(self, request):

        complaint_id = request.data.get("complaint_id")

        found_complaint = Complaints.objects.filter(id=complaint_id).first()

        if not found_complaint:
            return Response({"message": "Complaint not found"}, status=404)

        result = app.invoke({"complaint_text": found_complaint.detailed_description})

        return Response(
            {
                "draft_post_ai": result.get("draft_post"),
                "safety_issue_ai": result.get("safety_issue"),
                "auditor_notes_ai": result.get("auditor_notes"),
            },
            status=200,
        )


class ConfirmPostView(APIView):
    authentication_classes = [CentralizedCookieCheck]
    permission_classes = [isUser]

    def post(self, request):
        draft_post = request.data.get("draft_post")
        complaint_id = request.data.get("complaint_id")

        found_complaint = Complaints.objects.filter(id=complaint_id).first()
        if not found_complaint:
            return Response({"message": "Complaint not found"}, status=404)

        execution_result = []

        # 1. Deterministically invoke the Twitter tool directly
        twitter_res = post_to_twitter_tool.invoke({"tweet_text": draft_post})
        if twitter_res.lower().startswith("error"):
            return Response({"message": twitter_res}, status=400)
        execution_result.append(f"twitter: {twitter_res}")

        # 2. Deterministically invoke the Discord tool directly
        discord_res = post_to_discord_tool.invoke({"message": draft_post})
        if discord_res.lower().startswith("error"):
            return Response({"message": discord_res}, status=400)
        execution_result.append(f"discord: {discord_res}")

        # 3. Save the exact user-approved text to the database
        found_complaint.public_post_text = draft_post
        found_complaint.is_public = True
        found_complaint.save()

        return Response(
            {
                "message": "posted successfully",
                "twitter_result": execution_result,
            },
            status=200,
        )
