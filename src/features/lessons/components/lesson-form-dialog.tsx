'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ReactNode, useState } from 'react';
import { LessonForm } from './lesson-form';
import { LessonStatus } from '@/drizzle/schema';

export function LessonFormDialog({
  sections,
  defaultSectionId,
  lesson,
  children,
}: {
  children: ReactNode;
  sections: {
    id: string;
    name: string;
  }[];
  defaultSectionId?: string;
  lesson?:{
    id: string;
    name: string;
    status: LessonStatus;
    youtubeVideoId: string;
    description: string | null;
    sectionId: string;
  }
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {lesson == null ? 'New Lesson' : `Edit ${lesson.name}`}
          </DialogTitle>
        </DialogHeader>
        <div className='mt-4'>
          <LessonForm
            sections={sections}
            lesson={lesson}
            onSuccess={() => setIsOpen(false)}
            defaultSectionId={defaultSectionId}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
