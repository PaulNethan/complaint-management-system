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

# Create your views here.


class ComplaintsModelSerializer(ModelSerializer):
    class Meta:
        model = Complaints
        fields = "__all__"


class RaiseComplaintView(APIView):
    def post(self, request):

        auth_header = request.headers.get("Authorization")
        complaint_type = request.data.get("complaint_type")
        severity_level = request.data.get("severity_level")
        incident_date = request.data.get("incident_date")
        incident_time = request.data.get("incident_time")
        incident_location = request.data.get("incident_location")
        on_going = request.data.get("on_going") == "true"
        victim = request.data.get("victim") == "true"
        victim_name = request.data.get("victim_name")
        victim_email = request.data.get("victim_email")
        victim_phone_no = request.data.get("victim_phone_no")
        accused_name = request.data.get("accused_name")
        relationship_to_victim = request.data.get("relationship_to_victim")
        accused_physical_description = request.data.get("accused_physical_description")
        accused_location = request.data.get("accused_location")
        detailed_description = request.data.get("detailed_description")
        evidence_file = request.FILES.get("evidence_file")  # for file uploads
        urgent = request.data.get("urgent") == "true"
        sos = request.data.get("sos") == "true"
        request_authority_reach_out = (
            request.data.get("request_authority_reach_out") == "true"
        )

        valid_details_consent = request.data.get("valid_details_consent") == "true"
        privacy_policy_consent = request.data.get("privacy_policy_consent") == "true"

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
