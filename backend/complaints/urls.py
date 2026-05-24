from .views import DisplayComplaintsView
from django.urls import path
from .views import RaiseComplaintView
from .views import AuthorityReceiveComplaintsView
from .views import AssignedToView
from .views import AssignedComplaintView
from .views import UpdateStatusView


urlpatterns = [
    path("raisecomplaints/", RaiseComplaintView.as_view()),
    path("viewcomplaints/", DisplayComplaintsView.as_view()),
    path("cmp_details_for_auth/", AuthorityReceiveComplaintsView.as_view()),
    path("assign_complaints/", AssignedToView.as_view()),
    path("getComplaints/", AssignedComplaintView.as_view()),
    path("update_status/", UpdateStatusView.as_view()),
]
