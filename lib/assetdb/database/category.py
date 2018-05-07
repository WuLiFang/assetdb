"""Database category table.  """
from pathlib import PurePath

from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from .. import setting
from .core import Base, Path, SerializableMixin
from .. import exceptions
from ..filetools import relpath


class Category(Base, SerializableMixin):
    """Category table.  """

    __tablename__ = 'Category'
    id = Column(Integer, primary_key=True)
    parent_id = Column(Integer, ForeignKey(f'{__tablename__}.id'))
    parent = relationship(__tablename__,
                          uselist=False,
                          remote_side=[id])
    children = relationship(__tablename__,
                            back_populates='parent')
    name = Column(String)
    path = Column(Path, unique=True)
    assets = relationship('Asset', back_populates='category')

    @classmethod
    def add(cls, dirpath, session, name=None):
        """Add a category from dirpath.

        Args:
            dirpath (str): Dirpath relative to ROOT.
            name (str, optional): Defaults to None. Category name.
        """

        dirpath = PurePath(dirpath)
        name = name or dirpath.name

        path = relpath(dirpath)

        if session.query(Category).filter(Category.path == path).first():
            raise exceptions.DuplicatePathError

        if PurePath(dirpath) == PurePath(setting.ROOT):
            parent_id = None
        else:
            parent = session.query(Category).filter(
                Category.path == path.parent).one()
            parent_id = parent.id

        category = Category(
            parent_id=parent_id,
            name=name,
            path=path,
        )
        session.add(category)
