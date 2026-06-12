# 🚀 Guía de Deploy: Prompt Maestro en Vercel + Hostinger MySQL

## Costo total: **$0 adicionales/mes** 🎉
> Ya pagas por Hostinger, así que la base de datos MySQL ya está incluida.
> Vercel Hobby plan es 100% gratis.

---

## 📋 Arquitectura

```
┌─────────────────┐         ┌──────────────────────┐
│   VERCEL        │  ────→  │   HOSTINGER MySQL     │
│   (Frontend +   │  Remoto │   (Base de datos)     │
│    API Routes)  │  :3306  │                      │
└─────────────────┘         └──────────────────────┘
     🌐 Internet                  🗄️ Tu hosting
```

- **Vercel**: Hospeda la app Next.js (frontend + API routes) → **Gratis**
- **Hostinger MySQL**: Base de datos remota → **Ya incluido en tu plan**

---

## ⚠️ Requisito IMPORTANTE: Acceso Remoto MySQL

Tu plan de Hostinger **DEBE** permitir acceso remoto a MySQL. La mayoría de los planes Premium y Business lo permiten.

### ¿Cómo verificarlo?
1. Entra a tu **hPanel** de Hostinger
2. Ve a **Bases de datos** → **MySQL**
3. Busca la sección **"Acceso Remoto"** o **"Remote MySQL"**
4. Si existe → ✅ ¡Perfecto! Tu plan lo soporta
5. Si NO existe → ❌ Necesitas actualizar tu plan o usar Supabase como alternativa

---

## PASO 1: Crear la base de datos en Hostinger

### 1a. Crear base de datos y usuario

1. Entra a tu **hPanel** de Hostinger
2. Ve a **Bases de datos** → **MySQL Bases de datos**
3. En **"Crear nueva base de datos"**:
   - **Nombre**: `lingoqueest` (o el que prefieras)
   - **Usuario**: Crea un usuario nuevo (ej: `lingo_user`)
   - **Contraseña**: Elige una contraseña fuerte (¡guárdala!)
4. Clic en **"Crear"**

> **Nota**: Hostinger agrega un prefijo automáticamente. El nombre real será algo como `u123456789_lingoqueest`

### 1b. Habilitar acceso remoto ⚠️ CRÍTICO

1. En la misma página de **MySQL Bases de datos**
2. Busca la sección **"Acceso Remoto"** o **"Access Hosts"**
3. Agrega el host: `%` (significa "cualquier IP" — necesario para Vercel)
4. Clic en **"Agregar"** o **"Añadir"**

> ⚠️ **Sin este paso, Vercel NO puede conectarse a tu base de datos.**
> Si Hostinger no te permite agregar `%`, intenta agregar las IPs de Vercel
> (pero cambian frecuentemente, así que `%` es la mejor opción).

### 1c. Obtener los datos de conexión

En la página de tu base de datos, anota:

| Dato | Dónde encontrarlo | Ejemplo |
|------|-------------------|---------|
| **Host** | Detalles de la BD (NO es "localhost") | `mysql.hostinger.co` o `185.XXX.XXX.XX` |
| **Puerto** | Detalles de la BD | `3306` |
| **Nombre BD** | Con el prefijo | `u123456789_lingoqueest` |
| **Usuario** | El que creaste | `u123456789_lingo_user` |
| **Contraseña** | La que creaste | `MiP4ssw0rd!` |

### 1d. Construir la URL de conexión

Formato:
```
mysql://USUARIO:CONTRASENA@HOST:PUERTO/NOMBRE_BD
```

Ejemplo:
```
mysql://u123456789_lingo_user:MiP4ssw0rd!@mysql.hostinger.co:3306/u123456789_lingoqueest
```

> ⚠️ **Codificar caracteres especiales en la contraseña:**
> Si tu contraseña tiene caracteres especiales, reemplázalos:
> - `@` → `%40`
> - `#` → `%23`
> - `/` → `%2F`
> - `!` → `%21`
> - `&` → `%26`
> - `?` → `%3F`
> - `=` → `%3D`
>
> Ejemplo: `MiP4ss@w0rd!` → `MiP4ss%40w0rd%21`

---

