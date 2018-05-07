"""All database related exceptions.   """


class DatabaseException(Exception):
    """Base class for all database related exception.   """


class PathError(DatabaseException):
    """Path outside the root directory is not allowed.   """


class DuplicatePathError(DatabaseException):
    """Path already in database.   """
