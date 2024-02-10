
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

import { ReactNode } from "react"

type ColumnData = {
  name: string
  children: ReactNode
}

export default function NoteDrawer(props : ColumnData){
    return(
        <>
        <Drawer>
            <DrawerTrigger asChild>
                {props.children}
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                <DrawerDescription>This action cannot be undone.</DrawerDescription>
                </DrawerHeader>
                <DrawerFooter>
                <button>Submit</button>
                <DrawerClose>
                    <button>Cancel</button>
                </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
        </>
    )
}