from flask import Blueprint, request, current_app, jsonify, make_response
# from api.models import Role, db
from api.models.roles import Role
from utils.create_db import db
from api.auth_middleware import token_required

role_bp = Blueprint('role', __name__)


@role_bp.route("/create_role", methods=["POST"])
@token_required
def create_role(current_user):
    data = request.json

    # check if role exist
    role = Role.query.filter_by(role_code=data['role_code']).first()

    if role:
        return make_response(jsonify({'message': 'Role already exists.'}), 400)

    # Create new role
    try:
        new_role = Role(
            role_name=data['role_name'],
            description=data['description'],
            role_code=data['role_code'],
            create_user=current_user.id
        )

        db.session.add(new_role)
        db.session.commit()

        return jsonify({'message': 'Role created successfully', 'data': new_role.to_dict()}), 201

    except Exception as e:
        return jsonify({"error": "Something went wrong", "message": str(e)}), 500

@role_bp.route("/get_role_list", methods=["POST"])
@token_required
def get_role_list(current_user):
    data = request.json
    page = data.get("page", 1)
    per_page = data.get("per_page", 10)

    # Query roles with pagination
    try:
        paginated_role = Role.query.paginate(page=page, per_page=per_page, error_out=False)

        # Serialize the roles for the current page
        role = [role.to_dict() for role in paginated_role.items]

        return jsonify({
            'total': paginated_role.total,
            'pages': paginated_role.pages,
            'current_page': paginated_role.page,
            'next_page': paginated_role.next_num,
            'prev_page': paginated_role.prev_num,
            'per_page': paginated_role.per_page,
            'data': role
        }), 200

    except Exception as e:
        return jsonify({"error": "Something went wrong", "message": str(e)}), 500

@role_bp.route("/get_role", methods=["GET"])
@token_required
def get_role(current_user):
    role_code = request.args.get('role_code')

    role = Role.query.filter_by(role_code=role_code).first()

    if not role or role is None:
        return jsonify({"message": "Role does not exist"}), 400

    return jsonify(role.to_dict()), 200
