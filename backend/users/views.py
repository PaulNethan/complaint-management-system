from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Users



class RegisterView(APIView):

    def post(self, request):

        email = request.data.get("email")
        password = request.data.get("password")

        Users.objects.create(
            email = email,
            password = password
        )
        
        return Response({
            "message": "registered users successfully"
        })

class LoginView(APIView):
    def post(self, request):

        verifyEmail = request.data.get("email")
        verifyPassword = request.data.get("password")
        found_user = Users.objects.filter(email = verifyEmail).first()
        if found_user is not None:
            if found_user.password == verifyPassword:
                return Response({"message":"Email and Password matches SUCCESS!"})
            else:
                return Response({
                    "message" : "wrong password"
                })
        else:
            return Response({
                "message" : "user not found"
            })
        