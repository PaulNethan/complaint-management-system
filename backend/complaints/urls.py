from .views import DisplayComplaintsView
from django.urls import path
from .views import RaiseComplaintView
from .views import AuthorityReceiveComplaintsView
from .views import AssignedToView
from .views import AssignedComplaintView
from .views import UpdateStatusView
from .views import GetAuthorityComplaintsView
from .views import RevokeComplaintAssignmentView
from .views import BanuserView
from .views import GetMasterComplaintsView
from .views import DraftPublicPostView
from .views import ConfirmPostView


urlpatterns = [
    path("raisecomplaints/", RaiseComplaintView.as_view()),
    path("viewcomplaints/", DisplayComplaintsView.as_view()),
    path("cmp_details_for_auth/", AuthorityReceiveComplaintsView.as_view()),
    path("assign_complaints/", AssignedToView.as_view()),
    path("getComplaints/", AssignedComplaintView.as_view()),
    path("update_status/", UpdateStatusView.as_view()),
    path("getauthoritycomplaints/", GetAuthorityComplaintsView.as_view()),
    path("revokecaseaccess/", RevokeComplaintAssignmentView.as_view()),
    path("banauthority/", BanuserView.as_view()),
    path("getmastercomplaints/", GetMasterComplaintsView.as_view()),
    path("draft_post/", DraftPublicPostView.as_view()),
    path("submit_post/", ConfirmPostView.as_view()),
]
