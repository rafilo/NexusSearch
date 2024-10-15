from enum import Enum

class UserEnum(Enum):
    STATUS_ACTIVE = ("01", "active")
    STATUS_INACTIVE = ("00", "inactive")

    def __init__(self, code, name):
        self._code = code
        self._name = name

    @property
    def code(self):
        return self._code

    @property
    def name(self):
        return self._name
