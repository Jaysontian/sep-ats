"use client"

import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table"

import CandidateBox from "./candidateBox"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"

import { Input } from "../ui/input"
import React from "react"
import { Button } from "../ui/button"
import PresentButton from "./present-button"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnFilters,
    },
    initialState: {
      columnVisibility: { "uid": false },
    },
  });

  return (
    <>
    <div className="flex flex-col justify-between pb-4">
        <h2>Candidates</h2>
        <Input
          placeholder="Search"
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-xs border-zinc-700/20 bg-zinc-700/20 active:border-zinc-700/50"
        />
    </div>
    <div className="rounded-md bg-zinc-700/20 border border-zinc-700/30 sm-bg-red">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-b-zinc-700/50 hover:bg-inherit">
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
              <TableHead></TableHead>
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-none text-left"
                >
                  {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="max-w-8 truncate">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                  ))}
                  <div className="flex justify-end gap-4 px-4">
                    <CandidateBox key={row.id} name={row.getValue("name")} candidateID={row.getValue("uid")} image={row.getValue("image")} comments={[]}>
                      <Button className="my-1.5 bg-blue-500 border-blue-400 border hover:bg-blue-600">Comment</Button>
                    </CandidateBox>
                    <PresentButton candidateID={row.getValue("uid")} name={row.getValue("name")} />
                    {/* <Button className="m-2">Add</Button> */}
                  </div>
                </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-left">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
    </>
  )
}