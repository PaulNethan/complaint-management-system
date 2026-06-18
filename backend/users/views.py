from os import access
from complaints import permissions
import jwt
import datetime
from .models import Users
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password
from rest_framework.serializers import ModelSerializer
from complaints.models import Complaints
from complaints.authentication import CentralizedCookieCheck
from complaints.permissions import isAdmin, isUser, isAuthority
from rest_framework.permissions import IsAuthenticated


class Serializer(ModelSerializer):
    class Meta:
        model = Users
        fields = "__all__"


class RegisterView(APIView):

    def post(self, request):

        password = request.data.get("password")
        email = request.data.get("email")
        role = request.data.get("role")
        authority_type = request.data.get("authority_type")
        name = request.data.get("name")

        is_approved = True
        if role == "authority":
            is_approved = False
        if role == "authority" and authority_type not in ["police", "cyber_crime"]:
            return Response({"message": "invalid authority type"}, status=400)

        Users.objects.create_user(
            email=email,
            password=password,
            role=role,
            is_approved=is_approved,
            authority_type=authority_type,
            name=name,
        )

        return Response({"message": "registered users successfully"})


"""
this class is used to handel the login logic so it receives the data from front end and then hashes the login password and checks it with the 
password that was stored in the browser if match is found returns a token valid for 60 min to the user 
"""


class LoginView(APIView):
    def post(self, request):

        verifyEmail = request.data.get("email")
        verifyPassword = request.data.get("password")
        is_secure = not settings.DEBUG
        found_user = Users.objects.filter(email=verifyEmail).first()
        if found_user is not None:
            if check_password(verifyPassword, found_user.password):
                if found_user.is_approved == False:
                    return Response(
                        {"message": "Your account is pending admin approval."}
                    )

                payload = {
                    "id": found_user.id,
                    "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
                    "iat": datetime.datetime.utcnow(),
                    "role": found_user.role,
                }
                token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
                response = Response(
                    {"message": "Login successful", "role": found_user.role}
                )
                response.set_cookie(
                    key="token",
                    value=token,
                    httponly=True,
                    secure=True,
                    samesite="None",
                )
                return response
            else:
                return Response({"message": "wrong password"})
        else:
            return Response({"message": "user not found"})


"""
this class will be performing protected route logic for now it will just receive the token and decode it and if the token has not expired or tampered 
it will return a success message later tools will be added to the database and we will be checking if the role matches and then let the user in 
"""


class ProtectedRouteView(APIView):

    authentication_classes = [CentralizedCookieCheck]

    permission_classes = [isAdmin | isAuthority]

    def post(self, request):

        current_user = request.user
        return Response(
            {
                "message": "Welcome to your protected page",
                "user email": request.user.email,
            }
        )


class ProfilePicView(APIView):
    authentication_classes = [CentralizedCookieCheck]
    permission_classes = [IsAuthenticated]

    def get(self, request):

        if request.user and request.user.profile_picture:
            return Response({"message": str(request.user.profile_picture.url)})
        else:
            return Response({"message": "no profile picture"})

    def post(self, request):

        profile_picture = request.FILES.get("profile_picture")
        if profile_picture:
            request.user.profile_picture = profile_picture
            request.user.save()
            return Response({"message": str(request.user.profile_picture.url)})

        else:
            return Response(
                {"message": "No image was provided in the request!"}, status=400
            )


class AdminGetPendingAuthoritiesView(APIView):
    authentication_classes = [CentralizedCookieCheck]
    permission_classes = [isAdmin]

    def post(self, request):
        department = request.data.get("department")

        found_user = Users.objects.filter(
            role="authority", is_approved=False, authority_type=department
        )
        serialized = Serializer(found_user, many=True)

        return Response({"message": serialized.data})


class GrantApprovalView(APIView):
    authentication_classes = [CentralizedCookieCheck]
    permission_classes = [isAdmin]

    def post(self, request):

        authority_id = request.data.get("id")

        found_authority = Users.objects.filter(id=authority_id).first()
        if not found_authority:
            return Response({"message": "authority not found"})

        found_authority.is_approved = True
        found_authority.save()
        return Response({"message": "authority approved successfully"})


class ShowActiveAuthView(APIView):
    authentication_classes = [CentralizedCookieCheck]
    permission_classes = [isAdmin]

    def post(self, request):
        role = request.data.get("role")

        found_authorities = Users.objects.filter(
            role="authority", is_approved=True, authority_type=role
        )
        serialized = Serializer(found_authorities, many=True)
        return Response({"message": serialized.data})


class authorityrosterView(APIView):
    authentication_classes = [CentralizedCookieCheck]
    permission_classes = [isAdmin]

    def post(self, request):

        role = request.data.get("role")

        if role == "police":
            authorities = Users.objects.filter(
                role="authority", authority_type="police", is_approved=True
            )
        elif role == "cyber_crime":
            authorities = Users.objects.filter(
                role="authority", authority_type="cyber_crime", is_approved=True
            )
        else:
            return Response({"message": "Invalid role"}, status=400)

        serialized = Serializer(authorities, many=True)
        return Response({"message": serialized.data})


class AdminAssignComplaintView(APIView):
    authentication_classes = [CentralizedCookieCheck]
    permission_classes = [isAdmin]

    def post(self, request):

        complaint_id = request.data.get("complaint_id")
        authority_id = request.data.get("authority_id")

        found_complaint = Complaints.objects.filter(id=complaint_id).first()
        if not found_complaint:
            return Response({"message": "Complaint not found"})

        found_auth = Users.objects.filter(id=authority_id).first()
        if not found_auth:
            return Response({"message": "Authority not found"})

        found_complaint.assigned_to = found_auth
        found_complaint.complaint_status = "pending"
        found_complaint.save()
        return Response({"message": "Complaint assigned successfully"})


class LogoutView(APIView):
    authentication_classes = [CentralizedCookieCheck]
    permission_classes = [IsAuthenticated]

    def post(self, request):

        response = Response({"message": "successfully logged out"})
        response.delete_cookie("token", samesite="None")

        return response
