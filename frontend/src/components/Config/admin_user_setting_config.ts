export const departmentFilterData = {
  title: 'department',
  dropdownItems: [
    {
      label: 'All',
      value: 'all',
      isDisabled: false,
    },
    {
      label: 'IT',
      value: 'it',
      isDisabled: false,
    },
    {
      label: 'Law',
      value: 'law',
      isDisabled: false,
    },
    {
      label: 'Marketing',
      value: 'marketing',
      isDisabled: false,
    },
    {
      label: 'Finance',
      value: 'finance',
      isDisabled: false,
    },
    {
      label: 'Project managenemt',
      value: 'project_management',
      isDisabled: false,
    },
    {
      label: 'Administration',
      value: 'administration',
      isDisabled: false,
    },
  ],
}
export const roleFilterData = {
  title: 'role',
  dropdownItems: [
    {
      label: 'All',
      value: 'all',
      isDisabled: false,
    },
    {
      label: 'Admin',
      value: 'admin',
      isDisabled: false,
    },
    {
      label: 'User',
      value: 'user',
      isDisabled: false,
    },
  ],
}

export const createUserRoleDropdown = [
  {
    label: 'Admin',
    value: '01',
    isDisabled: false,
  },
  {
    label: 'User',
    value: '02',
    isDisabled: false,
  },
]

export const createUserDepartmentDropdown = [
  {
    label: 'Administration',
    value: '01',
    isDisabled: false,
  },
  {
    label: 'IT',
    value: '02',
    isDisabled: false,
  },
  {
    label: 'Law',
    value: '03',
    isDisabled: true,
  },
  {
    label: 'Marketing',
    value: '04',
    isDisabled: true,
  },
  {
    label: 'Finance',
    value: '05',
    isDisabled: true,
  },
  {
    label: 'Project Manager',
    value: '06',
    isDisabled: true,
  },
]

export const headerTitle = 'User Accounts Setting'
export const headerDesc = 'Manage user accounts for your organization.'

type formItemType = {
  name:
    | 'username'
    | 'first_name'
    | 'last_name'
    | 'email'
    | 'password'
    | 'department'
    | 'role'
  label: string
  type: string
  placeholder: string
  required: boolean
}

type createUserConfigType = {
  title: string
  description: string
  formItems: formItemType[]
  formFields: string[]
}

export const createUserConfig: createUserConfigType = {
  title: 'Create User',
  description: 'Create a new user account for your organization.',
  formItems: [
    {
      name: 'username',
      label: 'User name',
      type: 'text',
      placeholder: 'Enter user name',
      required: true,
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Enter password',
      required: true,
    },
    {
      name: 'first_name',
      label: 'First name',
      type: 'text',
      placeholder: 'Enter first name',
      required: true,
    },
    {
      name: 'last_name',
      label: 'Last name',
      type: 'text',
      placeholder: 'Enter last name',
      required: true,
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter email',
      required: true,
    },
    {
      name: 'department',
      label: 'Department',
      type: 'select',
      placeholder: 'Select department',
      required: true,
    },
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      placeholder: 'Select role',
      required: true,
    },
  ],
  formFields: [
    'username',
    'first_name',
    'last_name',
    'email',
    'password',
    'department',
    'role',
  ],
}
