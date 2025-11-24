# Sistema Bancario PSE - Backend

Sistema de pagos bancarios tipo PSE para integración con plataformas de turismo.

## 🌐 Repositorios

- **Backend (este repo)**: Sistema de autenticación, procesamiento de pagos y API REST
- **Frontend**: [Banco-PSE-Frontend](https://github.com/Quirogama/Banco-PSE-Frontend) - Interfaz de usuario Next.js 14

## 🚀 Características

- ✅ **Autenticación JWT** con tokens seguros
- ✅ **Bcrypt** para hash de contraseñas (10 rounds)
- ✅ **HTTPS/SSL** con certificados
- ✅ **NGINX** como reverse proxy
- ✅ **Nodemailer** para notificaciones por correo
- ✅ **TypeORM** con MySQL
- ✅ **Arquitectura modular** con NestJS
- ✅ **Frontend Next.js 14** completamente implementado

## 📋 Requisitos

- Node.js 18+
- MySQL 8.0+
- Docker Desktop (recomendado) o MySQL local
- NGINX (opcional, para producción)
- npm o yarn

## 🛠️ Instalación

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd Banco-PSE-Backend
```

### 2. Instalar dependencias

```bash
cd backend
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

### 4. Crear la base de datos

**Opción A: Con Docker (Recomendado)**

```bash
# Desde la raíz del proyecto
docker-compose up -d mysql

# Cargar estructura y datos
docker-compose exec -T mysql mysql -uroot -proot_password < backend/database/schema.sql
docker-compose exec -T mysql mysql -uroot -proot_password banco_pse < backend/database/datos-prueba.sql
```

**Opción B: MySQL Local**

```bash
mysql -u root -p < backend/database/schema.sql
mysql -u root -p banco_pse < backend/database/datos-prueba.sql
```

Ver más detalles en [database/README.md](backend/database/README.md)

### 5. Ejecutar el servidor

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

## 📡 API Endpoints

### Autenticación

#### POST `/auth/register`
Registrar nuevo usuario

```json
{
  "tipoDocumento": "CC",
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan@email.com",
  "contrasena": "Password123!",
  "telefono": "3001234567",
  "ocupacion": "Ingeniero"
}
```

#### POST `/auth/login`
Iniciar sesión

```json
{
  "email": "juan@email.com",
  "contrasena": "Password123!"
}
```

Respuesta:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nombre": "Juan",
    "email": "juan@email.com",
    "balance": 1000000
  }
}
```

#### GET `/auth/profile`
Obtener perfil del usuario autenticado (requiere JWT)

Headers:
```
Authorization: Bearer <token>
```

### Pagos

#### POST `/pagos/crear`
Crear un pago pendiente (desde sistema de turismo)

```json
{
  "idUsuario": 1,
  "monto": 250000,
  "descripcion": "Reserva turística - Hotel Caribe"
}
```

Respuesta:
```json
{
  "pagoId": 1,
  "redirectUrl": "/pago/1",
  "message": "Pago creado. Redirigir al usuario al banco."
}
```

#### POST `/pagos/procesar`
Procesar pago (autenticación en el banco)

```json
{
  "pagoId": 1,
  "email": "juan@email.com",
  "contrasena": "Password123!"
}
```

Respuesta:
```json
{
  "success": true,
  "message": "Pago procesado exitosamente",
  "pagoId": 1,
  "nuevoBalance": 750000
}
```

#### GET `/pagos/:id`
Obtener información de un pago

#### GET `/pagos/usuario/mis-pagos`
Obtener todos los pagos del usuario autenticado (requiere JWT)

## 🔐 Seguridad

### Contraseñas
- Hash con **bcrypt** (10 rounds)
- Nunca se almacenan en texto plano
- Nunca se retornan en las respuestas de la API

### JWT
- Tokens firmados con clave secreta
- Expiración configurable (24h por defecto)
- Almacenados en el cliente (localStorage/sessionStorage)

### HTTPS
- Todas las comunicaciones cifradas
- Certificados SSL/TLS
- Headers de seguridad configurados en NGINX

### CORS
- Configurado para aceptar solo orígenes autorizados
- Headers de seguridad adicionales

## 📧 Sistema de Correos

Cuando un pago se procesa exitosamente (estado: "pagado"), el sistema automáticamente:

1. Envía un correo al email del usuario
2. Incluye detalles del pago (monto, fecha, ID)
3. Guarda el registro en la tabla `correo`

### Configuración de Gmail

Para usar Gmail como servidor SMTP:

1. Habilitar "Verificación en dos pasos"
2. Crear una "Contraseña de aplicación"
3. Usar esa contraseña en `MAIL_PASSWORD`

## 🏗️ Arquitectura

```
Sistema de Turismo
       ↓
   [HTTPS]
       ↓
    NGINX (Reverse Proxy)
       ↓
   ┌──────┴──────┐
   ↓             ↓
Frontend      Backend (NestJS)
(Angular/      ↓
 React)    MySQL Database
