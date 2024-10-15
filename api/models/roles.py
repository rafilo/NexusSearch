# from api.app import db
from datetime import datetime
from utils.create_db import db
from utils.time_converter import convert_time

class Role(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    role_name = db.Column(db.String(50), unique=True, nullable=False)
    role_code = db.Column(db.String(2), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True)
    create_user = db.Column(db.Integer, nullable=True)
    create_time = db.Column(db.DateTime, default=datetime.utcnow)
    update_time = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    users = db.relationship('User', backref='role', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'role_name': self.role_name,
            'role_code': self.role_code,
            'description': self.description,
            'create_user': self.create_user,
            'create_time': convert_time(self.create_time),
            'update_time': convert_time(self.update_time)
        }