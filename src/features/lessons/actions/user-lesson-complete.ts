'use server';

import { getCurrentUser } from '@/services/clerk';
import { canUpdateUserLessonCompleteStatus } from '../permissions/user-lesson-complete';
import { updateLessonCompleteStatus as updateLessonCompleteStatusDb } from '../db/user-lesson-complete';

export async function updateLessonCompleteStatus(
  lessonId: string,
  complete: boolean
) {
  const { userId } = await getCurrentUser();

  const hasPermission = await canUpdateUserLessonCompleteStatus(
    { userId },
    lessonId
  );

  if(userId == null || !hasPermission){
    return {error: true, message: 'Error updating lesson completion status'};
  }

  await updateLessonCompleteStatusDb({lessonId, userId, complete})

  return {error: false, message: 'Successfully updated lesson completion status'};
}
