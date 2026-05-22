from django.db import models
from django.contrib.auth.models import AbstractBaseUser

# Create your models here.


class Users(AbstractBaseUser):
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20)
    is_approved = models.BooleanField(default=True)
    profile_picture = models.FileField(
        upload_to="profile_picture/", null=True, blank=True
    )
    authority_type = models.CharField(null=True,blank=True,max_length=50)
    # --- DJANGO REQUIREMENTS ---
    # Tells Django to use the email for logging in (instead of a username)
    USERNAME_FIELD = 'email'  
    # Tells Django what fields are required when creating a superuser
    REQUIRED_FIELDS = ['role']