## PASO 2: Cambiar Prisma a MySQL ⚠️ IMPORTANTE

Antes de subir a Vercel, necesitas cambiar el proveedor de base de datos.

### 2a. Editar `prisma/schema.prisma`

Cambia la línea 6:

```prisma
// ANTES (para desarrollo local con SQLite):
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

// DESPUÉS (para Vercel + Hostinger MySQL):
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

### 2b. Cambiar el .env temporalmente

Edita tu archivo `.env` y cambia la URL a la de Hostinger:

```
DATABASE_URL=mysql://u123456789_lingo_user:MiP4ss%40w0rd%21@mysql.hostinger.co:3306/u123456789_lingoqueest
```

### 2c. Generar el cliente Prisma y crear tablas

```bash
# Generar el cliente Prisma para MySQL
bunx prisma generate

# Crear las tablas en Hostinger MySQL
bunx prisma db push
```

> ⚠️ Si `prisma db push` falla con error de conexión:
> - Verifica que agregaste `%` en "Acceso Remoto" de Hostinger
> - Verifica que el host, usuario y contraseña sean correctos
> - Prueba conectarte desde tu computadora con un cliente MySQL como DBeaver o MySQL Workbench

### 2d. Llenar la base de datos con datos iniciales

```bash
bun run db:seed
```

### 2e. Verificar en Hostinger

1. Entra a tu **hPanel** → **phpMyAdmin**
2. Selecciona tu base de datos
3. Deberías ver tablas con datos:
   - ✅ `User` — 2 usuarios (demo + admin)
   - ✅ `Level` — 3 niveles
   - ✅ `Scenario` — Escenarios
   - ✅ `Lesson` + `Question` — Lecciones y preguntas
   - ✅ `Reward` — 68 recompensas
   - ✅ `Mission` — 18 misiones

### 2f. Restaurar .env local (para seguir desarrollando con SQLite)

Si quieres volver a desarrollo local con SQLite:

1. Cambia `prisma/schema.prisma` de vuelta a `provider = "sqlite"`
2. Cambia `.env` de vuelta a `DATABASE_URL=file:/home/z/my-project/db/custom.db`
3. Ejecuta `bunx prisma generate`

> **Tip**: Puedes tener un script que cambie automáticamente. Ver sección "Script de cambio rápido" abajo.

---

## PASO 3: Subir el código a GitHub

### 3a. Asegúrate de que schema.prisma dice "mysql"

Verifica que `prisma/schema.prisma` tenga:

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

### 3b. Crear repositorio en GitHub

1. Ve a **https://github.com** y crea una cuenta (gratis)
2. Clic en **"New repository"**
3. Name: `prompt-maestro`
4. Selecciona **Private** o **Public** (tu elección)
5. **NO** marques "Add a README"
6. Clic en **"Create repository"**

### 3c. Subir el código

En tu terminal local, desde la carpeta del proyecto:

```bash
# Inicializar git (si no lo has hecho)
git init

# Agregar todos los archivos
git add .

# Primer commit
git commit -m "Prompt Maestro - Ready for Vercel + Hostinger MySQL deployment"

# Cambiar nombre de la rama a main
git branch -M main

# Conectar con tu repositorio de GitHub
git remote add origin https://github.com/TU-USUARIO/prompt-maestro.git

# Subir el código
git push -u origin main
```

> **Nota**: Si te pide autenticación, usa un Personal Access Token (PAT) de GitHub.
> Ve a GitHub → Settings → Developer settings → Personal access tokens → Generate new token

---

## PASO 4: Crear cuenta en Vercel y deployar

1. Ve a **https://vercel.com**
2. Clic en **"Sign Up"**
3. **Regístrate con GitHub** (eso conecta todo automáticamente)
4. Clic en **"Add New..."** → **"Project"**
5. Verás tu repo `prompt-maestro` — clic en **"Import"**
6. Configura el proyecto:
   - **Framework Preset**: Next.js (lo detecta automáticamente)
   - **Root Directory**: `.` (dejar por defecto)
   - **Build Command**: Dejar por defecto
   - **Output Directory**: `.next` (dejar por defecto)

7. ⚠️ **IMPORTANTE — Agregar variables de entorno**:
   - Abre la sección **"Environment Variables"**
   - Agrega:
     - **Key**: `DATABASE_URL`
     - **Value**: `mysql://u123456789_lingo_user:MiP4ss%40w0rd%21@mysql.hostinger.co:3306/u123456789_lingoqueest`
   - Clic en **"Add"**

