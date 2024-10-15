from enum import Enum

class RoleEnum(Enum):
    ADMIN = ("01", "Admin")
    USER = ("02", "User")

    def __init__(self, code, name):
        self._code = code
        self._name = name

    @property
    def code(self):
        return self._code

    @property
    def name(self):
        return self._name
