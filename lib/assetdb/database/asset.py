"""Asset database.   """

import mimetypes
from pathlib import PurePath

from sqlalchemy import Column, ForeignKey, Integer, String

from . import exceptions
from .. import setting
from .category import Category
from .core import Base, Path, session_scope


class Asset(Base):
    """Asset table.  """

    __tablename__ = 'Asset'
    id = Column(Integer, primary_key=True)
    category_id = Column(Integer, ForeignKey('Category.id'))
    name = Column(String)
    path = Column(Path, unique=True)
    memetype = Column(String)
    description = Column(String)

    def to_tuple(self):
        """Convert asset to tuple, for frontend.  """
        return (
            self.id,
            self.category_id,
            self.name,
            self.path and self.path.as_posix(),
            self.memetype,
            self.description
        )

    @staticmethod
    def add(path, session, name=None):
        """Add new asset from path

        Args:
            path (str): Asset path.
            session (sqlalchemy.orm.session.Session): Database session.
            name (str, optional): Defaults to None. Asset name as a label.

        Raises:
            exceptions.PathError: When path is outside the root directory.
            exceptions.DuplicatePathError: When path already in database.
        """

        path = PurePath(path)
        name = name or path.name
        memetype, _ = mimetypes.guess_type(path.as_posix())
        category_path = path.parent.relative_to(setting.ROOT).as_posix()

        try:
            path = path.relative_to(setting.ROOT)
        except ValueError:
            raise exceptions.PathError(path)

        if session.query(Asset).filter(Asset.path == path).first():
            raise exceptions.DuplicatePathError

        category = session.query(Category).filter(
            Category.path == category_path).one()
        asset = Asset(
            category_id=category.id,
            name=name,
            path=path,
            memetype=memetype
        )
        session.add(asset)


def add_assets(filenames):
    """Add many assets.  """

    with session_scope() as sess:
        for i in filenames:
            try:
                Asset.add(i, sess)
            except (exceptions.PathError, exceptions.DuplicatePathError):
                continue
