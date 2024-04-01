"use client"
 
import { type ColumnDef } from "@tanstack/react-table"
 
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  uid: string
  profile: {
    id: string
    name: string
    email: string
  } | null
}
 
export const columns: ColumnDef<Payment>[] = [
  {
    id: "name",
    accessorKey: "profile.name",
    header: "Name",
  },
  {
    id: "email",
    accessorKey: "profile.email",
    header: "Email",
  },
  {
    id: "uid",
    accessorKey: "profile.id",
    header: "UID",
    enableHiding: true,
  },
  {
    id: "image",
    accessorKey: "profile.image",
    header: "Image",
    enableHiding: true,
  },
]