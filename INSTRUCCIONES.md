# Instrucciones para el Banco-PSE-Backend

## Archivos principales

- **backend/database/schema.sql**: Script de creación de la base de datos y tablas. Define la estructura (usuarios, pagos, correos).
- **backend/database/datos-prueba.sql**: Script de carga de datos de ejemplo para desarrollo y pruebas. Inserta usuarios, pagos y limpia las tablas.

## Cómo correr la base de datos

1. Asegúrate de estar en la raíz del proyecto:
   ```sh
   cd "/Users/richie/Documents/Arquitectura de Software/Banco-PSE-Backend"
   ```
2. Ejecuta el contenedor de MySQL con Docker Compose:
   ```sh
   docker-compose up -d mysql
   ```

## Cómo reiniciar y cargar los cambios en la base de datos

1. Recarga el esquema (estructura):
   ```sh
   docker-compose exec -T mysql mysql -uroot -proot_password banco_pse < backend/database/schema.sql
   ```
2. Recarga los datos de prueba:
   ```sh
   docker-compose exec -T mysql mysql -uroot -proot_password banco_pse < backend/database/datos-prueba.sql
   ```

> **Nota:** Ejecuta estos comandos cada vez que modifiques `schema.sql` o `datos-prueba.sql` para aplicar los cambios en la base de datos.

## Cómo correr el backend

1. Ve a la carpeta del backend:
   ```sh
   cd backend
   ```
2. Instala dependencias (solo la primera vez o si hay cambios en `package.json`):
   ```sh
   npm install
   ```
3. Compila el proyecto:
   ```sh
   npm run build
   ```
4. Inicia el backend en modo desarrollo:
   ```sh
   npm run start:dev
   ```

El backend estará disponible en: http://localhost:3000/api

---

**Resumen:**
- Modifica los scripts en `backend/database/` según lo que necesites.
- Recarga la base de datos con los comandos indicados.
- Compila e inicia el backend para aplicar los cambios.
