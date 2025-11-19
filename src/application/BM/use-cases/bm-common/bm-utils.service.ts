import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import https from 'node:https';
import { URL } from 'node:url';
import crypto from 'node:crypto';

const ENV = {
  TIMEOUT_MS: Number(process.env.IM_TIMEOUT_MS ?? 8000),
  MAX_BYTES: Number(process.env.IM_MAX_BYTES ?? 50 * 1024 * 1024),
  ALLOW_HOSTS: (process.env.IM_ALLOW_HOSTS ?? 'cdn.educo.vn,ytimg.com,i.ytimg.com,localhost,127.0.0.1')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
};

function hostAllowed(host: string): boolean {
  const h = host.toLowerCase();
  return ENV.ALLOW_HOSTS.some((allow) => h === allow || h.endsWith(`.${allow}`));
}

export async function fetchBuffer(
  urlStr: string,
  timeoutMs: number = ENV.TIMEOUT_MS,
  maxBytes: number = ENV.MAX_BYTES
): Promise<{ buf: Buffer; ct?: string; ext?: string }> {
  const u = new URL(urlStr);
  if (!hostAllowed(u.hostname)) throw new Error(`Host not allowed: ${u.hostname}`);
  const lib = u.protocol === 'http:' ? http : https;

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

      const ct = res.headers['content-type'] as string | undefined;
      const ext = path.extname(u.pathname) || '';
      const chunks: Buffer[] = [];
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

export async function downloadToDir(url: string, dir: string): Promise<string | undefined> {
  const { buf, ct, ext } = await fetchBuffer(url);
  const hash = crypto.createHash('sha256').update(buf).digest('hex');
  const cleanExt = (ext && ext.length <= 8 ? ext : guessExt(ct)) || '';
  const dst = path.join(dir, `${hash}${cleanExt}`);

  if (!fs.existsSync(dst)) {
    const tmp = `${dst}.part`;
    await fs.promises.writeFile(tmp, buf);
    await fs.promises.rename(tmp, dst);
  }

  return path.join(dir, `${hash}${cleanExt}`).replace(/\\/g, '/');
}

function guessExt(ct?: string): string | undefined {
  if (!ct) return undefined;
  const t = ct.toLowerCase();
  if (t.startsWith('image/')) {
    if (t.includes('jpeg')) return '.jpg';
    if (t.includes('png')) return '.png';
    if (t.includes('webp')) return '.webp';
    if (t.includes('gif')) return '.gif';
    if (t.includes('svg')) return '.svg';
  }
  if (t.includes('pdf')) return '.pdf';
  if (t.includes('mp4')) return '.mp4';
  if (t.includes('mpeg')) return '.mpeg';
  return undefined;
}

export function safeParseJSON(s: string) {
  try {
    return JSON.parse(s);
  } catch {
    return s;
  }
}

export function normalizeArrayLists(v: any): any[] | undefined {
  if (!v) return undefined;
  if (Array.isArray(v)) {
    if (v.length === 1 && Array.isArray(v[0])) return v[0] as any[];
    return v as any[];
  }
  if (typeof v === 'object') return [v];
  return undefined;
}
