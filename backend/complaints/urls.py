from .views import DisplayComplaintsView
from django.urls import path
from .views import RaiseComplaintView


urlpatterns = [
    path("raisecomplaints/", RaiseComplaintView.as_view()),
    path("viewcomplaints/", DisplayComplaintsView.as_view()),
]
