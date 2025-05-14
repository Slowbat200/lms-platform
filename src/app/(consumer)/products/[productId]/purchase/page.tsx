import { LoadingSpinner } from '@/components/loading-spinner';
import { db } from '@/drizzle/db';
import { getProductIdTag } from '@/features/products/db/cache';
import { cacheTag } from 'next/dist/server/use-cache/cache-tag';
import { Suspense } from 'react';
import { ProductTable } from '@/drizzle/schema';
import { and, eq } from 'drizzle-orm';
import { wherePublicProducts } from '@/features/products/permissions/products';
import { getCurrentUser } from '@/services/clerk';
import { notFound, redirect } from 'next/navigation';
import { userOwnsProduct } from '@/features/products/db/products';
import { PageHeader } from '@/components/page-header';
import { SignUp, SignIn } from '@clerk/nextjs';
import { StripeCheckoutForm } from '@/services/stripe/components/stripe-checkout-form';

export default function PurchasePage({
  params,
  searchParams,
}: {
  params: Promise<{ productId: string }>
  searchParams: Promise<{ authMode: string }>
}) {
  return (
    <Suspense fallback={<LoadingSpinner className="my-6 size-36 mx-auto" />}>
      <SuspendedComponent params={params} searchParams={searchParams} />
    </Suspense>
  )
}

async function SuspendedComponent({
  params,
  searchParams,
}: {
  params: Promise<{ productId: string }>
  searchParams: Promise<{ authMode: string }>
}) {
  const { productId } = await params
  const { user } = await getCurrentUser({ allData: true })
  const product = await getPublicProduct(productId)

  if (product == null) return notFound()

  if (user != null) {
    if (await userOwnsProduct({ userId: user.id, productId })) {
      redirect("/courses")
    }

    return (
      <div className="container my-6">
        <StripeCheckoutForm product={product} user={user} />
      </div>
    )
  }

  const { authMode } = await searchParams
  const isSignUp = authMode === "signUp"

  return (
    <div className="container my-6 flex flex-col items-center">
      <PageHeader title="You need an account to make a purchase" />
      {isSignUp ? (
        <SignUp
          routing="hash"
          signInUrl={`/products/${productId}/purchase?authMode=signIn`}
          forceRedirectUrl={`/products/${productId}/purchase`}
        />
      ) : (
        <SignIn
          routing="hash"
          signUpUrl={`/products/${productId}/purchase?authMode=signUp`}
          forceRedirectUrl={`/products/${productId}/purchase`}
        />
      )}
    </div>
  )
}

async function getPublicProduct(id: string) {
  "use cache"
  cacheTag(getProductIdTag(id))

  return db.query.ProductTable.findFirst({
    columns: {
      name: true,
      id: true,
      imageUrl: true,
      description: true,
      priceInDollars: true,
    },
    where: and(eq(ProductTable.id, id), wherePublicProducts),
  })
} 