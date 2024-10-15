import { createColumnHelper } from '@tanstack/react-table'
import { ChangeEvent, useEffect, useState } from 'react'
import { Input } from 'components/UI/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'components/UI/select'
import { TooltipWrapper } from 'components/UI/tooltip_wrapper'
import { Button } from 'components/UI/button'
import { FilePenIcon, PenOff, Save, Trash2 } from 'lucide-react'
import { Badge } from 'components/UI/badge'
import { cn } from 'lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from 'components/UI/tooltip'
import { useToast } from 'components/UI/use_toast'
import { ControlledAlertDialogWrapper } from 'components/UI/controlled_alert_dialog'

type SelectOptionType = {
  label: string
  value: string
}

export type UserSettingType = {
  id: number
  name: string
  username: string
  email: string
  department: string
  role: string
  status: string
}

const TableCell = ({ getValue, row, column, table }) => {
  const initialValue = getValue()
  const columnMeta = column.columnDef.meta
  const tableMeta = table.options.meta
  const [value, setValue] = useState('')
  const [validationMessage, setValidationMessage] = useState('')

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const displayValidationMessage = <
    T extends HTMLInputElement | HTMLSelectElement,
  >(
    e: ChangeEvent<T>
  ) => {
    if (columnMeta?.validationMessage) {
      const isValid = columnMeta.validate(e.target.value)
      if (isValid) {
        e.target.setCustomValidity('')
        setValidationMessage('')
      } else {
        e.target.setCustomValidity(columnMeta.validationMessage)
        setValidationMessage(columnMeta.validationMessage)
      }
    } else if (e.target.validity.valid) {
      setValidationMessage('')
    } else {
      setValidationMessage(e.target.validationMessage)
    }
  }

  const onBlur = (e) => {
    displayValidationMessage(e)
    tableMeta?.updateCell(row.index, column.id, value, e.target.validity.valid)
  }

  const onSelectChange = (value) => {
    setValue(value)
    tableMeta?.updateCell(row.index, column.id, value)
  }

  if (tableMeta?.editedRows[row.id]) {
    return columnMeta?.type === 'select' ? (
      <Select
        onValueChange={onSelectChange}
        defaultValue={initialValue}
        required={columnMeta?.required}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a city" />
        </SelectTrigger>
        <SelectContent>
          {columnMeta?.options?.map((option: SelectOptionType) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ) : validationMessage ? (
      <Tooltip>
        <TooltipTrigger asChild>
          <Input
            className={cn(
              column.id === 'name'
                ? 'w-32'
                : column.id === 'username'
                ? 'w-20'
                : 'w-40',
              'invalid:border-red-500'
            )}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={onBlur}
            type={column.columnDef.meta?.type || 'text'}
            required={columnMeta?.required}
            pattern={columnMeta?.pattern}
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>{validationMessage}</p>
        </TooltipContent>
      </Tooltip>
    ) : (
      <Input
        className={cn(
          column.id === 'name'
            ? 'w-32'
            : column.id === 'username'
            ? 'w-24'
            : 'w-40',
          'invalid:border-red-500'
        )}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
        type={column.columnDef.meta?.type || 'text'}
        required={columnMeta?.required}
        pattern={columnMeta?.pattern}
      />
    )
  } else {
    return column.id === 'status' ? (
      <Badge
        className={
          value === 'Active'
            ? 'bg-emerald-700 text-white-100 hover:bg-emerald-600'
            : value === 'Inactive'
            ? 'bg-rose-700 text-white-100 hover:bg-rose-600'
            : 'bg-amber-500 text-black hover:bg-amber-400'
        }
      >
        {value}
      </Badge>
    ) : (
      <span>{value}</span>
    )
  }
}

const EditCell = ({ row, table }) => {
  const meta = table.options.meta
  const validRow = meta?.validRows[row.id]
  const disableSubmit = validRow
    ? Object.values(validRow)?.some((item) => !item)
    : false
  const { toast } = useToast()
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const saveUserEdit = async (currentButton) => {
    //await api
    console.log(row.original)
    setIsSaving(true)
    currentButton.setAttribute('disabled', 'true')
    const cancelUserEditButton =
      document.getElementById('cancelUserEdit').children[0]
    cancelUserEditButton.setAttribute('disabled', 'true')
    setTimeout(() => {
      currentButton.removeAttribute('disabled')
      cancelUserEditButton.removeAttribute('disabled')
      setIsSaving(false)
      toggleCurrentRowEdit()
      toast({
        title: 'Save user setting success',
        description: 'Save user setting success',
      })
    }, 3000)
  }

  const toggleCurrentRowEdit = () => {
    meta?.setEditedRows((old: []) => ({
      ...old,
      [row.id]: !old[row.id],
    }))
  }

  const setEditedRows = (e) => {
    const elName = e.currentTarget.parentElement.getAttribute('id')

    const currentButton = e.currentTarget
    if (elName === 'submitUserEdit') {
      //await api
      //mock save user success
      saveUserEdit(currentButton)
    } else if (elName === 'userEdit') {
      toggleCurrentRowEdit()
    } else if (elName === 'cancelUserEdit') {
      meta?.revertRow(row.index, elName === 'cancelUserEdit')
      toggleCurrentRowEdit()
    }
  }

  const deleteSelectedRow = () => {
    // mock delete user success

    const editButton = document.getElementById('userEdit').children[0]
    const currentButton = document.getElementById('userDelete').children[0]
    currentButton.setAttribute('disabled', 'true')
    editButton.setAttribute('disabled', 'true')
    setIsDeleting(true)
    setTimeout(() => {
      setIsDeleting(false)
      currentButton.removeAttribute('disabled')
      editButton.removeAttribute('disabled')
      toast({
        title: 'Delete user setting success',
        description: 'Delete user setting success',
      })
    }, 3000)

    meta?.deleteRow(row.index)
    setOpenDeleteAlert(false)
  }

  const cancelDelete = () => {
    setOpenDeleteAlert(false)
  }

  return meta?.editedRows[row.id] ? (
    <div className="flex items-center gap-4">
      <div id="submitUserEdit">
        <TooltipWrapper
          children={
            <Button
              variant="outline"
              size="icon"
              onClick={setEditedRows}
              disabled={disableSubmit}
            >
              <Save className="h-4 w-4" />
              <span className="sr-only">Save Edit</span>
            </Button>
          }
          tooltipContent={'Save Edit'}
        />
      </div>
      <div id="cancelUserEdit">
        <TooltipWrapper
          children={
            <Button variant="outline" size="icon" onClick={setEditedRows}>
              <PenOff className="h-4 w-4" />
              <span className="sr-only">Cancel Edit</span>
            </Button>
          }
          tooltipContent={'Cancel Edit'}
        />
      </div>
      <span className={cn(isSaving ? 'inline' : 'hidden')}>
        <svg
          aria-hidden="true"
          role="status"
          className="inline w-4 h-4 me-3 text-white animate-spin"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="#E5E7EB"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentColor"
          />
        </svg>
        Saving...
      </span>
    </div>
  ) : (
    <div className="flex items-center gap-4">
      <div id="userEdit">
        <TooltipWrapper
          children={
            <Button variant="outline" size="icon" onClick={setEditedRows}>
              <FilePenIcon className="h-4 w-4" />
              <span className="sr-only">Edit User</span>
            </Button>
          }
          tooltipContent={'Edit User'}
        />
      </div>

      <div id="userDelete">
        <ControlledAlertDialogWrapper
          alertTitle={'Sure to delete current user?'}
          alertDescription={
            'This action cannot be undone. This will permanently delete the user account and remove the user data from our servers.'
          }
          onContinueAction={deleteSelectedRow}
          onCancelAction={cancelDelete}
          open={openDeleteAlert}
        />

        <TooltipWrapper
          children={
            <Button
              variant="outline"
              size="icon"
              onClick={() => setOpenDeleteAlert(true)}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete User</span>
            </Button>
          }
          tooltipContent={'Delete User'}
        />
      </div>
      <span className={cn(isDeleting ? 'inline' : 'hidden')}>
        <svg
          aria-hidden="true"
          role="status"
          className="inline w-4 h-4 me-3 text-white animate-spin"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="#E5E7EB"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentColor"
          />
        </svg>
        Deleting...
      </span>
    </div>
  )
}

const columnHelper = createColumnHelper<UserSettingType>()

export const UsetSettingTableColumns = [
  columnHelper.accessor('name', {
    header: 'Name',
    cell: TableCell,
    meta: {
      type: 'text',
      required: true,
      pattern: '^[A-Za-z]+ [A-Za-z]+$',
    },
  }),
  columnHelper.accessor('username', {
    header: 'Username',
    cell: TableCell,
    meta: {
      type: 'text',
      required: true,
      pattern: '^[A-Za-z0-9]*$',
      validationMessage: 'username can only contain character and numbers.',
    },
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    cell: TableCell,
    meta: {
      type: 'email',
      required: false,
    },
  }),
  columnHelper.accessor('department', {
    header: 'Department',
    cell: TableCell,
    meta: {
      type: 'select',
      required: true,
      options: [
        { value: 'IT', label: 'IT' },
        { value: 'Law', label: 'Law' },
        { value: 'Marketing', label: 'Marketing' },
        { value: 'Finance', label: 'Finance' },
        { value: 'PM', label: 'PM' },
        { value: 'Administration', label: 'Administration' },
      ],
    },
  }),
  columnHelper.accessor('role', {
    header: 'Role',
    cell: TableCell,
    meta: {
      type: 'select',
      required: true,
      options: [
        { value: 'Admin', label: 'Admin' },
        { value: 'User', label: 'User' },
      ],
    },
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: TableCell,
    meta: {
      type: 'select',
      required: true,
      options: [
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' },
      ],
    },
  }),
  columnHelper.display({
    header: 'Action',
    id: 'Action',
    cell: EditCell,
  }),
]