8. Clic en **"Deploy"** 🚀
9. Espera 2-3 minutos
10. ¡Listo! Vercel te da una URL como: `https://prompt-maestro-xyz123.vercel.app`

---

## PASO 5: Verificar que todo funciona

1. Abre la URL que te dio Vercel
2. Deberías ver la pantalla de login de Prompt Maestro
3. Inicia sesión con:
   - **Email**: demo@lingoqueest.com
   - **Password**: demo123
4. Navega por la app y verifica que:
   - ✅ Los niveles y escenarios se cargan
   - ✅ Puedes hacer ejercicios
   - ✅ El progreso se guarda (refresca la página y verifica)
   - ✅ La pronunciación funciona (speed/voice)
   - ✅ La tienda funciona
   - ✅ Las misiones funcionan

---

## PASO 6: Agregar un dominio personalizado (opcional)

Si tienes un dominio propio:

1. En Vercel, ve a tu proyecto → **Settings** → **Domains**
2. Escribe tu dominio (ej: `promptmaestro.com`)
3. Clic en **"Add"**
4. Vercel te dará los registros DNS que debes configurar en Hostinger:
   - Ve a **hPanel** → **Dominios** → **DNS / Nameservers**
   - Agrega un registro **CNAME** apuntando a `cname.vercel-dns.com`
5. SSL se configura automáticamente ✅

---

## 🔄 Cómo actualizar la app en el futuro

Cada vez que hagas cambios al código:

```bash
# Asegúrate de que schema.prisma dice "mysql" antes de hacer push
git add .
git commit -m "Descripción del cambio"
git push
```

Vercel detecta el push automáticamente y redespliega en ~1-2 minutos.

### Si cambias el esquema de la base de datos:

```bash
# 1. Cambiar .env a MySQL de Hostinger
# 2. Cambiar schema.prisma a provider = "mysql"
# 3. Aplicar cambios
bunx prisma generate
bunx prisma db push

# 4. Volver a SQLite local
# Cambiar schema.prisma a provider = "sqlite" y .env a file:...
bunx prisma generate
```

---

## 🛠️ Script de cambio rápido (SQLite ↔ MySQL)

Agrega estos scripts a tu `package.json` para facilitar el cambio:

```json
{
  "scripts": {
    "db:switch:mysql": "sed -i 's/provider = \"sqlite\"/provider = \"mysql\"/' prisma/schema.prisma && bunx prisma generate",
    "db:switch:sqlite": "sed -i 's/provider = \"mysql\"/provider = \"sqlite\"/' prisma/schema.prisma && bunx prisma generate"
  }
}
```

Uso:
```bash
# Cambiar a MySQL (antes de deploy o push)
bun run db:switch:mysql

# Cambiar a SQLite (para desarrollo local)
bun run db:switch:sqlite
```

---

## 🛠️ Solución de problemas

### Error: "P1001: Can't reach database server"
- **Causa más común**: No habilitaste el acceso remoto en Hostinger
- **Solución**: Ve a hPanel → Bases de datos → Acceso Remoto → Agregar `%`
- Verifica que el host MySQL sea correcto (NO es "localhost")
- Verifica que la contraseña esté codificada (caracteres especiales → URL encoding)

### Error: "Access denied for user"
- Verifica usuario y contraseña
- Recuerda que Hostinger agrega prefijos al nombre de usuario
- Codifica caracteres especiales en la contraseña: `@` → `%40`, `!` → `%21`

### Error: "The table does not exist"
- Necesitas correr `prisma db push` apuntando a Hostinger MySQL (ver Paso 2c)
- Verifica en phpMyAdmin que las tablas existan

### Error: "Prisma Client could not be generated"
- Verifica que `prisma/schema.prisma` tenga `provider = "mysql"`
- El script `postinstall` en package.json debería generar el cliente automáticamente

### La app se ve bien pero no hay datos
- Corre el seed: `bun run db:seed` apuntando a Hostinger MySQL
- Verifica en phpMyAdmin que haya datos en las tablas

