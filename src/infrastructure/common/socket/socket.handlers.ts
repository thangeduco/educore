import { Server } from 'socket.io';

export function initSocketHandlers(io: Server) {
  io.on('connection', (socket) => {
    console.log(`✅ Client connected: ${socket.id}`);

    socket.on('join_student_room', ({ studentId }) => {
      const room = `student_${studentId}`;
      socket.join(room);
      console.log(`📚 Student ${studentId} joined room: ${room}`);
    });

    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });
}
