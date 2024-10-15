from enum import Enum
from typing import List


class DepartmentEnum(Enum):
    ADMINISTRATION = ("01", "Administration",
                      "Handles overall management, including human resources, finance, and legal matters.")
    IT = ("02", "IT",
          "Manages electronic health records, IT infrastructure, cybersecurity, and data analytics.")
    LAW = ("03", "Law",
           "Manages budgeting, billing, payroll, and financial reporting.")
    MARKETING = ("04", "Marketing",
                 "Handles recruitment, employee relations, training, and benefits administration.")
    FINANCE = ("05", "Finance",
               "Ensures compliance with healthcare standards and regulations, conducts audits, and implements quality improvement initiatives.")
    PROJECT_MANAGER = ("06", "Project Manager",
                       "Conducts medical research and clinical trials, often without direct patient interaction.")

    # PROCUREMENT_AND_SUPPLY_CHAIN_MANAGEMENT = ("07", "Procurement and Supply Chain Management",
    #                                            "Manages the acquisition and distribution of medical supplies and equipment.")
    # MARKETING_AND_COMMUNICATIONS = ("08", "Marketing and Communications",
    #                                 "Handles public relations, marketing campaigns, and internal communications.")
    # HEALTH_EDUCATION_AND_TRAINING = ("09", "Health Education and Training",
    #                                  "Develops and delivers training programs for healthcare professionals, often without direct patient contact.")
    # FACILITIES_MANAGEMENT = ("10", "Facilities Management",
    #                          "Oversees the maintenance and operation of the healthcare facility, including housekeeping and security.")
    # LEGAL_AND_COMPLIANCE = ("11", "Legal and Compliance",
    #                         "Manages legal issues, contracts, and ensures compliance with healthcare laws and regulations.")
    # MEDICAL_CODING_AND_BILLING = (
    # "12", "Medical Coding and Billing", "Handles the coding of medical procedures and billing processes.")
    # DATA_ANALYTICS_AND_REPORTING = ("13", "Data Analytics and Reporting",
    #                                 "Analyzes healthcare data to support decision-making and improve services.")
    # PROJECT_MANAGEMENT = ("14", "Project Management",
    #                       "Manages various projects within the healthcare organization, ensuring they are completed on time and within budget.")
    # HEALTH_POLICY_AND_PLANNING = ("15", "Health Policy and Planning",
    #                               "Develops and implements health policies and strategic plans for the organization.")
    # USUAL_BUSINESS_OPERATIONS = ("16", "Usual Business Operations",
    #                              "Handles day-to-day operations, including meeting minutes and business documentations.")
    # SECURITY = ("17", "Security",
    #             "The security department keeps the organization's assets safe.")

    def __init__(self, code, name, description):
        self._code = code
        self._name = name
        self._description = description

    @property
    def code(self):
        return self._code

    @property
    def name(self) -> str:
        """ Return Department name, EG IT, LAW """
        return self._name

    @property
    def description(self):
        return self._description

    @property
    def all_department_name(self) -> List[str]:
        """ Return ALL Department name, EG: ["IT", "LAW"]"""
        return [department.name for department in DepartmentEnum]
