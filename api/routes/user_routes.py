from flask import Blueprint, request, current_app, jsonify, make_response
from api.models.users import User
from api.models.roles import Role
from api.models.departments import Department
from utils.create_db import db
from flask_bcrypt import Bcrypt
from api.auth_middleware import token_required

user_bp = Blueprint('user', __name__)


@user_bp.route("/create_user", methods=["POST"])
@token_required
def create_user(current_user):
    data = request.json

    # check if user exist
    user = User.query.filter_by(username=data['username']).first()

    if user:
        return jsonify({"message": "User already exists"}), 400

    # check if role exist
    role = Role.query.filter_by(role_code=data['role_code']).first()

    if not role or role is None:
        return jsonify({"message": "Role does not exist"}), 400

    # check if department exist
    department = Department.query.filter_by(department_code=data['department_code']).first()

    if not department or department is None:
        return jsonify({"message": "Department does not exist"}), 400

    # Hash the password
    password = Bcrypt().generate_password_hash(data['password']).decode('utf-8')

    # Create and add the new user
    try:
        new_user = User(
            username=data['username'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            email=data['email'],
            password=password,
            role_id=role.id,
            department_id=department.id
        )

        db.session.add(new_user)
        db.session.commit()

        return jsonify({'message': 'User created successfully', 'data': new_user.to_dict()}), 201

    except Exception as e:
        return jsonify({"error": "Something went wrong", "message": str(e)}), 500


@user_bp.route("/get_user_list", methods=["POST"])
@token_required
def get_user_list(current_user):
    data = request.json
    page = data.get("page", 1)
    per_page = data.get("per_page", 10)

    # Query users with pagination
    try:
        paginated_users = User.query.paginate(page=page, per_page=per_page, error_out=False)

        # Serialize the users for the current page
        users = [user.to_dict() for user in paginated_users.items]

        return jsonify({
            'total': paginated_users.total,
            'pages': paginated_users.pages,
            'current_page': paginated_users.page,
            'next_page': paginated_users.next_num,
            'prev_page': paginated_users.prev_num,
            'per_page': paginated_users.per_page,
            'data': users
        }), 200

    except Exception as e:
        return jsonify({"error": "Something went wrong", "message": str(e)}), 500

@user_bp.route("/get_user", methods=["GET"])
@token_required
def get_user(current_user):
    username = request.args.get('username')

    user = User.query.filter_by(username=username).first()

    if not user or user is None:
        return jsonify({"message": "User does not exist"}), 400

    return jsonify(user.to_dict()), 200

# @user_bp.route("/update_user", methods=["POST"])
# @token_required
# def update_user(current_user):
#     data = request.json
#     user = User.query.filter_by(username=data['username']).first()
#
#     if not user or user is None:
#         return jsonify({"message": "User does not exist"}), 400
#
#     user.username = data['username']
#     user.first_name = data['first_name']

