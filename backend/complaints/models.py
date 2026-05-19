from django.db import models
from django.utils.ipv6 import MAX_IPV6_ADDRESS_LENGTH
from users.models import Users

# Create your models here.
class Complaints(models.Model):

    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    complaint_type = models.CharField(max_length=50)
    severity_level = models.CharField(max_length=25)
    incident_date = models.DateField()
    incident_time = models.TimeField(null=True, blank=True)
    incident_location = models.CharField(max_length=500)
    on_going = models.BooleanField()
    victim = models.BooleanField()
    victim_name = models.CharField(max_length=100, null=True, blank=True)
    victim_email = models.EmailField(null=True, blank=True)
    victim_phone_no = models.CharField(max_length=15,null=True, blank=True)
    accused_name = models.CharField(max_length=100, null=True, blank=True)
    relationship_to_victim = models.CharField(max_length=100, null=True, blank=True)
    accused_physical_description = models.CharField(max_length=100, null=True, blank=True)
    accused_location = models.CharField(max_length=500, null=True, blank=True)
    detailed_description =  models.TextField()
    evidence_file = models.FileField(upload_to='evidence/', null=True, blank=True)
    urgent = models.BooleanField()
    sos = models.BooleanField()
    request_authority_reach_out = models.BooleanField()
    valid_details_consent = models.BooleanField()
    privacy_policy_consent = models.BooleanField()

