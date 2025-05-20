import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default function HomePage() {
  const { userId } = auth();
  if (userId) {
    redirect('/dashboard'); // Or any other protected page you want them to land on
  }
  {
    redirect('/welcome');
  }
}
