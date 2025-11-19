"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
// src/main.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = __importDefault(require("http"));
const auth_routes_1 = __importDefault(require("./interfaces/routes/auth.routes"));
const learning_routes_1 = __importDefault(require("./interfaces/routes/learning.routes"));
const bm_routes_1 = __importDefault(require("./interfaces/routes/bm.routes"));
const cm_routes_1 = __importDefault(require("./interfaces/routes/cm.routes"));
const socket_server_1 = require("./infrastructure/common/socket/socket.server");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
// ===== Khởi tạo HTTP server (để gắn Socket.IO) =====
const server = http_1.default.createServer(app);
const io = (0, socket_server_1.initSocketIO)(server);
exports.io = io;
// ===== Middleware & Static Files =====
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' }));
// Static công khai
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
app.use('/static', express_1.default.static(path_1.default.join(__dirname, '../public')));
app.use('/static/uploads', express_1.default.static(path_1.default.join(__dirname, '../public/uploads')));
// Static cho assets (images/files được FE tải về sau này)
app.use('/assets', express_1.default.static(path_1.default.join(__dirname, '../assets'), {
    maxAge: '7d',
    etag: true,
}));
// ===== Routes =====
app.get('/', (_, res) => {
    res.send('🎓 Educore Service is running!');
});
app.use('/api/auth', auth_routes_1.default);
app.use('/api/learning', learning_routes_1.default);
app.use('/api/user-groups', auth_routes_1.default);
// Business Support Management routes
app.use('/api/bm', bm_routes_1.default);
app.use('/api/cm', cm_routes_1.default);
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
    }
    catch (err) {
        console.error('❌ Startup failed:', err);
        process.exit(1);
    }
}
start();