```

### Flujo de Pago

1. **Sistema de Turismo** crea un pago pendiente vía API
2. **Redirección** al frontend del banco con el `pagoId`
3. **Usuario** inicia sesión en el banco
4. **Usuario** confirma el pago
5. **Backend** valida credenciales y saldo
6. **Transferencia** del monto al usuario "banco"
7. **Envío** de correo de confirmación
8. **Redirección** de vuelta al sistema de turismo

## 🐳 Docker

### Ejecutar con Docker Compose

```bash
docker-compose up -d
```

Esto levantará:
- NGINX (puertos 80, 443)
- Backend (puerto 3000)
- Frontend (puerto 4200)
- MySQL (puerto 3306)

## 👥 Usuario Banco

El sistema incluye un usuario especial llamado "banco" que recibe todos los pagos:

- **Email:** banco@pse.com
- **Contraseña:** BancoSeguro2025!
- **Rol:** banco
- **Balance inicial:** 0

⚠️ **IMPORTANTE:** Cambiar esta contraseña en producción.

## 📊 Base de Datos

### Tablas

1. **usuario** - Usuarios del sistema (clientes y banco)
2. **pago** - Transacciones de pago
3. **correo** - Registro de correos enviados

### Relaciones

- Un usuario puede tener muchos pagos
- Un pago genera muchos correos

## 🧪 Testing

### Usuarios de Prueba

Incluidos en `datos-prueba.sql`:

| Rol | Nombre | Email | Contraseña | Balance |
|-----|--------|-------|------------|---------|
| Cliente | Juan Pérez | juan.perez@email.com | password123 | $500,000 |
| Cliente | María García | maria.garcia@email.com | password123 | $750,000 |
| Cliente | Carlos Rodríguez | carlos.rodriguez@email.com | password123 | $1,000,000 |
| Cliente | Ana Martínez | ana.martinez@email.com | password123 | $300,000 |
| Administrador | Admin Sistema | admin@banco-pse.com | Admin2024! | $0 |
| Banco | Banco PSE | banco@pse.com | BancoSeguro2025! | $0 |
| Cliente | Solución Turismo | solucion.turismo@sistema.com | Turismo2024! | $0 |

### Probar con el Frontend

El frontend está completamente implementado en [Banco-PSE-Frontend](https://github.com/Quirogama/Banco-PSE-Frontend):

1. Clona el repositorio del frontend
2. Sigue las instrucciones de instalación
3. Accede a `http://localhost:3001/pago/1`
4. Usa las credenciales de prueba para autenticar

### Probar con Postman/Insomnia

1. Importar la colección de endpoints
2. Registrar un usuario o usar uno de prueba
3. Hacer login y copiar el token
4. Usar el token en el header `Authorization: Bearer <token>`

## 🌐 Integración con Sistema de Turismo

El sistema está diseñado para integrarse con plataformas de turismo externas. Ver documentación completa:

- [FLUJO-COMPLETO.md](FLUJO-COMPLETO.md) - Flujo detallado del proceso de pago
- [ESPECIFICACIONES-FRONTEND.md](ESPECIFICACIONES-FRONTEND.md) - Especificaciones técnicas
- [Frontend README](https://github.com/Quirogama/Banco-PSE-Frontend) - Documentación del frontend

### Flujo de Integración

```
Sistema Turismo → Crea pago → Redirige al banco → Usuario autentica → 
Procesa pago → Envía email → Redirige de vuelta al sistema turismo
```

## 📝 Notas de Desarrollo

### Generar Hash de Contraseña

```bash
node
> const bcrypt = require('bcrypt');
> bcrypt.hashSync('TuContraseña', 10);
```

### Variables de Entorno Importantes

- `JWT_SECRET`: Mínimo 32 caracteres
- `MAIL_USER` y `MAIL_PASSWORD`: Credenciales de Gmail
- `DB_PASSWORD`: Contraseña de MySQL

## 🚀 Stack Tecnológico Completo

### Backend (este repositorio)
- **Framework**: NestJS 11.0.1
- **Base de Datos**: MySQL 8.0 con TypeORM
- **Autenticación**: JWT + Passport + Bcrypt
- **Email**: Nodemailer
- **Proxy**: NGINX con SSL/TLS

### Frontend ([Banco-PSE-Frontend](https://github.com/Quirogama/Banco-PSE-Frontend))
- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **HTTP Client**: Axios con interceptores
- **UI**: CSS personalizado responsive
- **Puerto**: 3001

## 🚢 Despliegue en Producción

1. Configurar certificados SSL reales (Let's Encrypt)
2. Cambiar todas las contraseñas por defecto
3. Usar variables de entorno seguras
4. Configurar firewall y seguridad del servidor
5. Habilitar logs y monitoreo
6. Configurar backups automáticos de la base de datos
7. Desplegar frontend y backend en servidores separados

## 📚 Documentación Adicional

- [FLUJO-COMPLETO.md](FLUJO-COMPLETO.md) - Flujo completo del proceso de pago
- [ESPECIFICACIONES-FRONTEND.md](ESPECIFICACIONES-FRONTEND.md) - Especificaciones del frontend
- [database/README.md](backend/database/README.md) - Documentación de la base de datos
- [nginx/README.md](nginx/README.md) - Configuración de NGINX
- [Frontend Docs](https://github.com/Quirogama/Banco-PSE-Frontend) - Documentación completa del frontend

## 📞 Soporte

Para problemas o preguntas, contactar al equipo de desarrollo.

## 📄 Licencia

Privado - Todos los derechos reservados
