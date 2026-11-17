// Renders the 1200×630 share image (public/og.jpg) and the 180×180 apple-touch-icon from the brand fonts and logo.
// Run once after changing the brand: node scripts/make-og.mjs
import puppeteer from 'puppeteer-core';
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const pub = (f) => pathToFileURL(path.resolve('public', f)).href;
const logo = fs.readFileSync('public/logo.svg', 'utf8');
const og = `<!doctype html><html><head><style>
@font-face{font-family:A;src:url(${pub('fonts/ArchivoBlack-400.woff2')})}
@font-face{font-family:S;font-style:italic;src:url(${pub('fonts/InstrumentSerif-400-italic.woff2')})}
@font-face{font-family:M;src:url(${pub('fonts/JetBrainsMono-400.woff2')})}
html,body{margin:0;width:1200px;height:630px;background:#09090c;color:#f5f1ef;overflow:hidden}
body{position:relative;font-family:A}
.g{position:absolute;inset:0;background-image:linear-gradient(rgba(245,241,239,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(245,241,239,.05) 1px,transparent 1px);background-size:60px 60px;-webkit-mask-image:radial-gradient(ellipse 70% 80% at 75% 40%,#000 20%,transparent 75%)}
.glow{position:absolute;width:900px;height:900px;right:-300px;top:-380px;background:radial-gradient(circle,rgba(255,48,69,.22),transparent 60%)}
.logo{position:absolute;left:72px;top:64px;width:170px}
.t{position:absolute;left:72px;top:210px;font-size:74px;line-height:.98;letter-spacing:-2px}
.t em{display:block;margin-top:10px;font-family:S;font-size:84px;letter-spacing:-1px;color:#ff3045}
.m{position:absolute;left:72px;bottom:56px;font-family:M;font-size:20px;letter-spacing:3px;color:rgba(245,241,239,.6)}
.ring{position:absolute;right:96px;top:70px;width:300px;height:64px;border:12px solid #ff3045;border-radius:50%;box-shadow:0 0 40px rgba(255,48,69,.6)}
</style></head><body><div class="g"></div><div class="glow"></div><div class="ring"></div>
<div class="logo">${logo}</div>
<div class="t">Your company already<br>knows the answer.<em>We give it a brain.</em></div>
<div class="m">AI AUTOMATION STUDIO · COMPANY BRAIN · AGENTS</div></body></html>`;

const icon = `<!doctype html><html><body style="margin:0;width:180px;height:180px;background:#09090c">
<img src="${pub('favicon.svg')}" style="width:180px;height:180px;display:block"></body></html>`;

const b = await puppeteer.launch({executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--allow-file-access-from-files']});
const p = await b.newPage();
await p.setViewport({width: 1200, height: 630});
fs.writeFileSync('og.tmp.html', og);
await p.goto(pathToFileURL(path.resolve('og.tmp.html')).href, {waitUntil: 'load'});
await p.evaluate(() => document.fonts.ready);
await p.screenshot({path: 'og.tmp.png'});
await p.setViewport({width: 180, height: 180});
fs.writeFileSync('icon.tmp.html', icon);
await p.goto(pathToFileURL(path.resolve('icon.tmp.html')).href, {waitUntil: 'load'});
await p.screenshot({path: 'public/apple-touch-icon.png'});
await b.close();
execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', 'og.tmp.png', '-q:v', '3', 'public/og.jpg']);
for (const f of ['og.tmp.html', 'og.tmp.png', 'icon.tmp.html']) fs.rmSync(f);
console.log('wrote public/og.jpg and public/apple-touch-icon.png');
