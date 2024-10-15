from enum import Enum
from typing import List


from enum import Enum

class CategoryEnum(Enum):
    FINANCE = "Finance"
    OTHERS = "Others"

    def __init__(self, name):
        self._name = name

    @property
    def name(self):
        return self._name  # We return the first element of the tuple

    @classmethod
    def all_category_list(cls):
        return [category.name for category in cls]


print(CategoryEnum.FINANCE.name)  # 输出: Finance
print(CategoryEnum.OTHERS.name)  # 输出: Others
print(CategoryEnum.all_category_list())  # 输出: ['Finance', 'Others']