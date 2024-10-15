# from api.app import db
from datetime import datetime
from utils.create_db import db
from utils.time_converter import convert_time

class Department(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    department_name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True)
    department_code = db.Column(db.String(2), unique=True, nullable=False)
    create_user = db.Column(db.Integer, nullable=True)
    create_time = db.Column(db.DateTime, default=datetime.utcnow)
    update_time = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    users = db.relationship('User', backref='department', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'department_name': self.department_name,
            'description': self.description,
            'department_code': self.department_code,
            'create_user': self.create_user,
            'create_time': convert_time(self.create_time),
            'update_time': convert_time(self.update_time)
        }