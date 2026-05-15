from .views import LoginView
from django.urls import path
from .views import RegisterView
from .views import ProtectedRouteView

urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("login/", LoginView.as_view()),
    path('userpage/', ProtectedRouteView.as_view())
]