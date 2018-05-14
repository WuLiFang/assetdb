"""Expose asset storage.  """
from flask import send_from_directory, make_response, send_file

from .. import setting
from .app import APP
from ..database import session_scope, File, Asset


@APP.route(f'/storage/<path:filename>')
def get_storage(filename):
    """Get storage file from filename.  """
    return send_from_directory(setting.ROOT, filename)


@APP.route(f'/storage/id/<id_>')
def get_storage_from_id(id_):
    """Get storage file from filename.  """
    with session_scope() as sess:
        file_ = sess.query(File).get(id_)
        if not file_:
            return 'No such file.', 404

        assert isinstance(file_, File), type(file_)
        return send_from_directory(setting.ROOT, file_.path.as_posix())


@APP.route(f'/storage/asset/<id_>')
def get_packed(id_):
    """Get packed files.  """

    with session_scope() as sess:
        asset = sess.query(Asset).get(id_)
        if not asset:
            return make_response('无此资产', 404)

        assert isinstance(asset, Asset), type(asset)

        return send_file(asset.pack(), as_attachment=True,
                         attachment_filename=f'资产打包_{asset.name}.zip',
                         add_etags=False)
