const http = require('node:http');
const { closeSync, existsSync, mkdirSync, openSync } = require('node:fs');
const { dirname, resolve } = require('node:path');
const { randomUUID, scryptSync, timingSafeEqual } = require('node:crypto');
const { PrismaClient } = require('@prisma/client');

function stableDatabasePath() {
  return resolve(process.cwd(), 'prisma', 'dev.db');
}

function stableDatabaseUrl() {
  return `file:${stableDatabasePath().replace(/\\/g, '/')}`;
}

function ensureDatabaseFile() {
  const databasePath = stableDatabasePath();
  mkdirSync(dirname(databasePath), { recursive: true });

  if (!existsSync(databasePath)) {
    const handle = openSync(databasePath, 'a');
    closeSync(handle);
  }
}

function hashPassword(password) {
  const salt = randomUUID().replace(/-/g, '');
  const derivedKey = scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

function verifyPassword(password, storedHash) {
  const [salt, digest] = storedHash.split(':');

  if (!salt || !digest) {
    return false;
  }

  const derivedKey = scryptSync(password, salt, 64);
  const digestBuffer = Buffer.from(digest, 'hex');

  return digestBuffer.length === derivedKey.length && timingSafeEqual(digestBuffer, derivedKey);
}

function getAgeLabelInChinese(birthDate, now) {
  let years = now.getFullYear() - birthDate.getFullYear();
  let months = now.getMonth() - birthDate.getMonth();

  if (now.getDate() < birthDate.getDate()) {
    months -= 1;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (years <= 0) {
    return `${Math.max(months, 0)}个月`;
  }

  return `${years}岁${Math.max(months, 0)}个月`;
}

function parseCookies(cookieHeader) {
  const cookies = {};

  if (!cookieHeader) {
    return cookies;
  }

  for (const pair of cookieHeader.split(';')) {
    const index = pair.indexOf('=');

    if (index === -1) {
      continue;
    }

    cookies[pair.slice(0, index).trim()] = decodeURIComponent(pair.slice(index + 1).trim());
  }

  return cookies;
}

function page(title, body) {
  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
  </head>
  <body>${body}</body>
</html>`;
}

function registerPage(message = '') {
  const error = message ? `<p role="alert">${message}</p>` : '';

  return page(
    '创建孩子档案',
    `<main>
      <h1>创建孩子档案</h1>
      <p>先把家长账号和孩子出生日期建好。</p>
      <form method="post" action="/register">
        <label for="email">邮箱</label>
        <input id="email" name="email" type="email" required />
        <label for="password">密码</label>
        <input id="password" name="password" type="password" required />
        <label for="nickname">孩子昵称</label>
        <input id="nickname" name="nickname" type="text" required />
        <label for="birthDate">出生日期</label>
        <input id="birthDate" name="birthDate" type="date" required />
        ${error}
        <button type="submit">创建档案并开始</button>
      </form>
      <p><a href="/login">直接登录</a></p>
    </main>`,
  );
}

function loginPage(message = '') {
  const error = message ? `<p role="alert">${message}</p>` : '';

  return page(
    '登录',
    `<main>
      <h1>登录</h1>
      <p>使用家长账号继续查看今天的陪伴建议和孩子档案。</p>
      <form method="post" action="/login">
        <label for="email">邮箱</label>
        <input id="email" name="email" type="email" required />
        <label for="password">密码</label>
        <input id="password" name="password" type="password" required />
        ${error}
        <button type="submit">登录并继续</button>
      </form>
      <p><a href="/register">去创建档案</a></p>
    </main>`,
  );
}

function todayPage(child) {
  if (!child) {
    return page(
      '今日陪伴',
      `<main>
        <h1>今日陪伴</h1>
        <p>先创建或登录家长账号，再保存孩子生日。</p>
        <p><a href="/register">去创建档案</a></p>
      </main>`,
    );
  }

  const ageLabel = getAgeLabelInChinese(child.birthDate, new Date());

  return page(
    '今日陪伴',
    `<main>
      <h1>今日陪伴</h1>
      <p>${child.nickname} · ${ageLabel}</p>
      <p>先从一个 10 分钟的小任务开始。</p>
      <p><a href="/profile">编辑孩子档案</a></p>
    </main>`,
  );
}

function readBody(request) {
  return new Promise((resolveBody, reject) => {
    const chunks = [];

    request.on('data', (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });
    request.on('end', () => resolveBody(Buffer.concat(chunks).toString('utf8')));
    request.on('error', reject);
  });
}

async function main() {
  ensureDatabaseFile();
  process.env.DATABASE_URL = stableDatabaseUrl();

  const db = new PrismaClient();

  await db.$executeRawUnsafe('PRAGMA foreign_keys = ON;');
  await db.$executeRawUnsafe('CREATE TABLE IF NOT EXISTS "User" (id TEXT PRIMARY KEY NOT NULL, email TEXT NOT NULL UNIQUE, passwordHash TEXT NOT NULL, createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP);');
  await db.$executeRawUnsafe('CREATE TABLE IF NOT EXISTS "ChildProfile" (id TEXT PRIMARY KEY NOT NULL, userId TEXT NOT NULL, nickname TEXT NOT NULL, birthDate DATETIME NOT NULL, isPrimary INTEGER NOT NULL DEFAULT 1, createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (userId) REFERENCES "User"(id) ON DELETE CASCADE);');
  await db.$executeRawUnsafe('CREATE UNIQUE INDEX IF NOT EXISTS "ChildProfile_userId_isPrimary_key" ON "ChildProfile"(userId, isPrimary);');
  await db.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "ChildProfile_userId_idx" ON "ChildProfile"(userId);');

  const server = http.createServer(async (request, response) => {
    const url = new URL(request.url || '/', 'http://127.0.0.1:3000');
    const cookies = parseCookies(request.headers.cookie);

    if (request.method === 'GET' && url.pathname === '/') {
      response.statusCode = 302;
      response.setHeader('Location', '/register');
      response.end();
      return;
    }

    if (request.method === 'GET' && url.pathname === '/register') {
      response.setHeader('Content-Type', 'text/html; charset=utf-8');
      response.end(registerPage());
      return;
    }

    if (request.method === 'POST' && url.pathname === '/register') {
      const form = new URLSearchParams(await readBody(request));
      const email = String(form.get('email') || '').trim().toLowerCase();
      const password = String(form.get('password') || '');
      const nickname = String(form.get('nickname') || '').trim();
      const birthDate = String(form.get('birthDate') || '');

      if (!email || !password || !nickname || !birthDate) {
        response.statusCode = 400;
        response.setHeader('Content-Type', 'text/html; charset=utf-8');
        response.end(registerPage('请填写完整的信息。'));
        return;
      }

      const passwordHash = hashPassword(password);
      const existingUser = await db.user.findUnique({ where: { email } });

      if (existingUser) {
        await db.childProfile.deleteMany({ where: { userId: existingUser.id } });
        await db.user.delete({ where: { email } });
      }

      const user = await db.user.create({
        data: {
          email,
          passwordHash,
          children: {
            create: {
              nickname,
              birthDate: new Date(`${birthDate}T00:00:00.000Z`),
              isPrimary: true,
            },
          },
        },
      });

      response.statusCode = 302;
      response.setHeader('Set-Cookie', `parent-session=${encodeURIComponent(user.id)}; Path=/; HttpOnly; SameSite=Lax`);
      response.setHeader('Location', '/today');
      response.end();
      return;
    }

    if (request.method === 'GET' && url.pathname === '/login') {
      response.setHeader('Content-Type', 'text/html; charset=utf-8');
      response.end(loginPage());
      return;
    }

    if (request.method === 'POST' && url.pathname === '/login') {
      const form = new URLSearchParams(await readBody(request));
      const email = String(form.get('email') || '').trim().toLowerCase();
      const password = String(form.get('password') || '');
      const user = await db.user.findUnique({ where: { email } });
      const isValid = user ? verifyPassword(password, user.passwordHash) : false;

      if (!user || !isValid) {
        response.statusCode = 401;
        response.setHeader('Content-Type', 'text/html; charset=utf-8');
        response.end(loginPage('邮箱或密码不正确。'));
        return;
      }

      response.statusCode = 302;
      response.setHeader('Set-Cookie', `parent-session=${encodeURIComponent(user.id)}; Path=/; HttpOnly; SameSite=Lax`);
      response.setHeader('Location', '/today');
      response.end();
      return;
    }

    if (request.method === 'GET' && url.pathname === '/today') {
      const userId = cookies['parent-session'];
      const child = userId
        ? await db.childProfile.findFirst({
            where: {
              userId,
              isPrimary: true,
            },
          })
        : null;

      response.setHeader('Content-Type', 'text/html; charset=utf-8');
      response.end(todayPage(child));
      return;
    }

    if (request.method === 'GET' && url.pathname === '/profile') {
      response.statusCode = 302;
      response.setHeader('Location', '/today');
      response.end();
      return;
    }

    response.statusCode = 404;
    response.setHeader('Content-Type', 'text/plain; charset=utf-8');
    response.end('Not found');
  });

  server.listen(3000, '127.0.0.1');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
