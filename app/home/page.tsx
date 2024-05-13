'use client';

import DailyLedger from '@/components/dailyLedger';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { useUser } from '@auth0/nextjs-auth0/client';

const HomePage = () => {
  const { error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <div className='flex flex-col min-h-screen bg-background'>
      <div className='flex-1 p-4 md:p-6 lg:p-12 pt-10'>
        <Navbar />
        <div className='mt-6 mb-10'>
          <DailyLedger />
        </div>
      </div>
      <div></div>
      <Footer />
    </div>
  );
};

export default HomePage;
