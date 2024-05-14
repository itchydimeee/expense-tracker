'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';

import Image from 'next/image';

import logoImg from '@/assets/logoImg.png';

export default function Home() {
  const { user, error, isLoading } = useUser();
  const router = useRouter();

  if (isLoading) return <div>Loading..</div>;
  if (error) return <div>{error.message}</div>;

  if (user) {
    console.log(user);
    router.push('/home'); // Navigate to homepage after login
    return null;
  }

  return (
    <main>
      <div className='flex flex-col h-screen justify-center items-center'>
        <div>
          <Image src={logoImg} alt='logo image' width={400} />{' '}
        </div>
        <div className='flex justify-center bg-button hover:bg-button-hover active:bg-button-hover w-[130px] h-[50px] my-6 rounded-full drop-shadow-lg'>
          <a
            href='/api/auth/login'
            className=' text-white text-2xl font-extrabold py-2'
          >
            {' '}
            Login
          </a>
        </div>
      </div>
    </main>
  );
}
