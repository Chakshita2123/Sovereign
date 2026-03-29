/**
 * TopCommandBar.tsx — Dashboard Top Navigation Bar
 * Lectures 45-48: Live notification badge powered by Socket.io
 * 
 * The Bell icon now shows a real-time unread count that increments
 * whenever a Socket.io event is received (credential:issued, proof:approved, etc.)
 * Clicking the bell resets the counter.
 */

import { Search, Bell, Wifi, WifiOff } from 'lucide-react';
import { useSocket } from '../../hooks/useSocket';
import { motion, AnimatePresence } from 'motion/react';

export function TopCommandBar() {
  const { isConnected, unreadCount, resetUnread } = useSocket();

  return (
    <div className="h-10 sticky top-0 z-40 bg-[rgba(5,13,26,0.85)] backdrop-blur-2xl border-b border-[rgba(0,194,255,0.08)]">
      <div className="h-full px-6 flex items-center gap-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[13px] text-[#7A8FA6]">
          <span>Dashboard</span>
          <span>/</span>
          <span className="text-[#F0F4FF]">Overview</span>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8FA6]" />
            <input
              type="text"
              placeholder="Search credentials, DIDs, issuers..."
              className="w-full h-8 pl-10 pr-4 bg-[#0A1628] border border-[rgba(0,194,255,0.12)] rounded-lg text-[13px] text-[#F0F4FF] placeholder:text-[#7A8FA6] focus:outline-none focus:border-[#00C2FF] transition-colors"
              style={{ fontFamily: 'var(--font-mono)' }}
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Network Status — now shows Socket.io connection state */}
          <div className="flex items-center gap-2">
            {isConnected ? (
              <Wifi className="w-4 h-4 text-[#00FF88]" />
            ) : (
              <WifiOff className="w-4 h-4 text-[#FF4444]" />
            )}
            <span className="text-xs text-[#7A8FA6]">
              {isConnected ? 'Sovrin MainNet' : 'Reconnecting...'}
            </span>
            {/* Live indicator dot — pulses when connected */}
            {isConnected && (
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-[#00FF88]"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
          </div>

          {/* Notifications — live unread count from Socket.io */}
          <button
            id="notification-bell"
            onClick={resetUnread}
            className="relative p-1 hover:bg-[rgba(0,194,255,0.04)] rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5 text-[#7A8FA6]" />
            
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.span
                  key="badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center px-1 bg-gradient-to-r from-[#FF4444] to-[#FF6B35] rounded-full text-white text-[10px] font-bold"
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Pulse ring animation on new notification */}
            {unreadCount > 0 && (
              <motion.span
                className="absolute -top-1 -right-1 w-[18px] h-[18px] rounded-full border border-[#FF4444]"
                animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
              />
            )}
          </button>

          {/* User Avatar */}
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00C2FF] to-[#7B2FFF] flex items-center justify-center cursor-pointer">
            <span className="text-white text-xs font-bold">AC</span>
          </div>
        </div>
      </div>
    </div>
  );
}
