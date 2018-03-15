"""All database related exceptions.   """


class DatabaseException(Exception):
    """Base class for all database related exception.   """


class AssetPathError(DatabaseException):
    """Asset outside root directory is not allowed.   """
