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

    throttle_classes = [bodyguard1, AnonRateThrottle]

    def post(self, request):

        # 1. Configuration
        ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".pdf"]
        ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "application/pdf"]
        MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

        auth_header = request.headers.get("Authorization")
        complaint_type = safe_escape(request.data.get("complaint_type"))
        severity_level = safe_escape(request.data.get("severity_level"))
        incident_date = request.data.get("incident_date")
        incident_time = request.data.get("incident_time")
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

        if not auth_header:
            return Response({"message": "No token provided"})
        try:
            token = auth_header.split(" ")[1]

            decodedToken = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            foundUser = Users.objects.filter(id=decodedToken["id"]).first()

            if foundUser.role == "user":
                new_Complaint = Complaints.objects.create(
                    user=foundUser,
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
        except jwt.ExpiredSignatureError:
            return Response({"message": "token Expired"}, status=401)
        except jwt.DecodeError:
            return Response({"message": "invalid token"}, status=401)


class DisplayComplaintsView(APIView):
    def get(self, request):

        check_api = request.headers.get("Authorization")

        if not check_api:
            return Response({"message": "token not provided"})
        try:
            token = check_api.split(" ")[1]

            decode_token = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user_complaints = Complaints.objects.filter(user=decode_token["id"])
            if decode_token["role"] == "user":
                serializer = ComplaintsModelSerializer(user_complaints, many=True)
                return Response({"all_complaint_details": serializer.data})

        except DecodeError:
            return Response({"message": "invalid token"}, status=401)


class AuthorityReceiveComplaintsView(APIView):
    def post(self, request):

        raw_token = request.headers.get("Authorization")

        if not raw_token:
            return Response(
                {"message": "token was not recived AuthorityReciveComplaints"}
            )

        try:
            token = raw_token.split(" ")[1]
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])

            current_authority = Users.objects.filter(id=decoded_token["id"]).first()
            if current_authority.is_approved == False:
                return Response({"message": "Your account was banned from approval."})
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
                police_searilized = ComplaintsModelSerializer(
                    police_complaints, many=True
                )
                return Response({"complaints": police_searilized.data})

            elif current_authority.authority_type == "cyber_crime":
                cyber_crime_complaints = Complaints.objects.filter(
                    complaint_type__in=["cyber"], assigned_to__isnull=True
                )
                cyber_searialized = ComplaintsModelSerializer(
                    cyber_crime_complaints, many=True
                )
                return Response({"complaints": cyber_searialized.data})
        except jwt.ExpiredSignatureError:
            return Response({"messages": "token expired"}, status=401)
        except jwt.DecodeError:
            return Response({"messages": "invalid token"}, status=401)


class AssignedToView(APIView):
    def post(self, request):

        raw_token = request.headers.get("Authorization")
        complaint_id = request.data.get("complaint_id")

        if not raw_token:
            return Response(
                {"message": "token was not received by assign complaints class"}
            )

        try:

            token = raw_token.split(" ")[1]
            decoded_Token = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])

            found_complaints = Complaints.objects.filter(id=complaint_id).first()

            current_auth = Users.objects.filter(id=decoded_Token["id"]).first()
            if current_auth.is_approved == False:
                return Response(
                    {"message": "authority is not approved class assigned complaints"}
                )
            if found_complaints.assigned_to is None:
                found_complaints.assigned_to = current_auth
                found_complaints.save()
                return Response(
                    {
                        "message": f"complaint was successfully assigned to authority {decoded_Token['id']}"
                    }
                )
            else:
                return Response(
                    {"message": "complaint has been assigned to a different user"}
                )

        except jwt.ExpiredSignatureError:
            return Response({"message": "token expired"}, status=401)

        except jwt.DecodeError:
            return Response({"messages": "invalid token"}, status=401)


class AssignedComplaintView(APIView):
    def post(self, request):

        raw_token = request.headers.get("Authorization")

        if not raw_token:
            return Response({"message": "token not provided AssignedComplaintView"})

        try:
            token = raw_token.split(" ")[1]
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])

            found_complaints = Complaints.objects.filter(
                assigned_to=decoded_token["id"]
            )
            Complaints_serialized = ComplaintsModelSerializer(
                found_complaints, many=True
            )
            return Response({"complaints": Complaints_serialized.data})

        except jwt.ExpiredSignatureError:
            return Response({"message": "token expired"}, status=401)
        except jwt.DecodeError:
            return Response({"message": "invalid token"}, status=401)


