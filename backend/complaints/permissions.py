from rest_framework.permissions import BasePermission
from rest_framework.permissions import IsAuthenticated


class isAuthority(BasePermission):
    message = "you are not an authority"

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        if (
            request.user.role == "authority"
            and request.user.is_approved == True
            and request.user.authority_type in ["cyber_crime", "police"]
        ):
            return True
        return False


class isAdmin(BasePermission):
    message = "you are not a admin to proceed"

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        if request.user.role == "admin" and request.user.is_approved == True:
            return True
        return False


class isUser(BasePermission):
    message = "invalid user or user has been banned"

    def has_permission(self, request, view):

        if not request.user.is_authenticated:
            return False
        if request.user.role == "user" and request.user.is_approved == True:
            return True
        return False
