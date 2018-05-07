"""File database.   """

import mimetypes

from sqlalchemy import Column, Integer, String

from .. import exceptions
from .core import Base, Path, SerializableMixin
from ..filetools import relpath


class File(Base, SerializableMixin):
    """File table.  """

    __tablename__ = 'File'
    id = Column(Integer, primary_key=True)
    label = Column(String)
    path = Column(Path, unique=True)
    mimetype = Column(String)

    @classmethod
    def add(cls, filename, session, label=None):
        """Add new file from filename.

        Args:
            filename (str): Filename.
            session (sqlalchemy.orm.session.Session): Database session.
            label (str, optional): Defaults to None. File label.

        Raises:
            exceptions.DuplicatePathError: When file already in database.

        Returns:
            File: Added file.
        """

        path = relpath(filename)

        if session.query(cls).filter(cls.path == filename).first():
            raise exceptions.DuplicatePathError

        label = label or path.name
        mimetype, _ = mimetypes.guess_type(path.as_posix())
        item = cls(
            path=path,
            label=label,
            mimetype=mimetype,
        )
        session.add(item)
        return item

    def to_tuple(self):
        """Convert asset to tuple, for frontend.  """

        return (
            self.id,
            self.name,
            self.path and self.path.as_posix(),
            self.mimetype
        )