class UpdateStatusView(APIView):
    def post(self, request):

        raw_token = request.headers.get("Authorization")
        complaint_id = request.data.get("complaint_id")
        complaint_status = request.data.get("complaint_status")

        if not raw_token:
            return Response({"message": "token not provided UpdateStatusView"})

        try:
            token = raw_token.split(" ")[1]
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            if (
                Users.objects.filter(id=decoded_token["id"]).first().is_approved
                == False
            ):
                return Response({"message": "authority is not approved"})
            if Complaints.objects.filter(assigned_to=decoded_token["id"]):
                complaint = Complaints.objects.filter(id=complaint_id).first()
                complaint.complaint_status = complaint_status
                complaint.save()
                return Response({"message": "complaint status updated successfully"})
            else:
                return Response({"message": "complaint not assigned to you"})
        except jwt.ExpiredSignatureError:
            return Response({"message": "token expired"}, status=401)
        except jwt.DecodeError:
            return Response({"message": "invalid token"}, status=401)


class GetAuthorityComplaintsView(APIView):
    def post(self, request):

        raw_token = request.headers.get("Authorization")
        authority_id = request.data.get("authority_id")

        if not raw_token:
            return Response(
                {"message": "token not received by GetAuthorityComplaintsView"},
                status=401,
            )

        try:
            token = raw_token.split(" ")[1]
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            if decoded_token["role"] != "admin":
                return Response(
                    {"message": "You are not authorized to perform this action"},
                    status=403,
                )
            found_complaints = Complaints.objects.filter(assigned_to=authority_id)
            serialized = ComplaintsModelSerializer(found_complaints, many=True)
            return Response({"message": serialized.data})

        except jwt.ExpiredSignatureError:
            return Response({"message": "token expired "})

        except jwt.DecodeError:
            return Response({"message": "token expired"}, status=401)


class RevokeComplaintAssignmentView(APIView):
    def post(self, request):
        raw_token = request.headers.get("Authorization")
        complaint_id = request.data.get("complaint_id")

        if not raw_token:
            return Response({"message": "Token not received"}, status=401)

        try:
            # 1. Decode and verify the JWT token
            token = raw_token.split(" ")[1]
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])

            # 2. Check if the user making the request is an admin
            if decoded_token["role"] != "admin":
                return Response({"message": "Unauthorized"}, status=403)

            # 3. Locate the specific complaint in the database
            complaint = Complaints.objects.filter(id=complaint_id).first()
            if not complaint:
                return Response({"message": "Complaint not found"}, status=404)

            # 4. Modify the fields and save
            complaint.assigned_to = None
            complaint.complaint_status = "pending"
            complaint.save()

            return Response({"message": "Complaint assignment revoked successfully"})

        except jwt.ExpiredSignatureError:
            return Response({"message": "Token expired"}, status=401)
        except jwt.DecodeError:
            return Response({"message": "Invalid token"}, status=401)


class BanuserView(APIView):
    def post(self, request):

        raw_token = request.headers.get("Authorization")
        authority_id = request.data.get("authority_id")

        if not raw_token:
            return Response({"message": "token not provided"}, status=401)
        try:
            token = raw_token.split(" ")[1]
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            if decoded_token["role"] != "admin":
                return Response({"message": "unauthorized"}, status=403)
            user = Users.objects.filter(id=authority_id).first()
            complaint = Complaints.objects.filter(assigned_to=authority_id)
            if not user:
                return Response({"message": "user not found"}, status=404)
            user.is_approved = False
            user.save()
            if complaint:
                complaint.assigned_to = None
                complaint.complaint_status = "pending"
                complaint.save()

            return Response(
                {"message": "authority banned successfully and complaints are revoked "}
            )

        except jwt.ExpiredSignatureError:
            return Response({"message": "token expired"}, status=401)
        except jwt.DecodeError:
            return Response({"message": "invalid token"}, status=401)


class GetMasterComplaintsView(APIView):
    def post(self, request):

        raw_token = request.headers.get("Authorization")
        role = request.data.get("role")

        if not raw_token:
            return Response(
                {"message": "token not provided GetMasterComplaintsView"}, status=401
            )

        try:
            token = raw_token.split(" ")[1]
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])

            # Optional: Check if the user is an admin
            if decoded_token["role"] != "admin":
                return Response({"message": "Unauthorized"}, status=403)

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

            # Serialize complaints
            serialized = ComplaintsModelSerializer(complaints, many=True)
            return Response({"message": serialized.data})

        except jwt.ExpiredSignatureError:
            return Response({"message": "Token expired"}, status=401)
        except jwt.DecodeError:
            return Response({"message": "Invalid token"}, status=401)
