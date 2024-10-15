import { useState, useMemo, useEffect } from 'react'
import { Input } from 'components/UI/input'
import { Card, CardContent } from 'components/UI/card'
import { AdminUserPanelDropdown } from './components/user_panel_dropdown'
import {
  departmentFilterData,
  roleFilterData,
  headerTitle,
  headerDesc,
} from 'components/Config/admin_user_setting_config'
import { Button } from 'components/UI/button'
import { Plus } from 'lucide-react'
import { CreateUserDialog } from './components/createUser/create_user_dialog'
import AdminUserTable from './components/editableTable/user_panel_table_new'
import { UsetSettingTableColumns } from './components/editableTable/editable_table_elements'
import axiosInstance from 'components/Hooks/axios_instance'
import { roleMapping, statusMapping, departmentMapping } from 'utils/mapping'
import { useToast } from 'components/UI/use_toast'

export const AdminUserPanel = () => {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState({
    role: 'all',
    status: 'all',
    department: 'all',
  })
  const { toast } = useToast()


  const testData = {
    current_page: 1,
    data: [
      {
        id: 1,
        username: 'John001',
        name: 'John Doe',
        email: 'john@example.com',
        department: 'IT',
        role: 'Admin',
        status: 'Active',
      },
      {
        id: 2,
        username: 'Jane001',
        name: 'Jane Smith',
        email: 'jane@example.com',
        department: 'Law',
        role: 'User',
        status: 'Inactive',
      },
      {
        id: 3,
        username: 'Bob001',
        name: 'Bob Johnson',
        email: 'bob@example.com',
        department: 'Marketing',
        role: 'User',
        status: 'Active',
      },
      {
        id: 4,
        username: 'Alic001',
        name: 'Alice Williams',
        email: 'alice@example.com',
        department: 'Finance',
        role: 'User',
        status: 'Inactive',
      },
      {
        id: 5,
        username: 'Tom001',
        name: 'Tom Davis',
        email: 'tom@example.com',
        department: 'PM',
        role: 'Admin',
        status: 'Active',
      },
      {
        id: 6,
        username: 'Tom001',
        name: 'Tom Davis',
        email: 'tom@example.com',
        department: 'PM',
        role: 'Admin',
        status: 'Active',
      },
      {
        id: 7,
        username: 'Tom001',
        name: 'Tom Davis',
        email: 'tom@example.com',
        department: 'PM',
        role: 'Admin',
        status: 'Active',
      },
    ],
  }
  const [tableData, setTableData] = useState([])
  const [originalTableData, setOriginalTableData] = useState([])

  const filteredUsers = useMemo(
    () =>
      tableData
        .filter((user) => {
          const searchValue = search.toLowerCase()
          const searchEmail = user.email
            ? user.email.toLowerCase().includes(searchValue)
            : false
          return user.name.toLowerCase().includes(searchValue) || searchEmail
        })
        .filter((user) => {
          if (filter.role === 'all') {
            return true
          }
          return user.role.toLowerCase() === filter.role.toLowerCase()
        })
        .filter((user) => {
          if (filter.status === 'all') {
            return true
          }
          return user.status.toLowerCase() === filter.status.toLowerCase()
        })
        .filter((user) => {
          if (filter.department === 'all') {
            return true
          }
          const userDepartment = user.department.replace(' ', '_')
          return (
            userDepartment.toLowerCase() === filter.department.toLowerCase()
          )
        }),
    [search, filter, tableData]
  )

  const handleSearch = (e) => {
    setSearch(e.target.value)
  }

  const handleFilterChange = (key, value) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      [key]: value,
    }))
  }

  const fetchUserData = async () => {
    await axiosInstance
      .post('http://localhost:3001/api/get_user_list', {
        page: 1,
        per_page: 1000,
      })
      .then((response) => {
        console.log('fetch user:', response.data)
        const userTableData = response.data.data
        let mappedTableData = []
        userTableData.forEach((data) => {
          mappedTableData.push({
            id: data.id,
            username: data.username,
            name: data.full_name,
            email: data.email,
            department: departmentMapping[data.department_code],
            role: roleMapping[data.role_code],
            status: statusMapping[data.status],
          })
        })
        setTableData(mappedTableData)
        setOriginalTableData(mappedTableData)
        //setLoading(false)
      })
      .catch((error) => {
        toast({
          title: 'get user data error:',
          description: error.data.message,
        })
      })
  }

  useEffect(() => {
    fetchUserData()
  }, [])

  return (
    <div className="flex items-center justify-center gap-4 p-8 w-full h-[calc(100%-50px)]">
      <Card className="w-full h-full">
        <div className="card-header flex flex-row space-y-1.5 p-6">
          <div className="w-5/6 flex-auto">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">
              {headerTitle}
            </h3>
            <p className="text-sm text-muted-foreground">{headerDesc}</p>
          </div>
          <CreateUserDialog
            triggerButton={
              <Button className="flex-auto" variant="default" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Create
              </Button>
            }
          />
        </div>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center pb-5">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users..."
                value={search}
                onChange={handleSearch}
                className="pl-8 w-full focus:border-gray-400 focus:border-2 focus-visible:ring-0"
              />
            </div>
            <div className="flex items-center gap-2">
              <AdminUserPanelDropdown
                filterType="role"
                dropdownData={roleFilterData}
                filter={filter}
                handleFilterChange={handleFilterChange}
              />
              <AdminUserPanelDropdown
                filterType="department"
                dropdownData={departmentFilterData}
                filter={filter}
                handleFilterChange={handleFilterChange}
              />
            </div>
          </div>
          <Card className="h-[530px] overflow-y-auto relative">
            <AdminUserTable
              columns={UsetSettingTableColumns}
              data={filteredUsers}
              originalData={originalTableData}
              setTableData={setTableData}
              setOriginalTableData={setOriginalTableData}
            />
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}

function SearchIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}
