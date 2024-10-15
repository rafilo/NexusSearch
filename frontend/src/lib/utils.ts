import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { v4 as uuid4 } from 'uuid'
var XLSX = require("xlsx");

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function exportTable(tables: Element[]) {
  const wb = XLSX.utils.book_new();
  let tablesToExport = []
  tables.forEach((table, index) => {
    let wbData = {name: `table${index}`, table: XLSX.utils.table_to_sheet(table)}
    tablesToExport.push(wbData)
  })
  tablesToExport.forEach((table) => {
    XLSX.utils.book_append_sheet(wb, table.table, table.name);
  })

  XLSX.writeFile(wb, "exported_tables.xlsx");
}

export function getComponentID(){
  return uuid4();
}
