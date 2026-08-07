"""
DRF serializers for Resume and related models.
Uses nested serializers for education, experience, and projects.
"""

from rest_framework import serializers
from .models import Resume, Education, Experience, Project


class EducationSerializer(serializers.ModelSerializer):
    """Serializer for Education model."""

    class Meta:
        model = Education
        fields = ['id', 'degree', 'university', 'start_year', 'end_year', 'cgpa']


class ExperienceSerializer(serializers.ModelSerializer):
    """Serializer for Experience model."""

    class Meta:
        model = Experience
        fields = ['id', 'company', 'job_title', 'start_date', 'end_date', 'description']


class ProjectSerializer(serializers.ModelSerializer):
    """Serializer for Project model."""

    github_link = serializers.URLField(required=False, allow_blank=True)

    class Meta:
        model = Project
        fields = ['id', 'project_name', 'technology', 'description', 'github_link']


class ResumeSerializer(serializers.ModelSerializer):
    """
    Serializer for Resume with nested education, experience, and projects.
    Handles create and update with related records.
    """

    education = EducationSerializer(many=True)
    experience = ExperienceSerializer(many=True)
    projects = ProjectSerializer(many=True)
    linkedin = serializers.URLField(required=False, allow_blank=True)
    github = serializers.URLField(required=False, allow_blank=True)

    class Meta:
        model = Resume
        fields = [
            'id', 'first_name', 'last_name', 'email', 'phone', 'address',
            'linkedin', 'github', 'professional_summary', 'profile_image',
            'education', 'experience', 'projects', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        """Create resume with all nested related records."""
        education_data = validated_data.pop('education', [])
        experience_data = validated_data.pop('experience', [])
        projects_data = validated_data.pop('projects', [])

        resume = Resume.objects.create(**validated_data)

        for edu in education_data:
            Education.objects.create(resume=resume, **edu)
        for exp in experience_data:
            Experience.objects.create(resume=resume, **exp)
        for proj in projects_data:
            Project.objects.create(resume=resume, **proj)

        return resume

    def update(self, instance, validated_data):
        """Update resume and replace all nested related records."""
        education_data = validated_data.pop('education', None)
        experience_data = validated_data.pop('experience', None)
        projects_data = validated_data.pop('projects', None)

        # Update resume fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Replace education records if provided
        if education_data is not None:
            instance.education.all().delete()
            for edu in education_data:
                Education.objects.create(resume=instance, **edu)

        # Replace experience records if provided
        if experience_data is not None:
            instance.experience.all().delete()
            for exp in experience_data:
                Experience.objects.create(resume=instance, **exp)

        # Replace project records if provided
        if projects_data is not None:
            instance.projects.all().delete()
            for proj in projects_data:
                Project.objects.create(resume=instance, **proj)

        return instance
