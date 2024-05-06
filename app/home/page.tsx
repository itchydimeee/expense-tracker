import Navbar from '@/components/navbar';
import CreateExpenses from '@/components/createExpenses';
import FetchExpenses from '@/components/fetchExpenses';
import CreateUser from '@/components/createUser';

async function HomePage() {
  return (
    <>
      <main className="container mx-auto p-4 pt-6 md:p-6 lg:p-12">
        <Navbar />
        <h1 className="text-3xl text-center font-bold">Welcome to FlexiSpend</h1>
        <CreateUser/>
        <CreateExpenses/>
        <FetchExpenses/>
      </main>
    </>
  );
}
export default HomePage;
