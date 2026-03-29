/**
 * SocketContext.tsx — Socket.io Context Provider
 * Lectures 45-48: Shared WebSocket connection across the React app
 * 
 * This context provider creates a single Socket.io connection and shares
 * it with all child components. It also manages:
 *   - Automatic connection/disconnection based on authentication
 *   - Room joining (wallet:DID) for targeted events
 *   - Unread notification counter for the nav badge
 *   - Toast notifications on incoming socket events
 * 
 * Usage:
 *   Wrap your layout with <SocketProvider>
 *   Access via useSocketContext() in any child component
 */

import { createContext, useContext, useEffect, useRef, useState, useCallback, type ReactNode } from 'react';
import { io, type Socket } from 'socket.io-client';
import { toast } from 'sonner';
import { authService } from '../services/authService';

// ── Context types ─────────────────────────────────────────────────────────────
interface SocketContextType {
  /** The Socket.io client instance (null if not connected) */
  socket: Socket | null;
  /** Whether the socket is currently connected */
  isConnected: boolean;
  /** Number of unread notifications since last reset */
  unreadCount: number;
  /** Reset the unread notification counter */
  resetUnread: () => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  unreadCount: 0,
  resetUnread: () => {},
});

// ── Socket Provider Component ─────────────────────────────────────────────────
export function SocketProvider({ children }: { children: ReactNode }) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const resetUnread = useCallback(() => setUnreadCount(0), []);

  useEffect(() => {
    // Determine the server URL — in dev, Vite proxies to localhost:3001
    const serverUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    
    const socket = io(serverUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    socketRef.current = socket;

    // ── Connection events ──────────────────────────────────────────────────
    socket.on('connect', () => {
      console.log(`⚡ Socket.io connected: ${socket.id}`);
      setIsConnected(true);

      // Join wallet room if user is authenticated
      const user = authService.getUser();
      if (user?.did) {
        socket.emit('join:wallet', { did: user.did });
        console.log(`  → Joined wallet room: wallet:${user.did}`);
      }

      // Join dashboard room for broadcast events
      socket.emit('join:dashboard');
    });

    socket.on('disconnect', (reason) => {
      console.log(`⚡ Socket.io disconnected: ${reason}`);
      setIsConnected(false);
    });

    socket.on('connect_error', (err) => {
      console.log(`⚡ Socket.io connection error: ${err.message}`);
    });

    // ── Application events — toast notifications ───────────────────────────
    socket.on('credential:issued', ({ credential }) => {
      setUnreadCount(prev => prev + 1);
      toast.success('New Credential Issued', {
        description: `${credential?.type || 'Credential'} from ${credential?.issuer || 'Unknown'}`,
        duration: 5000,
      });
    });

    socket.on('proof:approved', ({ proofId }) => {
      setUnreadCount(prev => prev + 1);
      toast.success('Proof Request Approved', {
        description: `Proof ${proofId || ''} was approved`,
        duration: 5000,
      });
    });

    socket.on('proof:request', ({ proofRequest }) => {
      setUnreadCount(prev => prev + 1);
      toast.info('New Proof Request', {
        description: proofRequest?.verifierName
          ? `${proofRequest.verifierName} requests verification`
          : 'A verifier is requesting proof',
        duration: 8000,
      });
    });

    socket.on('credential:expiring', ({ credential }) => {
      setUnreadCount(prev => prev + 1);
      toast.warning('Credential Expiring Soon', {
        description: `${credential?.type || 'Credential'} is expiring soon`,
        duration: 6000,
      });
    });

    socket.on('activity:new', () => {
      // Don't toast for general activity — but do increment badge
      setUnreadCount(prev => prev + 1);
    });

    // ── Cleanup on unmount ─────────────────────────────────────────────────
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  return (
    <SocketContext.Provider value={{
      socket: socketRef.current,
      isConnected,
      unreadCount,
      resetUnread,
    }}>
      {children}
    </SocketContext.Provider>
  );
}

// ── Hook to access socket context ─────────────────────────────────────────────
export function useSocketContext() {
  return useContext(SocketContext);
}
