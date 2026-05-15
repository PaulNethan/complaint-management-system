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

        transformedpassword = make_password(
            password = request.data.get("password")
            )
        email = request.data.get("email")
        role = request.data.get("role")
        
        is_approved = True
        if(role == "authority"):
            is_approved = False


        Users.objects.create(
            email = email,
            password = transformedpassword,
            role = role,
            is_approved = is_approved
        )
        
        return Response({
            "message": "registered users successfully"
        })


"""
this class is used to handel the login logic so it recives the data from front end and then hashes the login password and checks it with the 
password that was stored in the browser if match is found returns a token valid for 60 min to the user 
"""
class LoginView(APIView):
    def post(self, request):

        verifyEmail = request.data.get("email")
        verifyPassword = request.data.get("password")
        found_user = Users.objects.filter(email = verifyEmail).first()
        if found_user is not None:
            if(check_password(verifyPassword , found_user.password)):
                if(found_user.is_approved == False):
                    return Response({
                        "message": "Your account is pending admin approval."
                    })

                payload = {
                    'id': found_user.id,
                    'exp': datetime.datetime.utcnow() +
                    datetime.timedelta(minutes=60),
                    'iat': datetime.datetime.utcnow(),
                    'role':found_user.role
                }
                token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
                return Response({"token": token, "role": found_user.role})
            else:
                return Response({
                    "message" : "wrong password"
                })
        else:
            return Response({
                "message" : "user not found"
            })
        


"""
this class will be performing protected route logic for now it will just recive the token and decode it and if the token has not expired or tampered 
it will return a success message later toles will be added to the database and we will be checking if the role matches and then let the user in 
"""

class ProtectedRouteView(APIView):
    def post(self, request):

        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return Response({
                "message":"No token provided"
            }, status=404)
        
        token = auth_header.split(' ')[1]
        try:
            decodedToken = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])

            found_user = Users.objects.filter(id=decodedToken['id']).first()
            return Response({
                "message": "Welcome to your protected page",
                "user email": found_user.email
            })
        
        except jwt.ExpiredSignatureError:
            return Response({
                "message": "Token has expired, please login again"
            }, status=401)

        except jwt.DecodeError:
            return Response({
                "message": "Invalid token"
            },status=401)
