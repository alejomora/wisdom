# 🚀 Guía de Deploy: Wisdom Quest en Vercel + Supabase

## Costo total: **$0/mes** 🎉
> Supabase plan gratis + Vercel Hobby plan = $0

---

## 📋 Arquitectura

```
┌─────────────────┐         ┌──────────────────────┐
│   VERCEL        │  ────→  │   SUPABASE            │
│   (Frontend +   │  HTTPS  │   (PostgreSQL)        │
│    API Routes)  │  SSL ✅  │   Persistente ✅       │
│                 │         │   Connection Pool ✅    │
│   GRATIS        │         │   GRATIS (500MB)       │
└─────────────────┘         └──────────────────────┘
     🌐 Internet                  🗄️ PostgreSQL
```

- **Vercel**: Hospeda la app Next.js (frontend + API routes) → **Gratis**
- **Supabase**: Base de datos PostgreSQL en la nube → **Gratis (500MB)**

---

## PASO 1: Crear cuenta en Supabase

### 1a. Registrarse

1. Ve a **https://supabase.com**
2. Clic en **"Start your project"**
3. Regístrate con GitHub (más fácil) o email
4. Clic en **"New Project"**

### 1b. Crear el proyecto

1. **Name**: `wisdom-quest` (o el que prefieras)
2. **Database Password**: Elige una contraseña FUERTE (¡guárdala!)
3. **Region**: Selecciona **US East (North Virginia)** — más cerca de Colombia
4. Clic en **"Create new project"**
5. Espera ~2 minutos mientras se crea

### 1c. Obtener la URL de conexión

1. En tu proyecto, ve a **Settings** (⚙️ icono abajo a la izquierda)
2. Clic en **Database**
3. Busca la sección **"Connection string"**
4. Selecciona **"URI"** tab
5. Verás algo como:
   ```
   postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```
6. Reemplaza `[YOUR-PASSWORD]` con tu contraseña del paso 1b

### 1d. ⚠️ IMPORTANTE: Connection Pooler vs Direct

Supabase te da DOS URLs:

| Tipo | Puerto | Para qué |
|------|--------|----------|
| **Pooler (Transaction)** | 6543 | Para Vercel (producción) ✅ |
| **Direct** | 5432 | Para migraciones (prisma db push) |

**Para Vercel usa la URL del POOLER** (puerto 6543) con `?pgbouncer=true`
**Para migraciones usa la URL DIRECTA** (puerto 5432)

---

## PASO 2: Crear tablas en Supabase con Prisma

### 2a. Cambiar schema a PostgreSQL

```bash
bun run db:switch:postgresql
```

Esto copia `schema.postgresql.prisma` a `schema.prisma` y genera el client.

### 2b. Cambiar .env temporalmente a Supabase (DIRECT URL)

Edita tu archivo `.env` y cambia la URL a la conexión DIRECTA de Supabase:

