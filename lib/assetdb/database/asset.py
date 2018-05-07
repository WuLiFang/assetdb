"""Asset database.   """


from sqlalchemy import Column, ForeignKey, Integer, String, Table
from sqlalchemy.orm import relationship

from .core import Base

ASSET_FILE = Table('Asset_File', Base.metadata,
                   Column('asset_id', Integer, ForeignKey('Asset.id')),
                   Column('file_id', Integer, ForeignKey('File.id')))


class Asset(Base):
    """Asset table.  """

    __tablename__ = 'Asset'
    id = Column(Integer, primary_key=True)
    category_id = Column(Integer, ForeignKey('Category.id'))
    category = relationship('Category', back_populates='assets')
    name = Column(String)
    description = Column(String)
    files = relationship('File', secondary=ASSET_FILE)

    def to_tuple(self):
        """Convert asset to tuple, for frontend.  """
        return (
            self.id,
            self.category_id,
            self.name,
            self.description
        )
