#!/usr/bin/env bun

/**
 * Script para cambiar entre SQLite (desarrollo local), MySQL (Hostinger) y PostgreSQL (Supabase)
 *
 * Uso:
 *   bun run db:switch:postgresql → Cambiar a PostgreSQL/Supabase (antes de deploy)
 *   bun run db:switch:mysql      → Cambiar a MySQL/Hostinger (antes de deploy)
 *   bun run db:switch:sqlite     → Cambiar a SQLite (para desarrollo local)
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const SCHEMA_DIR = join(import.meta.dir, '..', 'prisma');
const SQLITE_SCHEMA = join(SCHEMA_DIR, 'schema.sqlite.prisma');
const MYSQL_SCHEMA = join(SCHEMA_DIR, 'schema.mysql.prisma');
const POSTGRESQL_SCHEMA = join(SCHEMA_DIR, 'schema.postgresql.prisma');
const ACTIVE_SCHEMA = join(SCHEMA_DIR, 'schema.prisma');

const ENV_FILE = join(import.meta.dir, '..', '.env');
const SQLITE_URL = 'DATABASE_URL=file:/home/z/my-project/db/custom.db';

const target = process.argv[2];

if (!target || !['mysql', 'sqlite', 'postgresql'].includes(target)) {
  console.log('❌ Uso: bun run scripts/switch-db.js [postgresql|mysql|sqlite]');
  process.exit(1);
}

const schemaMap = {
  mysql: { file: MYSQL_SCHEMA, name: 'MySQL (Hostinger)', provider: 'mysql' },
  postgresql: { file: POSTGRESQL_SCHEMA, name: 'PostgreSQL (Supabase)', provider: 'postgresql' },
  sqlite: { file: SQLITE_SCHEMA, name: 'SQLite (Local)', provider: 'sqlite' },
};

const config = schemaMap[target];

if (!existsSync(config.file)) {
  console.log(`❌ No se encontró prisma/schema.${target}.prisma`);
  process.exit(1);
}

// Copy target schema to active schema
const schemaContent = readFileSync(config.file, 'utf-8');
writeFileSync(ACTIVE_SCHEMA, schemaContent);
console.log(`✅ Schema cambiado a ${config.name} (provider = "${config.provider}")`);

if (target === 'sqlite') {
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

} else if (target === 'postgresql') {
  if (existsSync(ENV_FILE)) {
    const envContent = readFileSync(ENV_FILE, 'utf-8');
    if (envContent.includes('file:/home/z/my-project/db/custom.db')) {
      console.log('');
      console.log('⚠️  IMPORTANTE: Tu .env todavía apunta a SQLite.');
      console.log('   Para operaciones con Supabase PostgreSQL, necesitas cambiar la URL:');
      console.log('   DATABASE_URL=postgresql://postgres:PASSWORD@db.XXXXX.supabase.co:5432/postgres');
      console.log('');
      console.log('   NO cambies el .env si solo vas a hacer push a GitHub.');
      console.log('   Vercel usará su propia DATABASE_URL configurada en el dashboard.');
    }
  }

  console.log('');
  console.log('🚀 Próximos pasos para deploy a Vercel + Supabase:');
  console.log('   1. Crear cuenta en supabase.com y crear un proyecto');
  console.log('   2. Copiar la Connection String (URI) del proyecto');
  console.log('   3. Cambiar .env a la URL de Supabase (temporalmente)');
  console.log('   4. Ejecutar: bunx prisma db push');
  console.log('   5. Ejecutar: bun run db:seed');
  console.log('   6. git add . && git commit -m "Switch to PostgreSQL" && git push');
  console.log('   7. Configurar DATABASE_URL en Vercel');
  console.log('   8. Para volver a SQLite: bun run db:switch:sqlite');

} else if (target === 'mysql') {
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
console.log(`📊 Estado actual: ${config.name}`);
console.log('━'.repeat(50));
