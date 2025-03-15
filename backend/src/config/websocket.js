import { WebSocketServer } from 'ws';
import { setupWSConnection } from 'y-websocket/bin/utils';
import logger from '../utils/logger.js';

export const setupWebSocketServer = (server) => {
  logger.info('Initializing WebSocket server...');
  
  const wss = new WebSocketServer({ 
    server,
    // Remove the path setting to handle all WebSocket connections
    clientTracking: true
  });

  wss.on('connection', (conn, req) => {
    const clientIp = req.socket.remoteAddress;
    
    // Parse URL to get document ID
    const url = new URL(req.url, `http://${req.headers.host}`);
    const documentId = url.pathname.split('document-')[1];
    const userId = url.searchParams.get('userId');

    logger.info(`New WebSocket connection:`, {
      clientIp,
      documentId,
      userId,
      totalConnections: wss.clients.size
    });

    // Set up ping-pong to keep connection alive
    const pingInterval = setInterval(() => {
      if (conn.readyState === 1) { // 1 = OPEN
        conn.ping();
      }
    }, 30000);

    conn.on('error', (error) => {
      logger.error('WebSocket connection error:', {
        error: error.message,
        documentId,
        userId,
        clientIp
      });
    });

    conn.on('close', (code, reason) => {
      clearInterval(pingInterval);
      logger.info('WebSocket connection closed:', {
        code,
        reason: reason.toString(),
        documentId,
        userId,
        clientIp
      });
    });

    conn.on('pong', () => {
      // Connection is alive
      conn.isAlive = true;
    });

    try {
      // Set up Y.js WebSocket connection
      setupWSConnection(conn, req);
    } catch (error) {
      logger.error('Error in setupWSConnection:', {
        error: error.message,
        documentId,
        userId,
        clientIp
      });
      conn.close(1011, 'Internal Server Error');
    }
  });

  // Cleanup any dead connections
  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) {
        return ws.terminate();
      }
      ws.isAlive = false;
    });
  }, 40000);

  wss.on('error', (error) => {
    logger.error('WebSocket server error:', error);
  });

  wss.on('close', () => {
    clearInterval(interval);
    logger.info('WebSocket server closed');
  });

  return wss;
};