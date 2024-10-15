import mimetypes
import os

from flask import Blueprint, send_from_directory, send_file, abort

file_bp = Blueprint('files', __name__)

@file_bp.route('/files/<path:filename>')
def get_generated_files(filename):
    """
    use url to access the generated files EG: localhost:3001/api/files/xxxxx.xxx
    able to download: .xlsx, docx, pdf, jpg, png, gif, zip, rar, mp3, mp4, avi
    """
    file_path = os.path.join('files', filename)

    if os.path.exists(file_path):
        # 获取文件的 MIME 类型
        mimetype, _ = mimetypes.guess_type(file_path)
        try:
            return send_file(file_path, as_attachment=True, mimetype=mimetype)
        except Exception as e:
            return str(e)
    else:
        abort(404)