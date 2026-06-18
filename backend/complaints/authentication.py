import jwt
from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from users.models import Users


class CentralizedCookieCheck(BaseAuthentication):
    def authenticate(self, request):

        receiveToken = request.COOKIES.get("token")

        if not receiveToken:

            return None

        try:

            finalToken = jwt.decode(
                receiveToken, settings.SECRET_KEY, algorithms=["HS256"]
            )

            userInfoFromToken = Users.objects.filter(id=finalToken.get("id")).first()
            if not userInfoFromToken:
                raise AuthenticationFailed("User not found")

            return (userInfoFromToken, receiveToken)

        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Token expired")
        except jwt.DecodeError:
            raise AuthenticationFailed("Invalid token")
