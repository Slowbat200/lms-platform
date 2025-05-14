import { relations } from 'drizzle-orm';
import { pgTable, text } from 'drizzle-orm/pg-core';
import { createdAt, id, updatedAt } from '../schema-helpers';
import { CourseProductTable } from './course-product';
import { UserCourseAccessTable } from './user-course-access';
import { CourseSectionTable } from './course-section';

export const CourseTable = pgTable('courses', {
  id,
  name: text().notNull(),
  description: text().notNull(),
  createdAt,
  updatedAt,
});

export const CourseRelationships = relations(CourseTable, ({ many }) => ({
  courseProducts: many(CourseProductTable),
  userCourseAccesses: many(UserCourseAccessTable),
  courseSections: many(CourseSectionTable),
}));
