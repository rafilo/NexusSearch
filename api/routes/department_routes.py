from flask import Blueprint, request, current_app, jsonify, make_response
# from api.models import Department, db
from api.models.departments import Department
from utils.create_db import db
from api.auth_middleware import token_required

department_bp = Blueprint('department', __name__)


@department_bp.route("/create_department", methods=["POST"])
@token_required
def create_department(current_user):
    data = request.json

    # check if department exist
    department = Department.query.filter_by(department_code=data['department_code']).first()

    if department:
        return make_response(jsonify({'error': 'Department already exists.'}), 400)

    # Create new department
    try:
        new_department = Department(
            department_name=data['department_name'],
            description=data['description'],
            create_user=current_user.id,
            department_code=data['department_code']
        )

        db.session.add(new_department)
        db.session.commit()

        return jsonify({'message': 'Department created successfully', 'data': new_department.to_dict()}), 201

    except Exception as e:
        return jsonify({"error": "Something went wrong", "message": str(e)}), 500

@department_bp.route("/get_department_list", methods=["POST"])
@token_required
def get_department_list(current_user):
    data = request.json
    page = data.get("page", 1)
    per_page = data.get("per_page", 10)

    # Query departments with pagination
    try:
        paginated_department = Department.query.paginate(page=page, per_page=per_page, error_out=False)

        # Serialize the departments for the current page
        department = [department.to_dict() for department in paginated_department.items]

        return jsonify({
            'total': paginated_department.total,
            'pages': paginated_department.pages,
            'current_page': paginated_department.page,
            'next_page': paginated_department.next_num,
            'prev_page': paginated_department.prev_num,
            'per_page': paginated_department.per_page,
            'data': department
        }), 200

    except Exception as e:
        return jsonify({"error": "Something went wrong", "message": str(e)}), 500

@department_bp.route("/get_department", methods=["GET"])
@token_required
def get_department(current_user):
    department_code = request.args.get('department_code')

    department = Department.query.filter_by(department_code=department_code).first()

    if not department or department is None:
        return jsonify({"message": "Department does not exist"}), 400

    return jsonify(department.to_dict()), 200
