#!/usr/bin/env node
// Zachováno pro zpětnou kompatibilitu. Přesměrováno na check-web.mjs.
import { spawnSync } from 'node:child_process';
const r = spawnSync(process.execPath, [new URL('./check-web.mjs', import.meta.url).pathname, ...process.argv.slice(2)], { stdio: 'inherit' });
process.exit(r.status ?? 0);
