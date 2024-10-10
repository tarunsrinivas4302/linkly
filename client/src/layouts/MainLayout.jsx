import { Outlet } from 'react-router-dom';
import Header from '../components/header';
const MainLayout = () => {
  return (
    <>
      <Header />
      <main className='container px-2 py-2'><Outlet /></main>
      <div className="fixed bottom-2 w-full container">
        <p className="text-center font-semibold font-sans text-lg ">Made With ❤️ from Tarun Srinivas ...</p>
      </div>
    </>
  )
}

export default MainLayout