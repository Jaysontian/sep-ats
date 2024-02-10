import { type Payment, columns } from "./columns"
import { DataTable } from "./data-table"
import { api } from "~/trpc/server";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer"

async function getData(): Promise<Payment[]> {
  const allApps = await api.candidate.getAllApps.query();
  // Fetch data from your API here.
  return allApps;
}

export default async function CandidateList() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10">
      <Drawer>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Are you absolutely sure?</DrawerTitle>
            <DrawerDescription>This action cannot be undone.</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <button>Submit</button>
            <DrawerClose>
              <p>Cancel</p>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <DataTable columns={columns} data={data} />
    </div>
  )
}
