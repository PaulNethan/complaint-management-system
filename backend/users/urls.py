from .views import LoginView
from django.urls import path
from .views import RegisterView
from .views import ProtectedRouteView
from .views import ProfilePicView

urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("login/", LoginView.as_view()),
    path("authoritylayout/", ProtectedRouteView.as_view()),
    path("profilepic/", ProfilePicView.as_view()),
]
