import Navbar from '../../components/navbar';
import Expenses from '@/components/expenses';

 async function HomePage() {
  return (
    <div>
      <Navbar />
      <main className="container mx-auto p-4 pt-6 md:p-6 lg:p-12">
        <h1 className="text-3xl font-bold">Welcome to the Home Page!</h1>
        <Expenses></Expenses>
      </main>
    </div>
  );
}
export default HomePage;