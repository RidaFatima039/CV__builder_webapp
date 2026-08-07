"""
Database models for CV Builder.
One Resume with related Education, Experience, and Project records.
"""

from django.db import models


class Resume(models.Model):
    """Main resume model storing personal details."""

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    address = models.TextField()
    linkedin = models.URLField(blank=True, default='')
    github = models.URLField(blank=True, default='')
    professional_summary = models.TextField()
    profile_image = models.ImageField(upload_to='profiles/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.first_name} {self.last_name}'


class Education(models.Model):
    """Education entries linked to a resume."""

    resume = models.ForeignKey(
        Resume, related_name='education', on_delete=models.CASCADE
    )
    degree = models.CharField(max_length=200)
    university = models.CharField(max_length=200)
    start_year = models.IntegerField()
    end_year = models.IntegerField()
    cgpa = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)

    def __str__(self):
        return f'{self.degree} - {self.university}'


class Experience(models.Model):
    """Work experience entries linked to a resume."""

    resume = models.ForeignKey(
        Resume, related_name='experience', on_delete=models.CASCADE
    )
    company = models.CharField(max_length=200)
    job_title = models.CharField(max_length=200)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    description = models.TextField()

    def __str__(self):
        return f'{self.job_title} at {self.company}'


class Project(models.Model):
    """Project entries linked to a resume."""

    resume = models.ForeignKey(
        Resume, related_name='projects', on_delete=models.CASCADE
    )
    project_name = models.CharField(max_length=200)
    technology = models.CharField(max_length=200)
    description = models.TextField()
    github_link = models.URLField(blank=True, default='')

    def __str__(self):
        return self.project_name
