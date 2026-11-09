'use strict';

// Kontaktformular: HTTPS-POST -> Validierung -> SMTP (Crossmedia) -> Postfach.
// Zugangsdaten ausschliesslich aus Vercel Environment Variables (siehe README, Abschnitt Kontaktformular).

const nodemailer = require('nodemailer');

const MAX_BODY_BYTES = 10 * 1024;
const LIMITS = { vorname: 80, nachname: 80, email: 254, telefon: 40, nachricht: 5000 };
const MIN_FILL_MS = 3000; // schneller ausgefuellt -> sehr wahrscheinlich Bot
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const SUBJECT = 'Neue Website-Anfrage – Baltic Wasserveredlung';

const ALLOWED_ORIGINS = new Set([
  'https://www.baltic-wasserveredlung.de',
  'https://baltic-wasserveredlung.de',
  'https://baltic-wasserveredlung.vercel.app',
]);
// Preview-Deployments dieses Projekts
const PREVIEW_ORIGIN_RE = /^https:\/\/baltic-wasserveredlung-[a-z0-9]+-supervisor77dw-debugs-projects\.vercel\.app$/;

const EMAIL_RE = /^[^\s@<>()",;:\\[\]]{1,64}@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;
const PHONE_RE = /^[0-9+()\/.\s-]{3,40}$/;

// Best effort je Funktionsinstanz (keine verteilte Zaehlung)
const hits = new Map();

function rateLimited(ip, now) {
  const list = (hits.get(ip) || []).filter(t => now - t < RATE_WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) {
    for (const [key, times] of hits) if (!times.some(t => now - t < RATE_WINDOW_MS)) hits.delete(key);
  }
  return list.length > RATE_MAX;
}

function clientIp(req) {
  const fwd = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  return fwd || String(req.headers['x-real-ip'] || '') || (req.socket && req.socket.remoteAddress) || 'unknown';
}

function originAllowed(req) {
  const origin = String(req.headers.origin || '');
  if (!origin) return false;
  if (ALLOWED_ORIGINS.has(origin) || PREVIEW_ORIGIN_RE.test(origin)) return true;
  const extra = String(process.env.CONTACT_ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
  return extra.includes(origin);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const declared = Number(req.headers['content-length'] || 0);
    if (declared > MAX_BODY_BYTES) return reject(Object.assign(new Error('too large'), { status: 413 }));
    let size = 0;
    const chunks = [];
    req.on('data', chunk => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(Object.assign(new Error('too large'), { status: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function parseBody(raw, contentType) {
  const type = String(contentType || '').split(';')[0].trim().toLowerCase();
  if (type === 'application/json') {
    const data = JSON.parse(raw || '{}');
    if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('bad json');
    return data;
  }
  if (type === 'application/x-www-form-urlencoded') {
    return Object.fromEntries(new URLSearchParams(raw));
  }
  throw Object.assign(new Error('unsupported type'), { status: 415 });
}

const str = v => (typeof v === 'string' ? v : '');
const oneLine = v => str(v).replace(/[\u0000-\u001f\u007f]+/g, ' ').replace(/\s+/g, ' ').trim();
const multiLine = v => str(v).replace(/\r\n?/g, '\n').replace(/[\u0000-\u0008\u000b-\u001f\u007f]+/g, '').trim();

function validate(data) {
  const f = {
    vorname: oneLine(data.Vorname),
    nachname: oneLine(data.Nachname),
    email: oneLine(data['E-Mail']).toLowerCase(),
    telefon: oneLine(data.Telefon),
    nachricht: multiLine(data.Nachricht),
  };
  const errors = [];
  for (const [key, max] of Object.entries(LIMITS)) if (f[key].length > max) errors.push(key);
  if (!f.email || !EMAIL_RE.test(f.email)) errors.push('email');
  if (f.telefon && !PHONE_RE.test(f.telefon)) errors.push('telefon');
  if (f.nachricht.length < 2) errors.push('nachricht');
  // Plausibilitaet: Links in grosser Zahl sind typisch fuer Spam
  if ((f.nachricht.match(/https?:\/\//gi) || []).length > 3) errors.push('nachricht');
  return { fields: f, errors: [...new Set(errors)] };
}

function berlinTime(date) {
  return new Intl.DateTimeFormat('de-DE', {
    timeZone: 'Europe/Berlin', dateStyle: 'medium', timeStyle: 'medium',
  }).format(date) + ' (Europe/Berlin)';
}

function buildText(f, date) {
  return [
    'Neue Anfrage über das Kontaktformular auf www.baltic-wasserveredlung.de',
    '',
    `Vorname:   ${f.vorname || '–'}`,
    `Nachname:  ${f.nachname || '–'}`,
    `E-Mail:    ${f.email}`,
    `Telefon:   ${f.telefon || '–'}`,
    `Zeitpunkt: ${berlinTime(date)}`,
    '',
    'Nachricht:',
    f.nachricht,
    '',
    '—',
    'Antworten Sie direkt auf diese E-Mail, um der anfragenden Person zu antworten.',
  ].join('\n');
}

function smtpConfig() {
  const env = process.env;
  const required = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'CONTACT_FROM', 'CONTACT_TO'];
  if (required.some(k => !env[k])) return null;
  const port = Number(env.SMTP_PORT || 587);
  return {
    transport: {
      host: env.SMTP_HOST,
      port,
      secure: port === 465,
      requireTLS: port !== 465,
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    },
    from: env.CONTACT_FROM,
    to: env.CONTACT_TO,
  };
}

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return send(res, 405, { ok: false, error: 'method' });
  }
  if (!originAllowed(req)) return send(res, 403, { ok: false, error: 'origin' });

  const now = Date.now();
  if (rateLimited(clientIp(req), now)) {
    res.setHeader('Retry-After', String(Math.ceil(RATE_WINDOW_MS / 1000)));
    return send(res, 429, { ok: false, error: 'rate' });
  }

  let data;
  try {
    data = parseBody(await readBody(req), req.headers['content-type']);
  } catch (err) {
    return send(res, err.status || 400, { ok: false, error: 'request' });
  }

  // Honeypot oder zu schnelles Ausfuellen: still als Erfolg quittieren, nichts versenden
  const started = Number(data._t || 0);
  if (str(data.website).trim() || (started > 0 && now - started < MIN_FILL_MS)) {
    return send(res, 200, { ok: true });
  }

  const { fields, errors } = validate(data);
  if (errors.length) return send(res, 400, { ok: false, error: 'validation', fields: errors });

  const cfg = smtpConfig();
  if (!cfg) {
    console.error('contact: SMTP-Konfiguration unvollstaendig');
    return send(res, 503, { ok: false, error: 'unavailable' });
  }

  try {
    const transporter = handler.createTransport(cfg.transport);
    await transporter.sendMail({
      from: cfg.from,
      to: cfg.to,
      replyTo: fields.email,
      subject: SUBJECT,
      text: buildText(fields, new Date(now)),
    });
  } catch (err) {
    console.error('contact: Versand fehlgeschlagen', err && (err.code || err.responseCode || err.name));
    return send(res, 502, { ok: false, error: 'send' });
  }
  return send(res, 200, { ok: true });
}

handler.createTransport = options => nodemailer.createTransport(options);
handler._internal = { validate, rateLimited, hits, buildText };

module.exports = handler;
