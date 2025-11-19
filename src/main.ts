// src/main.ts
import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import http from 'http';

import authRoutes from './interfaces/routes/auth.routes';

import learningRoutes from './interfaces/routes/learning.routes';


import bmRoutes from './interfaces/routes/bm.routes';
import cmRoutes from './interfaces/routes/cm.routes';

import { initSocketIO } from './infrastructure/common/socket/socket.server';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// ===== Khởi tạo HTTP server (để gắn Socket.IO) =====
const server = http.createServer(app);
const io = initSocketIO(server);
export { io }; // 👈 export cho các service khác dùng nếu cần

// ===== Middleware & Static Files =====
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static công khai
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/static', express.static(path.join(__dirname, '../public')));
app.use('/static/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Static cho assets (images/files được FE tải về sau này)
app.use(
  '/assets',
  express.static(path.join(__dirname, '../assets'), {
    maxAge: '7d',
    etag: true,
  })
);

// ===== Routes =====
app.get('/', (_, res) => {
  res.send('🎓 Educore Service is running!');
});

app.use('/api/auth', authRoutes);

app.use('/api/learning', learningRoutes);
app.use('/api/user-groups', authRoutes);


// Business Support Management routes
app.use('/api/bm', bmRoutes);
app.use('/api/cm', cmRoutes);

// Course Material Management routes

// Learning Management routes

// Interaction Management routes




// ===== Start Server =====
async function start() {
  try {
    console.log('🚀 Starting Educore backend...');
    console.log('ℹ️  Home Params cache sẽ được khởi tạo khi FE (educo-web) gọi API tương ứng với tenant_id.');
    server.listen(PORT, () => {
      console.log(`✅ Server is running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Startup failed:', err);
    process.exit(1);
  }
}

start();
