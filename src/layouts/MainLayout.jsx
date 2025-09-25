import { Outlet } from 'react-router-dom';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';

const MainLayout = () => {
  return (
    <div className='grid grid-rows-[auto_1fr_auto] min-h-screen'>
      <Navbar />
      <main className='h-full'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
