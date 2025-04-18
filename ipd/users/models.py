# users/models.py

from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('parent', 'Parent'),
        ('child', 'Child'),
    )

    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    age = models.PositiveIntegerField(null=True, blank=True)  # for child users
    language = models.CharField(max_length=50, blank=True)  # e.g., 'Hindi', 'Tamil', etc.

    parent = models.ForeignKey(
        'self',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='children',
        limit_choices_to={'role': 'parent'}  # child can only link to a parent
    )

    def __str__(self):
        return f"{self.username} ({self.role})"