```
DATABASE_URL=postgresql://postgres.xxxxx:TU_PASSWORD@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

> ⚠️ Usa el puerto **5432** (directa) para migraciones, NO el 6543

### 2c. Crear las tablas

```bash
bunx prisma db push
```

Esto crea todas las tablas en Supabase. Deberías ver:
```
🚀 Your database is now in sync with your Prisma schema.
```

### 2d. Llenar con datos iniciales (seed)

```bash
bun run db:seed
```

Esto crea los niveles, escenarios, lecciones, recompensas, etc.

### 2e. Verificar en Supabase

1. Ve a tu proyecto en **supabase.com**
2. Clic en **Table Editor** (icono de tabla a la izquierda)
3. Deberías ver todas las tablas con datos:
   - ✅ `User` — 2 usuarios (demo + admin)
   - ✅ `Level` — 3 niveles
   - ✅ `Scenario` — 75 escenarios
   - ✅ `Lesson` + `Question` — Lecciones y preguntas
   - ✅ `Reward` — 68 recompensas
   - ✅ `Mission` — 18 misiones
   - ✅ `Achievement` — 15 logros

### 2f. Restaurar .env local (para seguir desarrollando con SQLite)

```bash
bun run db:switch:sqlite
```

Esto restaura SQLite y actualiza tu `.env`.

---

## PASO 3: Subir a Vercel

### 3a. Asegúrate de que schema.prisma dice "postgresql"

Antes de hacer push, cambia a PostgreSQL:

```bash
bun run db:switch:postgresql
```

> ⚠️ Verifica que `prisma/schema.prisma` tenga `provider = "postgresql"`

### 3b. Hacer commit y push

```bash
git add .
git commit -m "Switch to PostgreSQL for Supabase deployment"
git push
```

### 3c. Crear cuenta en Vercel

1. Ve a **https://vercel.com**
2. Clic en **"Sign Up"**
3. **Regístrate con GitHub** (eso conecta todo automáticamente)

### 3d. Importar el proyecto

1. Clic en **"Add New..."** → **"Project"**
2. Verás tu repo `wisdom` — clic en **"Import"**
3. Configura el proyecto:
   - **Framework Preset**: Next.js (lo detecta automáticamente)
   - **Root Directory**: `.` (dejar por defecto)
   - **Build Command**: `next build` (dejar por defecto)
   - **Output Directory**: `.next` (dejar por defecto)

### 3e. ⚠️ IMPORTANTE — Agregar variables de entorno

Antes de hacer clic en "Deploy":

1. Abre la sección **"Environment Variables"**
2. Agrega:
   - **Key**: `DATABASE_URL`
   - **Value**: La URL del **POOLER** de Supabase (puerto 6543) con `?pgbouncer=true`

   Ejemplo:
   ```
   postgresql://postgres.xxxxx:TU_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

   > ⚠️ Usa el puerto **6543** (pooler) para Vercel, NO el 5432
   > ⚠️ Agrega `?pgbouncer=true` al final
   > ⚠️ Si tu contraseña tiene caracteres especiales, codifícalos: `@` → `%40`, `#` → `%23`, `!` → `%21`

3. Clic en **"Add"**

### 3f. Deploy 🚀

1. Clic en **"Deploy"**
2. Espera 2-3 minutos
3. ¡Listo! Vercel te da una URL como: `https://wisdom-quest-xyz123.vercel.app`

---

## PASO 4: Verificar que todo funciona

1. Abre la URL que te dio Vercel
2. Deberías ver la pantalla de login de Wisdom Quest
3. Inicia sesión con:
   - **Email**: demo@wisdomquest.com
   - **Password**: demo123
4. Navega por la app y verifica que:
   - ✅ Los niveles y escenarios se cargan
   - ✅ Puedes hacer ejercicios
   - ✅ El progreso se guarda (refresca la página y verifica)
   - ✅ La tienda funciona
   - ✅ Las misiones funcionan
   - ✅ Las monedas se guardan
   - ✅ Los avatars se pueden comprar

---

## PASO 5: Agregar un dominio personalizado (opcional)

Si tienes un dominio propio:

1. En Vercel, ve a tu proyecto → **Settings** → **Domains**
2. Escribe tu dominio (ej: `wisdomquest.com`)
3. Clic en **"Add"**
4. Vercel te dará los registros DNS que debes configurar:
   - Ve a tu proveedor de dominios → **DNS**
   - Agrega un registro **CNAME** apuntando a `cname.vercel-dns.com`
5. SSL se configura automáticamente ✅

---

## 🔄 Cómo actualizar la app en el futuro

### Flujo de desarrollo → producción:

```bash
# 1. Desarrolla localmente con SQLite
bun run db:switch:sqlite   # Asegúrate de estar en SQLite
bun run dev                 # Desarrolla normalmente

# 2. Cuando estés listo para deploy:
bun run db:switch:postgresql  # Cambiar schema a PostgreSQL
git add .
git commit -m "Nueva funcionalidad"
git push                       # Vercel redespliega automáticamente

# 3. Volver a desarrollo local:
bun run db:switch:sqlite       # Restaurar SQLite
```

### Si cambias el esquema de la base de datos:

```bash
# 1. Cambiar a PostgreSQL y apuntar a Supabase DIRECT URL
bun run db:switch:postgresql

# 2. Editar .env temporalmente a la URL DIRECTA de Supabase (puerto 5432)
# DATABASE_URL=postgresql://postgres.xxxxx:PASSWORD@aws-0-us-east-1.pooler.supabase.com:5432/postgres

# 3. Aplicar cambios
bunx prisma db push

# 4. Restaurar SQLite local
bun run db:switch:sqlite

# 5. Commit y push (con schema en postgresql)
bun run db:switch:postgresql
git add .
git commit -m "Schema update"
git push
bun run db:switch:sqlite
```

