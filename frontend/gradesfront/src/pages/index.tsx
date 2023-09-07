import Head from 'next/head';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function Home() {
  const { user, error, isLoading } = useUser();
  console.log('🚀 ~ user:', user);
  return (
    <h1>Hola mundo</h1>
  );
}
