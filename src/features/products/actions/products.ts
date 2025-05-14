'use server'

import { z } from 'zod';
import { productSchema } from '../schemas/products';
import { getCurrentUser } from '@/services/clerk';
import { redirect } from 'next/navigation';
import { canCreateProducts, canDeleteProducts, canUpdateProducts } from '../permissions/products';
import { insertProduct, updateProduct as updateProductDb, deleteProduct as deleteProductDb } from '../db/products';

export async function createProduct(unsafedata: z.infer<typeof productSchema>) {
  const { success, data } = productSchema.safeParse(unsafedata);

  if (!success || !canCreateProducts(await getCurrentUser())) {
    return { error: true, message: 'There was an error creating your product' };
  }

  await insertProduct(data);

  redirect('/admin/products');
}

export async function updateProduct(
  id: string,
  unsafedata: z.infer<typeof productSchema>
) {
  const { success, data } = productSchema.safeParse(unsafedata);

  if (!success || !canUpdateProducts(await getCurrentUser())) {
    return { error: true, message: 'There was an error updating your product' };
  }

  await updateProductDb(id, data);

  redirect('/admin/products');
}

export async function deleteProduct(id: string) {
  if (!canDeleteProducts(await getCurrentUser())) {
    return { error: true, message: 'Error deleting your product' };
  }

  await deleteProductDb(id);

  return { error: true, message: 'Error deleting your product' };
}
