import { TableRow, TableCell } from 'components/UI/table'
import { Badge } from 'components/UI/badge'
import { Button } from 'components/UI/button'
import { TooltipWrapper } from 'components/UI/tooltip_wrapper'

interface IAdminUserSetting {
  id: number
  name: string
  email: string
  department: string
  role: string
  status: string
}
type AdminUserTableRowProps = {
  user: IAdminUserSetting
  handleUserStatusChange: (user: IAdminUserSetting, newStatus: string) => void
  handleUserEdit: (user: IAdminUserSetting) => void
  handleUserDelete: (user: IAdminUserSetting) => void
}
export const AdminUserTableRow: React.FC<AdminUserTableRowProps> = ({
  user,
  handleUserStatusChange,
  handleUserEdit,
  handleUserDelete,
}) => {
  return (
    <TableRow key={user.id}>
      <TableCell className="font-medium">{user.name}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.department}</TableCell>
      <TableCell>{user.role}</TableCell>
      <TableCell>
        <Badge
          className={
            user.status === 'Active'
              ? 'bg-emerald-700 text-white-100 hover:bg-emerald-600'
              : user.status === 'Inactive'
              ? 'bg-rose-700 text-white-100 hover:bg-rose-600'
              : 'bg-amber-500 text-black hover:bg-amber-400'
          }
        >
          {user.status}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          {/**not used for now */}
          {/*
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              handleUserStatusChange(
                user,
                user.status === 'Active' ? 'Inactive' : 'Active'
              )
            }
          >
            <PowerIcon className="h-4 w-4" />
            <span className="sr-only">
              {user.status === 'Active' ? 'Deactivate' : 'Activate'}
            </span>
          </Button>
          */}
          <TooltipWrapper
            children={
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleUserEdit(user)}
              >
                <FilePenIcon className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
            }
            tooltipContent={'Edit User'}
          />
          <TooltipWrapper
            children={
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleUserDelete(user)}
              >
                <TrashIcon className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            }
            tooltipContent={'Delete User'}
          />
        </div>
      </TableCell>
    </TableRow>
  )
}

function FilePenIcon(props) {
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
      <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" />
    </svg>
  )
}

function PowerIcon(props) {
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
      <path d="M12 2v10" />
      <path d="M18.4 6.6a9 9 0 1 1-12.77.04" />
    </svg>
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

function TrashIcon(props) {
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
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  )
}
