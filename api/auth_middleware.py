from functools import wraps
import jwt
from flask import request, current_app, jsonify
# from api.models import User
from api.models.users import User


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        # Retrieve the token from the Authorization header
        if "Authorization" in request.headers:
            token = request.headers["Authorization"].split(" ")[1]

        if not token:
            return jsonify({"message": "Authentication Token is missing!", "error": "Unauthorized"}), 401

        try:
            # Decode the JWT token
            data = jwt.decode(token, current_app.config["SECRET_KEY"], algorithms=["HS256"])
            current_user = User.query.filter_by(username=data['username']).first()

            if current_user is None:
                return jsonify({"message": "Invalid Authentication token!", "error": "Unauthorized"}), 401

            if not current_user.status == '01':
                return jsonify({"message": "Account is inactive!", "error": "Forbidden"}), 403

        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token has expired!", "error": "Unauthorized"}), 401

        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid Token!", "error": "Unauthorized"}), 401

        except Exception as e:
            return jsonify({"message": "Something went wrong", "error": str(e)}), 500

        return f(current_user, *args, **kwargs)

    return decorated