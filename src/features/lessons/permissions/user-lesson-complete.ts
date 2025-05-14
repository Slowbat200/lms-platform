import { db } from '@/drizzle/db';
import {
  CourseSectionTable,
  CourseTable,
  LessonTable,
  UserCourseAccessTable,
} from '@/drizzle/schema';
import { and, eq } from 'drizzle-orm';
import { wherePublicLessons } from './lessons';
import { cacheTag } from 'next/dist/server/use-cache/cache-tag';
import { getUserCourseAccessUserTag } from '@/features/courses/db/cache/user-course-access';
import { getLessonIdTag } from '../db/cache/lessons';

export async function canUpdateUserLessonCompleteStatus(
  user: { userId: string | undefined },
  lessonId: string
) {
  'use cache';
  cacheTag(getLessonIdTag(lessonId));
  if (user.userId == null) return false;

  cacheTag(getUserCourseAccessUserTag(user.userId));

  const [courseAccess] = await db
    .select({ courseId: CourseTable.id })
    .from(UserCourseAccessTable)
    .innerJoin(CourseTable, eq(CourseTable.id, UserCourseAccessTable.courseId))
    .innerJoin(
      CourseSectionTable,
      and(eq(CourseSectionTable.courseId, CourseTable.id))
    )
    .innerJoin(
      LessonTable,
      and(eq(LessonTable.sectionId, CourseSectionTable.id), wherePublicLessons)
    )
    .where(
      and(
        eq(LessonTable.id, lessonId),
        eq(UserCourseAccessTable.userId, user.userId)
      )
    )
    .limit(1);

  return courseAccess != null;
}
