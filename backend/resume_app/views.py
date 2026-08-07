"""
API views for Resume using DRF ViewSets.
Handles JSON and multipart/form-data (for profile image upload).
"""

import json

from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Resume
from .serializers import ResumeSerializer


def parse_request_data(data):
    """
    Parse request data for nested JSON fields sent as strings in FormData.
    Converts education, experience, and projects from JSON strings to lists.
    """
    parsed = {}
    for key, value in data.items():
        if key in ('education', 'experience', 'projects') and isinstance(value, str):
            parsed[key] = json.loads(value)
        else:
            parsed[key] = value
    return parsed


class ResumeViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Resume CRUD operations.
    GET /api/resume/       - list resumes (returns first one for single-user app)
    POST /api/resume/      - create resume
    GET /api/resume/<id>/  - retrieve resume
    PUT /api/resume/<id>/  - update resume
    """

    queryset = Resume.objects.all()
    serializer_class = ResumeSerializer

    def list(self, request, *args, **kwargs):
        """Return the first resume if exists, otherwise empty list."""
        resume = Resume.objects.first()
        if resume:
            serializer = self.get_serializer(resume)
            return Response([serializer.data])
        return Response([])

    def create(self, request, *args, **kwargs):
        """Create a new resume with nested related records."""
        data = parse_request_data(request.data)
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        """Update an existing resume and replace nested records."""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        data = parse_request_data(request.data)
        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
