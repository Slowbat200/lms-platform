import { getGlobalTag, getIdTag, getUserTag } from '@/lib/data-cache';
import { revalidateTag } from 'next/cache';

export function getCourseSectionGlobalTag() {
  return getGlobalTag('courseSections');
}

export function getCourseSectionIdTag(id: string) {
  return getIdTag('courseSections', id);
}

export function getCourseSectionCourseTag(courseId: string) {
  return getUserTag('courseSections', courseId);
}

export function revalidateCourseSectionCache({
  id,
  courseId,
}: {
  id: string;
  courseId: string;
}) {
  revalidateTag(getCourseSectionGlobalTag());
  revalidateTag(getCourseSectionIdTag(id));
  revalidateTag(getCourseSectionCourseTag(courseId));
}
