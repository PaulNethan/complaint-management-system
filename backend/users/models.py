from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

# Create your models here.


class CustomUserManager(BaseUserManager):
    def create_user(self, email, role, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, role=role, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, role, password=None, **extra_fields):
        return self.create_user(email, role, password, **extra_fields)


class Users(AbstractBaseUser):
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20)
    name = models.CharField(max_length=50, null=True, blank=True)

    is_approved = models.BooleanField(default=True)
    profile_picture = models.FileField(
        upload_to="profile_picture/", null=True, blank=True
    )
    authority_type = models.CharField(null=True, blank=True, max_length=50)
    # --- DJANGO REQUIREMENTS ---
    # Tells Django to use the email for logging in (instead of a username)
    USERNAME_FIELD = "email"
    # Tells Django what fields are required when creating a superuser
    REQUIRED_FIELDS = ["role"]

    objects = CustomUserManager()
