/**
 * useSocket.ts — React Hook for Socket.io Events
 * Lectures 45-48: Full-duplex communication, WebSocket subscriptions
 * 
 * This hook provides a convenient way to subscribe to Socket.io events
 * within any React component. It returns the socket instance and connection
 * status from the SocketContext, plus a helper to listen for specific events.
 * 
 * Usage:
 *   const { socket, isConnected, onEvent } = useSocket();
 * 
 *   useEffect(() => {
 *     const cleanup = onEvent('credential:issued', (data) => {
 *       console.log('New credential:', data);
 *     });
 *     return cleanup;
 *   }, [onEvent]);
 */

import { useCallback } from 'react';
import { useSocketContext } from './SocketContext';

export function useSocket() {
  const { socket, isConnected, unreadCount, resetUnread } = useSocketContext();

  /**
   * Subscribe to a socket event. Returns a cleanup function.
   * Safe to call even if socket is not connected — will no-op.
   */
  const onEvent = useCallback(
    (event: string, handler: (...args: unknown[]) => void) => {
      if (!socket) return () => {};
      
      socket.on(event, handler);
      return () => {
        socket.off(event, handler);
      };
    },
    [socket]
  );

  return {
    socket,
    isConnected,
    unreadCount,
    resetUnread,
    onEvent,
  };
}
