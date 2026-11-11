import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingButtons from './FloatingButtons';
import ChatWidget from './ChatWidget';
import MobileActionBar from './MobileActionBar';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col pb-24 sm:pb-0">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <FloatingButtons />
      <ChatWidget />
      <MobileActionBar />
    </div>
  );
}
