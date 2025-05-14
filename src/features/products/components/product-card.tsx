import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatPrice } from '@/lib/formatters';
import { getUserCoupon } from '@/lib/user-country-header';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

export function ProductCard({
  id,
  imageUrl,
  name,
  priceInDollars,
  description,
  isPurchased = false
}: {
  id: string;
  imageUrl: string;
  name: string;
  priceInDollars: number;
  description: string;
  isPurchased?: boolean;
}) {
  return (
    <Card className='overflow-hidden flex flex-col w-full max-w-[500px] mx-5 border dark:border-[#fff8] bg-[#f1f1f1] dark:bg-[#fff1]'>
      <div className='relative aspect-video w-full'>
        <Image src={imageUrl} alt={name} fill className='object-cover' />
      </div>
      <CardHeader className='space-y-8'>
        <CardDescription>
          <Suspense fallback={formatPrice(priceInDollars)}>
            <Price price={priceInDollars} />
          </Suspense>
        </CardDescription>
        <CardTitle className='text-xl'>{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className='line-clamp-3'>{description}</p>
      </CardContent>
      <CardFooter className='mt-auto'>
      {isPurchased ? (
          <Button className='w-full text-md py-6' asChild>
            <Link href='/courses'>Start Learning</Link>
          </Button>
        ) : (
          <Button className='w-full text-md py-6' asChild>
            <Link href={`/products/${id}`}>Purchase Course</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

async function Price({ price }: { price: number }) {
  const coupon = await getUserCoupon();
  if (price === 0 || coupon == null) return formatPrice(price);

  return (
    <div className='flex gap-2 items-baseline'>
      <div className='line-through text-xs opacity-50'>
        {formatPrice(price)}
      </div>
      <div>{formatPrice(price * (1 - coupon.discountPercentage))}</div>
    </div>
  );
}
