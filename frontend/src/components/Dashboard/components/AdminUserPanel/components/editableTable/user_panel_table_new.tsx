import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'components/UI/table'
import { useState } from 'react'
import { useToast } from 'components/UI/use_toast'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  originalData: TData[]
  setTableData: React.Dispatch<React.SetStateAction<TData[]>>
  setOriginalTableData: React.Dispatch<React.SetStateAction<TData[]>>
}

export default function AdminUserTable<TData, TValue>({
  columns,
  data,
  originalData,
  setTableData,
  setOriginalTableData,
}: DataTableProps<TData, TValue>) {
  const [editedRows, setEditedRows] = useState({})
  const [validRows, setValidRows] = useState({})
  const { toast } = useToast()
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    meta: {
      revertRow: (rowIndex: number, revert: boolean) => {
        if (revert) {
          setTableData((old) =>
            old.map((row, index) =>
              index === rowIndex ? originalData[rowIndex] : row
            )
          )
        } else {
          setOriginalTableData((old) =>
            old.map((row, index) => (index === rowIndex ? data[rowIndex] : row))
          )
        }
      },
      updateCell: (
        rowIndex: number,
        columnId: string,
        value: string,
        isValid: boolean
      ) => {
        setTableData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value,
              }
            }
            return row
          })
        )
        setValidRows((old) => ({
          ...old,
          [rowIndex]: { ...old[rowIndex], [columnId]: isValid },
        }))
      },
      deleteRow(rowIndex: number) {
        console.log('delete Data,', data[rowIndex])

        // call API, if success then set
        /*
        const setFilterFunc = (old) =>
            old.filter((_row, index: number) => index !== rowIndex);
        setTableData(setFilterFunc);
        setOriginalTableData(setFilterFunc);
        */
      },
      editedRows,
      setEditedRows,
      validRows,
      setValidRows,
    },
  })

  return (
    <Table className="max-h-screen overflow-y-scroll">
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              )
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && 'selected'}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
