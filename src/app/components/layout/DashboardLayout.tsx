import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar';
import { TopCommandBar } from './TopCommandBar';

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-[#050D1A]">
      <Sidebar />
      <div className="ml-64">
        <TopCommandBar />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
