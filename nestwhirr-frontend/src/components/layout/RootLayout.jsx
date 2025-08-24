import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import LeftSidebar from '../sidebar/LeftSidebar';

function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <div className="flex flex-1 h-[calc(100vh-3rem)] fixed inset-0 top-12">
        <LeftSidebar />
        <main className="flex-1 lg:ml-64 overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <div className="container mx-auto px-4 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default RootLayout; 