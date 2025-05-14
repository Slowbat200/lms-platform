import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { db } from '@/drizzle/db';
import { PurchaseTable } from '@/drizzle/schema';
import { UserPurchaseTable, UserPurchaseTableSkeleton } from '@/features/purchases/components/user-purchase-table';
import { getPurchaseUserTag } from '@/features/purchases/db/cache';
import { getCurrentUser } from '@/services/clerk';
import { desc, eq } from 'drizzle-orm';
import { cacheTag } from 'next/dist/server/use-cache/cache-tag';
import Link from 'next/link';
import { Suspense } from 'react';

export default async function PurchasesPage() {
  return (
    <div className='container my-6 px-2'>
      <PageHeader title='Purchase History' />
      <Suspense fallback={<UserPurchaseTableSkeleton />}>
        <SuspenseBoundary />
      </Suspense>
    </div>
  );
}

async function SuspenseBoundary() {
  const { userId, redirectToSignIn } = await getCurrentUser();

  if (userId == null) return redirectToSignIn();

  const purchases = await getPurchases(userId);

  if (purchases.length === 0) {
    return (
      <div className='flex flex-col gap-2 items-start'>
        You have made no purchases yet
        <Button asChild size={'lg'}>
            <Link href='/products'>Start shopping now</Link>
        </Button>
      </div>
    );
  }
  return <UserPurchaseTable purchases={purchases} />;
}

async function getPurchases(userId: string) {
  'use cache';
  cacheTag(getPurchaseUserTag(userId));

  return db.query.PurchaseTable.findMany({
    columns: {
      id: true,
      pricePaidInCents: true,
      refundedAt: true,
      productDetails: true,
      createdAt: true,
    },
    where: eq(PurchaseTable.userId, userId),
    orderBy: desc(PurchaseTable.createdAt),
  });
}
