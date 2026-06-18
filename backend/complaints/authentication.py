import jwt
from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from users.models import Users


class CentralizedCookieCheck(BaseAuthentication):
    def authenticate(self, request):

        receiveToken = request.COOKIES.get("token")
        print("received token:", receiveToken)

        if not receiveToken:

            print("DEBUG: Token is missing! Returning None.")
            return None

        try:

            finalToken = jwt.decode(
                receiveToken, settings.SECRET_KEY, algorithms=["HS256"]
            )
            print("DEBUG: Successfully decoded payload:", finalToken)

            userInfoFromToken = Users.objects.filter(id=finalToken.get("id")).first()
            if not userInfoFromToken:
                raise AuthenticationFailed("User not found")
            print("DEBUG: Successfully found user:", userInfoFromToken.email)

            return (userInfoFromToken, receiveToken)

        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Token expired")
        except jwt.DecodeError:
            raise AuthenticationFailed("Invalid token")
