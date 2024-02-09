'use server';
// By adding the 'use server', you mark all the exported functions within the file as server functions. These server functions can then be imported into Client and Server components, making them extremely versatile.
// You can also write Server Actions directly inside Server Components by adding "use server" inside the action. But for this course, we'll keep them all organized in a separate file.

import { z } from 'zod';
// To handle type validation, you have a few options. While you can manually validate types, using a type validation library can save you time and effort. For your example, we'll use Zod, a TypeScript-first validation library that can simplify this task for you.
// In your actions.ts file, import Zod and define a schema that matches the shape of your form object. This schema will validate the formData before saving it to a database.

import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
// Since you're updating the data displayed in the invoices route, you want to clear this cache and trigger a new request to the server. You can do this with the revalidatePath function from Next.js

import { redirect } from 'next/navigation';
// Once the database has been updated, the /dashboard/invoices path will be revalidated, and fresh data will be fetched from the server.At this point, you also want to redirect the user back to the /dashboard/invoices page. You can do this with the redirect function from Next.js

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(), // The amount field is specifically set to coerce (change) from a string to a number while also validating its type.
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = amount * 100;
  // Storing values in cents
  // It's usually good practice to store monetary values in cents in your database to eliminate JavaScript floating-point errors and ensure greater accuracy.

  const date = new Date().toISOString().split('T')[0];
  // Creating new dates
  // Finally, Create a new date with the format "YYYY-MM-DD" for the invoice's creation date.

  await sql`
INSERT INTO invoices (customer_id, amount, status, date)
VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
`;

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

// Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = amount * 100;

  await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath('/dashboard/invoices');
  // Since this action is being called in the /dashboard/invoices path, you don't need to call redirect. Calling revalidatePath will trigger a new server request and re-render the table.
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
