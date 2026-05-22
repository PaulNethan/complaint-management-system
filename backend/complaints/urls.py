from .views import DisplayComplaintsView
from django.urls import path
from .views import RaiseComplaintView
from .views import AuthorityReciveComplaintsView


urlpatterns = [
    path("raisecomplaints/", RaiseComplaintView.as_view()),
    path("viewcomplaints/", DisplayComplaintsView.as_view()),
    path("cmp_details_for_auth/", AuthorityReciveComplaintsView.as_view())
]
