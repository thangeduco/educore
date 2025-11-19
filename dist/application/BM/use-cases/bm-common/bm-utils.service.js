"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchBuffer = fetchBuffer;
exports.downloadToDir = downloadToDir;
exports.safeParseJSON = safeParseJSON;
exports.normalizeArrayLists = normalizeArrayLists;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const node_http_1 = __importDefault(require("node:http"));
const node_https_1 = __importDefault(require("node:https"));
const node_url_1 = require("node:url");
const node_crypto_1 = __importDefault(require("node:crypto"));
const ENV = {
    TIMEOUT_MS: Number(process.env.IM_TIMEOUT_MS ?? 8000),
    MAX_BYTES: Number(process.env.IM_MAX_BYTES ?? 50 * 1024 * 1024),
    ALLOW_HOSTS: (process.env.IM_ALLOW_HOSTS ?? 'cdn.educo.vn,ytimg.com,i.ytimg.com,localhost,127.0.0.1')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
};
function hostAllowed(host) {
    const h = host.toLowerCase();
    return ENV.ALLOW_HOSTS.some((allow) => h === allow || h.endsWith(`.${allow}`));
}
async function fetchBuffer(urlStr, timeoutMs = ENV.TIMEOUT_MS, maxBytes = ENV.MAX_BYTES) {
    const u = new node_url_1.URL(urlStr);
    if (!hostAllowed(u.hostname))
        throw new Error(`Host not allowed: ${u.hostname}`);
    const lib = u.protocol === 'http:' ? node_http_1.default : node_https_1.default;
    return new Promise((resolve, reject) => {
        const req = lib.get(u, { timeout: timeoutMs }, (res) => {
            if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                fetchBuffer(res.headers.location, timeoutMs, maxBytes).then(resolve, reject);
                return;
            }
            if (res.statusCode !== 200) {
                reject(new Error(`HTTP ${res.statusCode} for ${urlStr}`));
                return;
            }
            const ct = res.headers['content-type'];
            const ext = node_path_1.default.extname(u.pathname) || '';
            const chunks = [];
            let total = 0;
            res.on('data', (d) => {
                total += d.length;
                if (total > maxBytes) {
                    req.destroy(new Error('Asset too large'));
                    return;
                }
                chunks.push(d);
            });
            res.on('end', () => resolve({ buf: Buffer.concat(chunks), ct, ext }));
        });
        req.on('timeout', () => req.destroy(new Error('Request timeout')));
        req.on('error', reject);
    });
}
async function downloadToDir(url, dir) {
    const { buf, ct, ext } = await fetchBuffer(url);
    const hash = node_crypto_1.default.createHash('sha256').update(buf).digest('hex');
    const cleanExt = (ext && ext.length <= 8 ? ext : guessExt(ct)) || '';
    const dst = node_path_1.default.join(dir, `${hash}${cleanExt}`);
    if (!node_fs_1.default.existsSync(dst)) {
        const tmp = `${dst}.part`;
        await node_fs_1.default.promises.writeFile(tmp, buf);
        await node_fs_1.default.promises.rename(tmp, dst);
    }
    return node_path_1.default.join(dir, `${hash}${cleanExt}`).replace(/\\/g, '/');
}
function guessExt(ct) {
    if (!ct)
        return undefined;
    const t = ct.toLowerCase();
    if (t.startsWith('image/')) {
        if (t.includes('jpeg'))
            return '.jpg';
        if (t.includes('png'))
            return '.png';
        if (t.includes('webp'))
            return '.webp';
        if (t.includes('gif'))
            return '.gif';
        if (t.includes('svg'))
            return '.svg';
    }
    if (t.includes('pdf'))
        return '.pdf';
    if (t.includes('mp4'))
        return '.mp4';
    if (t.includes('mpeg'))
        return '.mpeg';
    return undefined;
}
function safeParseJSON(s) {
    try {
        return JSON.parse(s);
    }
    catch {
        return s;
    }
}
function normalizeArrayLists(v) {
    if (!v)
        return undefined;
    if (Array.isArray(v)) {
        if (v.length === 1 && Array.isArray(v[0]))
            return v[0];
        return v;
    }
    if (typeof v === 'object')
        return [v];
    return undefined;
}
