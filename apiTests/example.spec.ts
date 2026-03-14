import { test } from '@playwright/test';
import { Product } from '../helper/helperApi';

test('Get All Products List', async ({request}) => {
  const response = await request.get('/api/productsList')
  await Product.getProduct(response)
});