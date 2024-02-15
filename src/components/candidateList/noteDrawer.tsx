import { Cell, RowData, flexRender } from "@tanstack/react-table";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";

import { ReactNode } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

type ColumnData = {
  children: ReactNode;
  name: string;
};

export default function NoteDrawer(props: ColumnData) {
  return (
    <>
      <Drawer shouldScaleBackground>
        <DrawerTrigger asChild>{props.children}</DrawerTrigger>
        <DrawerContent className="mx-4 self-center bg-white">
          <div className="bg-red m-auto max-w-[500px]">
            <DrawerHeader>
              <DrawerTitle>{props.name}</DrawerTitle>
              <DrawerDescription>
                Submit a comment about this candidate.
              </DrawerDescription>
            </DrawerHeader>
            <input />
            <DrawerFooter>
              <Textarea></Textarea>
              <div className="flex justify-between gap-2">
                <Button>Criteria 1</Button>
                <Button>Criteria 2</Button>
                <Button>Criteria 3</Button>
              </div>
              <DrawerClose className="my-2">
                <button>Cancel</button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
