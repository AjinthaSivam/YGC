from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models

class LearnerManager(BaseUserManager):
    def create_user(self, email, username, firstname=None, lastname=None, grade=None, mobile_no=None, address=None, password=None):
        if not email:
            raise ValueError('Users must have an email address')

        user = self.model(
            email=self.normalize_email(email),
            username=username,
            firstname=firstname,
            lastname=lastname,
            grade=grade,
            mobile_no=mobile_no,
            address=address,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, firstname=None, lastname=None, grade=None, mobile_no=None, address=None, password=None):
        user = self.create_user(
            email,
            username=username,
            firstname=firstname,
            lastname=lastname,
            grade=grade,
            mobile_no=mobile_no,
            address=address,
            password=password,
        )
        user.is_admin = True
        user.save(using=self._db)
        return user

class Learner(AbstractBaseUser):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=30, unique=True)
    firstname = models.CharField(max_length=100, blank=True, null=True)
    lastname = models.CharField(max_length=100, blank=True, null=True)
    grade = models.CharField(max_length=10, blank=True, null=True)
    mobile_no = models.CharField(max_length=15, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    is_premium = models.BooleanField(default=False)

    objects = LearnerManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email

class LearnerQuota(models.Model):
    learner = models.OneToOneField(Learner, on_delete=models.CASCADE)
    general_bot_calls = models.IntegerField(default=0)
    pastpaper_bot_calls = models.IntegerField(default=0)
    historical_bot_calls = models.IntegerField(default=0)
    last_reset_date = models.DateField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.learner.username} Quotas"