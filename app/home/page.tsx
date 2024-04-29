import Navbar from '../../components/navbar';

function HomePage() {
  return (
    <div>
      <Navbar />
      <main className="container mx-auto p-4 pt-6 md:p-6 lg:p-12">
        <h1 className="text-3xl font-bold">Welcome to the Home Page!</h1>
        <p>This is a blank page. You can add your content here.</p>
      </main>
    </div>
  );
}

export default HomePage;