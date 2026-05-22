from os import access
import jwt
import datetime
from .models import Users
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password

"""
this class is used to register a user to the database it hashes the password and then stores it in the database 

"""


class RegisterView(APIView):

    def post(self, request):

        transformedpassword = make_password(password=request.data.get("password"))
        email = request.data.get("email")
        role = request.data.get("role")
        authority_type = request.data.get("authority_type")

        is_approved = True
        if role == "authority":
            is_approved = False
        if role == "authority" and authority_type not in ["police","cyber_crime"]:
            return Response({
                "message":"invalid authority type"
            }, status=400)

        Users.objects.create(
            email=email,
            password=transformedpassword,
            role=role,
            is_approved=is_approved,
            authority_type=authority_type

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
                return Response({"token": token, "role": found_user.role})
            else:
                return Response({"message": "wrong password"})
        else:
            return Response({"message": "user not found"})


"""
this class will be performing protected route logic for now it will just receive the token and decode it and if the token has not expired or tampered 
it will return a success message later tools will be added to the database and we will be checking if the role matches and then let the user in 
"""


class ProtectedRouteView(APIView):
    def post(self, request):

        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return Response({"message": "No token provided"}, status=404)

        token = auth_header.split(" ")[1]
        try:
            decodedToken = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])

            found_user = Users.objects.filter(id=decodedToken["id"]).first()
            if found_user.is_approved == False:
                return Response(
                    {"message": "Your account was banned from approval."}
                )
            return Response(
                {
                    "message": "Welcome to your protected page",
                    "user email": found_user.email,
                }
            )

        except jwt.ExpiredSignatureError:
            return Response(
                {"message": "Token has expired, please login again"}, status=401
            )

        except jwt.DecodeError:
            return Response({"message": "Invalid token"}, status=401)


class ProfilePicView(APIView):
    def get(self, request):
        auth = request.headers.get("Authorization")
        if not auth:
            return Response({"message": "token is not provided"}, status=401)
        token = auth.split(" ")[1]
        try:
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            found_user = Users.objects.filter(id=decoded_token["id"]).first()

            # If they have a picture, send it!
            if found_user and found_user.profile_picture:
                return Response({"message": str(found_user.profile_picture.url)})
            else:
                return Response({"message": ""})  # No picture yet

        except jwt.ExpiredSignatureError:
            return Response({"message": "token expired"}, status=401)

    def post(self, request):

        auth = request.headers.get("Authorization")
        profile_picture = request.FILES.get("profile_picture")

        if not auth:
            return Response({"message": "token is not provided"})

        token = auth.split(" ")[1]
        try:
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])

            found_user = Users.objects.filter(id=decoded_token["id"]).first()
            if found_user.role == "user":
                if profile_picture:
                    found_user.profile_picture = profile_picture
                    found_user.save()
                    return Response({"message": str(found_user.profile_picture.url)})

                else:
                    return Response(
                        {"message": "No image was provided in the request!"}, status=400
                    )

        except jwt.ExpiredSignatureError:
            return Response({"message": "token expired "})

        except jwt.DecodeError:
            return Response({"message": "token expired"}, status=401)
