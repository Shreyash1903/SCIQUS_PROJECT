from rest_framework import permissions


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow admins to edit objects.
    Students and other users can only read.
    """

    def has_permission(self, request, view):
        # Read permissions are allowed to any authenticated user
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated

        # Write permissions only to admin users
        return (request.user and
                request.user.is_authenticated and
                (request.user.is_superuser or request.user.role == 'admin'))


class IsAdminUser(permissions.BasePermission):
    """
    Custom permission to only allow admin users.
    """

    def has_permission(self, request, view):
        return (request.user and
                request.user.is_authenticated and
                (request.user.is_superuser or request.user.role == 'admin'))


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object or admin users to edit it.
    """

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any authenticated user
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions only to the owner or admin
        if hasattr(obj, 'user'):
            return obj.user == request.user or request.user.is_superuser or request.user.role == 'admin'

        return request.user.is_superuser or request.user.role == 'admin'


class IsStudentOwnerOrAdmin(permissions.BasePermission):
    """
    Custom permission for student-specific objects.
    Students can only access their own data, admins can access all.
    """

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Admin users have full access
        if request.user.is_superuser or request.user.role == 'admin':
            return True

        # Students can only access their own records
        if hasattr(obj, 'user'):
            return obj.user == request.user

        return False


class IsStudentOrAdmin(permissions.BasePermission):
    """
    Custom permission to allow students to enroll themselves in courses
    and admins to enroll any student.
    """

    def has_permission(self, request, view):
        print(
            f"🔍 Permission check - User: {request.user.username if request.user.is_authenticated else 'Anonymous'}")
        print(f"🔍 User authenticated: {request.user.is_authenticated}")
        print(f"🔍 User role: {getattr(request.user, 'role', 'No role')}")
        print(
            f"🔍 Is superuser: {getattr(request.user, 'is_superuser', False)}")

        result = (request.user and
                  request.user.is_authenticated and
                  (request.user.role in ['student', 'admin'] or request.user.is_superuser))

        print(f"🔍 Permission result: {result}")
        return result
