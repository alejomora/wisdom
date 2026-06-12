#!/usr/bin/env bun

/**
 * Script para cambiar entre SQLite (desarrollo local) y MySQL (producción Hostinger)
 * 
 * Uso:
 *   bun run db:switch:mysql   → Cambiar a MySQL (antes de deploy)
 *   bun run db:switch:sqlite  → Cambiar a SQLite (para desarrollo local)
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const SCHEMA_DIR = join(import.meta.dir, '..', 'prisma');
const SQLITE_SCHEMA = join(SCHEMA_DIR, 'schema.sqlite.prisma');
const MYSQL_SCHEMA = join(SCHEMA_DIR, 'schema.mysql.prisma');
const ACTIVE_SCHEMA = join(SCHEMA_DIR, 'schema.prisma');

const ENV_FILE = join(import.meta.dir, '..', '.env');
const SQLITE_URL = 'DATABASE_URL=file:/home/z/my-project/db/custom.db';

const target = process.argv[2];

if (!target || !['mysql', 'sqlite'].includes(target)) {
  console.log('❌ Uso: bun run scripts/switch-db.js [mysql|sqlite]');
  process.exit(1);
}

if (target === 'mysql') {
  if (!existsSync(MYSQL_SCHEMA)) {
    console.log('❌ No se encontró prisma/schema.mysql.prisma');
    process.exit(1);
  }

  // Copy MySQL schema
  const mysqlContent = readFileSync(MYSQL_SCHEMA, 'utf-8');
  writeFileSync(ACTIVE_SCHEMA, mysqlContent);
  console.log('✅ Schema cambiado a MySQL (provider = "mysql")');
  console.log('📋 Campos @db.Text y @db.LongText incluidos para JSON/long text');

  // Update .env if it has SQLite URL
  if (existsSync(ENV_FILE)) {
    const envContent = readFileSync(ENV_FILE, 'utf-8');
    if (envContent.includes('file:/home/z/my-project/db/custom.db')) {
      console.log('');
      console.log('⚠️  IMPORTANTE: Tu .env todavía apunta a SQLite.');
      console.log('   Para operaciones con Hostinger MySQL, necesitas cambiar la URL:');
      console.log('   DATABASE_URL=mysql://USUARIO:PASSWORD@HOST:3306/NOMBRE_BD');
      console.log('');
      console.log('   NO cambies el .env si solo vas a hacer push a GitHub.');
      console.log('   Vercel usará su propia DATABASE_URL configurada en el dashboard.');
    }
  }

  console.log('');
  console.log('🚀 Próximos pasos para deploy:');
  console.log('   1. git add . && git commit -m "Switch to MySQL" && git push');
  console.log('   2. Vercel redesplegará automáticamente');
  console.log('   3. Para volver a SQLite: bun run db:switch:sqlite');

} else if (target === 'sqlite') {
  if (!existsSync(SQLITE_SCHEMA)) {
    console.log('❌ No se encontró prisma/schema.sqlite.prisma');
    process.exit(1);
  }

  // Copy SQLite schema
  const sqliteContent = readFileSync(SQLITE_SCHEMA, 'utf-8');
  writeFileSync(ACTIVE_SCHEMA, sqliteContent);
  console.log('✅ Schema cambiado a SQLite (provider = "sqlite")');

  // Update .env to SQLite
  if (existsSync(ENV_FILE)) {
    const envContent = readFileSync(ENV_FILE, 'utf-8');
    const newEnvContent = envContent.replace(
      /DATABASE_URL=.*/,
      SQLITE_URL
    );
    writeFileSync(ENV_FILE, newEnvContent);
    console.log('✅ .env actualizado a SQLite');
  }

  console.log('');
  console.log('🔄 Ahora ejecuta: bunx prisma generate');
  console.log('   Luego: bun run dev');
}

// Generate Prisma client
console.log('');
console.log('⏳ Generando Prisma client...');
try {
  const proc = Bun.spawnSync(['npx', 'prisma', 'generate'], {
    cwd: join(import.meta.dir, '..'),
    stdio: 'inherit',
    env: { ...process.env },
  });
  if (proc.exitCode === 0) {
    console.log('✅ Prisma client generado exitosamente');
  } else {
    console.log('⚠️  Prisma generate falló (posiblemente porque .env no apunta al proveedor correcto)');
    console.log('   Ejecuta manualmente: bunx prisma generate');
  }
} catch (e) {
  console.log('⚠️  Error generando Prisma client. Ejecuta manualmente: bunx prisma generate');
}

console.log('');
console.log('━'.repeat(50));
console.log(`📊 Estado actual: ${target === 'mysql' ? 'MySQL (Hostinger)' : 'SQLite (Local)'}`);
console.log('━'.repeat(50));
