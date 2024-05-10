import Navbar from '@/components/navbar'
import CreateExpenses from '@/components/createExpenses'
import CreateUser from '@/components/createUser'
import CreateIncomes from '@/components/createIncomes'
import DailyLedger from '@/components/dailyLedger'

async function HomePage () {
  return (
    <>
      <main className='container mx-auto p-4 pt-6 md:p-6 lg:p-12'>
        <div>
          <div className='mb-5 border-b border-gray-300'>
            <Navbar />
          </div>
          <div>
            <h1 className='text-3xl text-center font-bold'>
              Welcome to FlexiSpend
            </h1>
          </div>
          <div>
            <CreateUser />
            <CreateExpenses />
            <CreateIncomes/>
            <DailyLedger />
          </div>
        </div>
      </main>
    </>
  )
}
export default HomePage