---

## 🛠️ Solución de problemas

### Error: "P1001: Can't reach database server"
- Verifica que la URL de Supabase sea correcta
- Verifica que la contraseña esté correcta
- Si usas la URL del pooler (6543), agrega `?pgbouncer=true`
- Para migraciones, usa la URL directa (5432)

### Error: "P3009: cannot find migration"
- Usa `prisma db push` en lugar de `prisma migrate`
- `db push` sincroniza el schema sin migraciones

### Error: "Can't reach database server at aws-0-us-east-1.pooler.supabase.com:6543"
- Verifica tu región — puede que tu proyecto esté en otra región
- Revisa la Connection String en Supabase Settings → Database

### Error: "prepared statement does not exist"
- Esto pasa cuando usas la URL directa (5432) con pgBouncer
- Solución: Usa la URL del pooler (6543) con `?pgbouncer=true`

### Error: "Too many connections"
- Supabase free tier: ~60 conexiones simultáneas
- Asegúrate de usar el Connection Pooler (puerto 6543)
- Agrega `?connection_limit=5` a la URL si es necesario

### La app se ve bien pero no hay datos
- Corre el seed apuntando a Supabase: `bun run db:seed`
- Verifica en Supabase Table Editor que haya datos

### Vercel build falla
- Verifica que `prisma/schema.prisma` tenga `provider = "postgresql"`
- Verifica que la variable `DATABASE_URL` esté configurada en Vercel
- Verifica que `postinstall` esté en package.json (`prisma generate`)

### Error: "Prisma Client could not be generated"
- Verifica que `prisma/schema.prisma` tenga `provider = "postgresql"`
- Ejecuta manualmente: `bunx prisma generate`
- Verifica que el archivo `.env` no tenga errores

### Cold starts (lentitud en primera request)
- Es normal en Vercel serverless — la primera request tarda 1-3s
- Las siguientes requests son rápidas
- Si es muy notorio, considera Vercel Pro ($20/mes) con funciones siempre calientes

---

## 📊 Límites del plan gratis

| Recurso | Vercel Free | Supabase Free |
|---------|------------|---------------|
| Bandwidth | 100GB/mes | 5GB/mes |
| Serverless Functions | 100K/día | — |
| Base de datos | — | 500MB |
| Conexiones simultáneas | — | ~60 |
| Storage de archivos | — | 1GB |
| Proyectos | Ilimitados | 2 proyectos |
| Backups | — | Diarios (7 días) |
| Row Level Security | — | ✅ Incluido |
| Real-time | — | ✅ 200 conexiones |

---

## 📋 Resumen rápido (Checklist)

- [ ] Crear cuenta en **supabase.com**
- [ ] Crear proyecto en Supabase (región US East)
- [ ] Anotar contraseña y Connection Strings (directa + pooler)
- [ ] Ejecutar `bun run db:switch:postgresql`
- [ ] Cambiar `.env` temporalmente a Supabase DIRECT URL (puerto 5432)
- [ ] Ejecutar `bunx prisma db push`
- [ ] Ejecutar `bun run db:seed`
- [ ] Verificar datos en Supabase Table Editor
- [ ] Ejecutar `bun run db:switch:postgresql` (asegurar schema en postgresql)
- [ ] Hacer `git push` (schema debe estar en postgresql)
- [ ] Crear cuenta en **vercel.com** (con GitHub)
- [ ] Importar repo `wisdom` en Vercel
- [ ] Agregar `DATABASE_URL` con Supabase POOLER URL (puerto 6543 + ?pgbouncer=true)
- [ ] Deploy → ¡Probar la app! 🎉
- [ ] Restaurar desarrollo local: `bun run db:switch:sqlite`

---

## 🎉 ¡Felicidades!

Tu app Wisdom Quest está ahora online con:
- **Frontend/API**: Vercel (gratis, CDN global, SSL automático)
- **Base de datos**: Supabase PostgreSQL (gratis, persistente, con pooler)

¡A aprender inglés! 🇬🇧📚
