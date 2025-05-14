import { db } from '@/drizzle/db';
import { ProductTable } from '@/drizzle/schema';
import { ProductCard } from '@/features/products/components/product-card';
import { getProductGlobalTag } from '@/features/products/db/cache';
import { userOwnsProduct } from '@/features/products/db/products';
import { wherePublicProducts } from '@/features/products/permissions/products';
import { getCurrentUser } from '@/services/clerk';
import { asc } from 'drizzle-orm';
import { cacheTag } from 'next/dist/server/use-cache/cache-tag';
import { Suspense } from 'react';

export default async function Home() {
  const products = await getPublicProducts();
  return (
    <div className='container px-2 my-6'>
       <section
        className='flex flex-col justify-center items-center bg-[#F8F9FA] dark:bg-[#101720] h-[calc(100vh-100px)]'
        id='header'
      >
        <h1 className='lg:text-6xl text-3xl font-extrabold text-center py-5 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600'>
          Welcome to the ApexIntel
        </h1>
        <div className='flex lg:flex-row flex-col gap-x-5'>
          <article className='px-5 py-10 text-center text-sm md:text-md lg:text-lg xl:text-xl dark:text-[#f0f3ff] text-neutral-800'>
            <p>
              Let me introduce you. I&apos;m Slowbat and I will be your guide on
              this journey.
            </p>
            
          </article>
          </div>
        </section>
      <div className='grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 my-8'>
        {products.map((product) => (
          <Suspense key={product.id} fallback={<ProductCard {...product} />}>
            <ProductCardWrapper {...product} />
          </Suspense>
        ))}
      </div>
    </div>
  );
}

async function ProductCardWrapper(props: {
  id: string;
  imageUrl: string;
  name: string;
  priceInDollars: number;
  description: string;
}) {
  const { userId } = await getCurrentUser();
  const isPurchased =
    userId != null && (await userOwnsProduct({ userId, productId: props.id }));
  return <ProductCard {...props} isPurchased={isPurchased} />;
}

async function getPublicProducts() {
  'use cache';
  cacheTag(getProductGlobalTag());

  return db.query.ProductTable.findMany({
    columns: {
      id: true,
      name: true,
      description: true,
      priceInDollars: true,
      imageUrl: true,
    },
    where: wherePublicProducts,
    orderBy: asc(ProductTable.name),
  });
}
