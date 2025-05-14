import { count, countDistinct, isNotNull, sql, sum } from 'drizzle-orm';

import { db } from '@/drizzle/db';
import { CourseSectionTable, CourseTable, LessonTable, ProductTable, PurchaseTable, UserCourseAccessTable } from '@/drizzle/schema';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { formatNumber, formatPrice } from '@/lib/formatters';

import { ReactNode } from 'react';
import { cacheTag } from 'next/dist/server/use-cache/cache-tag';
import { getPurchaseGlobalTag } from '@/features/purchases/db/cache';
import { getUserCourseAccessGlobalTag } from '@/features/courses/db/cache/user-course-access';
import { getCourseGlobalTag } from '@/features/courses/db/cache/courses';
import { getProductGlobalTag } from '@/features/products/db/cache';
import { getLessonGlobalTag } from '@/features/lessons/db/cache/lessons';
import { getCourseSectionGlobalTag } from '@/features/courseSections/db/cache';

export default async function AdminPage() {
  const {
    averageNetPurchasesPerCustomer,
    netPurchases,
    netSales,
    refundedPurchases,
    totalRefunds,
  } = await getPurchaseDetails();
  return (
    <div className='container my-6 px-2'>
      <div className='grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 md:grid-cols-4 gap-4'>
        <StateCard title='Net Sales'>{formatPrice(netSales)}</StateCard>
        <StateCard title='Refunded Sales'>
          {formatPrice(totalRefunds)}
        </StateCard>
        <StateCard title='Un-Refunded Sales'>
          {formatNumber(netPurchases)}
        </StateCard>
        <StateCard title='Refunded Purchases'>
          {formatNumber(refundedPurchases)}
        </StateCard>
        <StateCard title='Purchases Per User'>
          {formatNumber(averageNetPurchasesPerCustomer, {
            maximumFractionDigits: 2,
          })}
        </StateCard>
        <StateCard title='Students'>
          {formatNumber(await getTotalStudents())}
        </StateCard>
        <StateCard title='Products'>
          {formatNumber(await getTotalProducts())}
        </StateCard>
        <StateCard title='Courses'>
          {formatNumber(await getTotalCourses())}
        </StateCard>
        <StateCard title='CourseSections'>
          {formatNumber(await getTotalCourseSections())}
        </StateCard>
        <StateCard title='Lessons'>
          {formatNumber(await getTotalLessons())}
        </StateCard>
      </div>
    </div>
  );
}

function StateCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Card>
      <CardHeader className='text-center'>
        <CardDescription>{title}</CardDescription>
        <CardTitle className='font-bold text-2xl'>{children}</CardTitle>
      </CardHeader>
    </Card>
  );
}

async function getPurchaseDetails() {
  'use cache';
  cacheTag(getPurchaseGlobalTag());

  const data = await db
    .select({
      totalSales: sql<number>`COALESCE(${sum(
        PurchaseTable.pricePaidInCents
      )}, 0)`.mapWith(Number),
      totalPurchases: count(PurchaseTable.id),
      totalUsers: countDistinct(PurchaseTable.userId),
      isRefund: isNotNull(PurchaseTable.refundedAt),
    })
    .from(PurchaseTable)
    .groupBy((table) => table.isRefund);

  const [refundData] = data.filter((row) => row.isRefund);
  const [salesData] = data.filter((row) => !row.isRefund);

  const netSales = (salesData?.totalSales ?? 0) / 100;
  const totalRefunds = (refundData?.totalSales ?? 0) / 100;
  const netPurchases = salesData?.totalPurchases ?? 0;
  const refundedPurchases = refundData?.totalPurchases ?? 0;
  const averageNetPurchasesPerCustomer =
    salesData?.totalUsers != null && salesData.totalUsers > 0
      ? netPurchases / salesData.totalUsers
      : 0;

  return {
    netSales,
    totalRefunds,
    netPurchases,
    refundedPurchases,
    averageNetPurchasesPerCustomer,
  };
}

async function getTotalStudents() {
    'use cache'
    cacheTag(getUserCourseAccessGlobalTag())
  const [data] = await db
    .select({ totalSudents: countDistinct(UserCourseAccessTable.userId) })
    .from(UserCourseAccessTable);

    if(data == null) return 0

    return data.totalSudents
}
async function getTotalCourses() {
    'use cache'
    cacheTag(getCourseGlobalTag())
  const [data] = await db
    .select({ totalCourses: count(CourseTable.id) })
    .from(CourseTable);

    if(data == null) return 0

    return data.totalCourses
}

async function getTotalProducts() {
    'use cache'
    cacheTag(getProductGlobalTag())
  const [data] = await db
    .select({ totalProducts: count(ProductTable.id) })
    .from(ProductTable);

    if(data == null) return 0

    return data.totalProducts
}

async function getTotalLessons() {
    'use cache'
    cacheTag(getLessonGlobalTag())
  const [data] = await db
    .select({ totalLessons: count(LessonTable.id) })
    .from(LessonTable);

    if(data == null) return 0

    return data.totalLessons
}

async function getTotalCourseSections() { 
    'use cache'
    cacheTag(getCourseSectionGlobalTag())
  const [data] = await db
    .select({ totalCourseSections: count(CourseSectionTable.id) })
    .from(CourseSectionTable);

    if(data == null) return 0

    return data.totalCourseSections
}
