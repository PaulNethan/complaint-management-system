import jwt
from django.conf import settings
from jwt import algorithms
from rest_framework.views import APIView
from rest_framework.response import Response
from complaints.models import Complaints
from users.models import Users

# Create your views here.


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
