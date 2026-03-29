/**
 * DashboardLayout.tsx — Main Dashboard Layout
 * Lectures 45-48: Wrapped with SocketProvider for real-time events
 * 
 * The SocketProvider creates a single Socket.io connection that all
 * child components (sidebar, top bar, pages) can access via useSocket().
 * The Toaster renders toast notifications triggered by socket events.
 */

import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar';
import { TopCommandBar } from './TopCommandBar';
import { SocketProvider } from '../../hooks/SocketContext';
import { Toaster } from 'sonner';

export function DashboardLayout() {
  return (
    <SocketProvider>
      <div className="min-h-screen bg-[#050D1A]">
        <Sidebar />
        <div className="ml-64">
          <TopCommandBar />
          <main className="p-6">
            <Outlet />
          </main>
        </div>
        {/* Socket.io toast notifications — positioned top-right */}
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: {
              background: 'rgba(10, 22, 40, 0.95)',
              border: '1px solid rgba(0, 194, 255, 0.2)',
              color: '#F0F4FF',
              backdropFilter: 'blur(12px)',
            },
          }}
        />
      </div>
    </SocketProvider>
  );
}
