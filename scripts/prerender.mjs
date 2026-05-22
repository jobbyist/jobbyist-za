import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import puppeteer from 'puppeteer';

const BASE_URL = 'http://127.0.0.1:4173';
const DIST_DIR = path.resolve('dist');
const TOP_JOB_COUNT = Number.parseInt(process.env.PRERENDER_TOP_JOB_COUNT || '10', 10);

const staticRoutes = ['/', '/jobs', '/companies', '/terms', '/privacy', '/cookies', '/data-rights'];

async function getTopJobRoutes() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) return [];

  const endpoint = new URL('/rest/v1/jobs', supabaseUrl);
  endpoint.searchParams.set('select', 'id');
  endpoint.searchParams.set('status', 'eq.active');
  endpoint.searchParams.set('order', 'posted_at.desc');
  endpoint.searchParams.set('limit', String(TOP_JOB_COUNT));

  const response = await fetch(endpoint, {
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
    },
  });

  if (!response.ok) return [];
  const jobs = await response.json();
  return jobs.map((job) => `/job/${job.id}`);
}

function outputPathForRoute(route) {
  if (route === '/') return path.join(DIST_DIR, 'index.html');
  return path.join(DIST_DIR, route.slice(1), 'index.html');
}

async function main() {
  const preview = spawn('npm', ['run', 'preview', '--', '--host', '127.0.0.1', '--port', '4173'], { stdio: 'pipe' });
  await new Promise((resolve, reject) => {
    preview.stdout.on('data', (d) => {
      if (d.toString().includes('Local:')) resolve();
    });
    preview.on('error', reject);
    preview.on('exit', (code) => code !== 0 && reject(new Error(`preview exited ${code}`)));
  });

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const routes = [...staticRoutes, ...(await getTopJobRoutes())];

  for (const route of routes) {
    const url = `${BASE_URL}${route}`;
    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.waitForTimeout(6000);
    const html = await page.content();
    const outPath = outputPathForRoute(route);
    await mkdir(path.dirname(outPath), { recursive: true });
    await writeFile(outPath, `<!DOCTYPE html>\n${html}`);
    console.log(`[prerender] wrote ${route} -> ${outPath}`);
  }

  await browser.close();
  preview.kill('SIGTERM');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
