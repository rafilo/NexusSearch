# from api.app import db
from utils.user_enum import UserEnum
from datetime import datetime
from utils.create_db import db
from utils.time_converter import convert_time

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    first_name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(100), unique=False, nullable=True)
    password = db.Column(db.String(255), nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'), nullable=False)
    department_id = db.Column(db.Integer, db.ForeignKey('department.id'), nullable=False)
    status = db.Column(db.String(20), nullable=False, default=UserEnum.STATUS_ACTIVE.code)
    create_time = db.Column(db.DateTime, default=datetime.utcnow)
    update_time = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'full_name': self.first_name + ' ' + self.last_name,
            'email': self.email,
            'role_code': self.role.role_code,
            'department_code': self.department.department_code,
            'status': self.status,
            'create_time': convert_time(self.create_time),
            'update_time': convert_time(self.update_time)
        }