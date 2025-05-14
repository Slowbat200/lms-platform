'use client'

import { SortableItems, SortableList } from "@/components/sortable-list"
import { CourseSectionStatus } from "@/drizzle/schema"
import { cn } from "@/lib/utils"
import { EyeClosedIcon, Trash2Icon } from "lucide-react"
import { SectionFormDialog } from "./section-form-dialog"
import { DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ActionButton } from "@/components/action-button"
import { deleteSection, updateSectionOrders } from "../actions/sections"

export function SortableSectionList({
    courseId,
    sections
}:{
    courseId: string,
    sections: {
        id: string,
        name: string,
       status: CourseSectionStatus
    }[]
}){
    return(
        <SortableList items={sections} onOrderChange={updateSectionOrders}>
            {items => items.map(section => (
                <SortableItems key={section.id} id={section.id} className='flex items-center gap-1'>
                    <div
                    className={cn(
                      'contents',
                      section.status === 'private' && 'text-muted-foreground'
                    )}
                  >
                    {section.status === 'private' && (
                      <EyeClosedIcon className='size-4' />
                    )}
                    {section.name}
                  </div>
                  <SectionFormDialog section={section} courseId={courseId}>
                    <DialogTrigger asChild>
                      <Button variant='outline' size='sm' className='ml-auto'>
                        Edit
                      </Button>
                    </DialogTrigger>
                  </SectionFormDialog>
                  <ActionButton
                    action={deleteSection.bind(null, section.id)}
                    requireAreYouSure
                    variant='destructiveOutline'
                    size='sm'
                  >
                    <Trash2Icon />
                    <span className='sr-only'>Delete</span>
                  </ActionButton>
                </SortableItems>
            ))}
        </SortableList>
    )
}