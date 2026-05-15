from django.db import models

# Create your models here.

class Users(models.Model):
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=225)

    role = models.CharField(max_length=20, default="users")
    is_approved = models.BooleanField(default=True)