### Errores de conexión intermitentes / "Too many connections"
- Hostinger shared hosting tiene un límite de conexiones simultáneas (~25-50)
- Prisma maneja pool de conexiones automáticamente
- Si persiste, agrega estos parámetros a la URL:
  ```
  ?connection_limit=5&pool_timeout=20
  ```
- Ejemplo completo:
  ```
  mysql://user:pass@host:3306/db?connection_limit=5&pool_timeout=20
  ```

### Error: "SSL connection error"
- Agrega `?sslaccept=strict` o `?sslaccept=accept_invalid_certs` a la URL
- Ejemplo: `mysql://user:pass@host:3306/db?sslaccept=accept_invalid_certs`

### Vercel build falla
- Verifica que `prisma/schema.prisma` tenga `provider = "mysql"`
- Verifica que la variable `DATABASE_URL` esté configurada en Vercel
- Verifica que el archivo `.env` NO esté en el repositorio (debe estar en .gitignore)

### Hostinger no permite acceso remoto MySQL
- Verifica que tienes un plan Premium o Business
- Si tienes un plan Single y no aparece la opción "Acceso Remoto":
  - **Opción A**: Actualiza a Premium (~$3-6/mes)
  - **Opción B**: Usa Supabase (PostgreSQL gratis) como alternativa
  - **Opción C**: Usa un VPS de Hostinger (~$5/mes) donde tienes control total

---

## 📊 Límites del plan gratis

| Recurso | Vercel Free | Hostinger MySQL* |
|---------|------------|------------------|
| Bandwidth | 100GB/mes | Ilimitado** |
| Serverless Functions | 100K/día | — |
| Base de datos | — | Ilimitado** |
| Conexiones simultáneas | — | ~25-50 |
| Almacenamiento BD | — | Ilimitado** |
| Proyectos | Ilimitados | Ilimitados** |

*\* Incluido en tu plan de Hostinger*
*\*\* Dentro de los límites de tu plan de hosting*

---

## 🔄 Flujo de trabajo recomendado

### Desarrollo local (SQLite):
```bash
# 1. Asegúrate de usar SQLite
# prisma/schema.prisma → provider = "sqlite"
# .env → DATABASE_URL=file:/home/z/my-project/db/custom.db

# 2. Desarrolla normalmente
bun run dev
```

### Deploy a producción (Hostinger MySQL + Vercel):
```bash
# 1. Cambiar a MySQL
# Editar prisma/schema.prisma → provider = "mysql"
# (No necesitas cambiar .env local)

# 2. Commit y push
git add .
git commit -m "Nueva funcionalidad"
git push

# 3. Volver a SQLite para seguir desarrollando
# Editar prisma/schema.prisma → provider = "sqlite"
```

---

## 📋 Resumen rápido (Checklist)

- [ ] En Hostinger: Crear base de datos MySQL + usuario
- [ ] En Hostinger: Habilitar "Acceso Remoto" → agregar `%`
- [ ] En Hostinger: Anotar host, puerto, nombre BD, usuario, contraseña
- [ ] Cambiar `prisma/schema.prisma` → `provider = "mysql"`
- [ ] Cambiar `.env` → DATABASE_URL de Hostinger MySQL
- [ ] Ejecutar `bunx prisma generate`
- [ ] Ejecutar `bunx prisma db push`
- [ ] Ejecutar `bun run db:seed`
- [ ] Verificar en phpMyAdmin que las tablas y datos existen
- [ ] Crear repo en GitHub → Subir código (con schema en "mysql")
- [ ] Crear cuenta en Vercel → Importar repo
- [ ] Agregar DATABASE_URL en variables de entorno de Vercel
- [ ] Deploy → ¡Probar la app! 🎉
- [ ] Restaurar schema a "sqlite" y .env local para seguir desarrollando

---

## 🎉 ¡Felicidades!

Tu app Prompt Maestro está ahora online con:
- **Frontend/API**: Vercel (gratis, CDN global, SSL automático)
- **Base de datos**: Tu Hostinger MySQL (ya lo pagas, sin costo extra)

¡A aprender inglés! 🇬🇧📚
