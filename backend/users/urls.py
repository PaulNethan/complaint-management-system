from .views import LoginView
from django.urls import path
from .views import RegisterView
from .views import ProtectedRouteView
from .views import ProfilePicView
from .views import AdminGetPendingAuthoritiesView
from .views import GrantApprovalView
from .views import ShowActiveAuthView

urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("login/", LoginView.as_view()),
    path("authoritylayout/", ProtectedRouteView.as_view()),
    path("profilepic/", ProfilePicView.as_view()),
    path("pendingauthority/", AdminGetPendingAuthoritiesView.as_view()),
    path("approveauthority/", GrantApprovalView.as_view()),
    path("getapprovedauth/", ShowActiveAuthView.as_view()),
]
