from flask import Blueprint, request, current_app, jsonify, make_response
# from api.models import User
from api.models.users import User
import jwt
from flask_bcrypt import Bcrypt
from datetime import datetime, timedelta
from api.auth_middleware import token_required
from utils.time_converter import convert_time

auth_bp = Blueprint('auth', __name__)

bcrypt = Bcrypt()

blacklist = set()

@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        data = request.json
        if not data:
            return jsonify({"message": "Please provide user details", "error": "Bad request"}), 400

        user = User.query.filter_by(username=data['username']).first()
        if not user or user is None:
            return jsonify({"message": "User not found", "error": "Unauthorized"}), 404

        if bcrypt.check_password_hash(user.password, data['password']):
            try:
                # token should expire after 2 hrs
                token = jwt.encode({
                    'username': data['username'],
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'department_name': user.department.department_name,
                    'role_name': user.role.role_name
                }, current_app.config['SECRET_KEY'])
                expired_time = datetime.utcnow() + timedelta(hours=2)
                expired_time = convert_time(expired_time)
                return jsonify({'token': token, 'expired time': expired_time,'message': 'Login successful'}), 201

            except Exception as e:
                return jsonify({"error": "Something went wrong", "message": str(e)}), 500
        return jsonify({"message": "Incorrect password", "error": "Unauthorized"}), 404
    except Exception as e:
        return jsonify({"message": "Something went wrong!", "error": str(e)}), 500

@auth_bp.route("/logout", methods=["POST"])
@token_required
def logout(current_user):
    token = request.headers.get('Authorization')  # Retrieve the token from the Authorization header

    if token:
        try:
            # Remove 'Bearer ' prefix if present
            token = token.replace('Bearer ', '')

            # Decode the token to get its payload (not necessarily required for blacklisting)
            jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])

            # Add the token to the blacklist
            blacklist.add(token)
            print(blacklist)
            return jsonify(message='Successfully logged out'), 200

        except jwt.ExpiredSignatureError:

            return jsonify(message='Token has expired'), 401

        except jwt.InvalidTokenError:
            return jsonify(message='Invalid token'), 401
    else:
        return jsonify(message='Token is missing'), 401
