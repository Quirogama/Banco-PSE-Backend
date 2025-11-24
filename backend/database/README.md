# Base de Datos - Banco PSE

Este documento describe la estructura simplificada de la base de datos del sistema bancario PSE.

## 📊 Estructura de la Base de Datos

La base de datos `banco_pse` contiene 3 tablas principales:

### Tablas

1. **usuario** - Información de usuarios del sistema
   - `id` (PK)
   - `tipoDocumento` - Tipo de documento de identidad
   - `nombre` - Nombre del usuario
   - `apellido` - Apellido del usuario
   - `email` - Correo electrónico (único)
   - `contrasena` - Contraseña hasheada
   - `telefono` - Número de teléfono
   - `ocupacion` - Ocupación del usuario
   - `rol` - Rol en el sistema
   - `balance` - Balance de la cuenta

2. **pago** - Pagos realizados por usuarios
   - `id` (PK)
   - `id_usuario` (FK a usuario)
   - `fecha` - Fecha del pago
   - `monto` - Monto del pago
   - `estado` - Estado del pago

3. **correo** - Correos asociados a pagos
   - `id` (PK)
   - `id_pago` (FK a pago) - Correo del destinatario tomado del usuario
   - `asunto` - Asunto del correo
   - `cuerpo` - Cuerpo del mensaje

## 🚀 Configuración Inicial

### Opción 1: Usando Docker (Recomendado)

#### Paso 1: Inicia el contenedor MySQL

```bash
cd /ruta/al/proyecto/Banco-PSE-Backend
docker-compose up -d mysql
```

Espera unos 10 segundos a que MySQL inicie completamente.

#### Paso 2: Ejecuta los scripts SQL

```bash
# Crear la estructura de la base de datos
docker-compose exec -T mysql mysql -uroot -proot_password < backend/database/schema.sql

# Cargar los datos de prueba
docker-compose exec -T mysql mysql -uroot -proot_password banco_pse < backend/database/datos-prueba.sql
```

#### Paso 3: Verifica que todo se cargó correctamente

```bash
docker-compose exec mysql mysql -uroot -proot_password -e "USE banco_pse; SELECT id, nombre, email, rol, balance FROM usuario;"
```

Deberías ver 7 usuarios creados.

---

### Opción 2: MySQL Local (Sin Docker)

#### Paso 1: Asegúrate de que MySQL esté corriendo

```bash
# En macOS
mysql.server start

# En Linux
sudo systemctl start mysql

# En Windows
# Inicia el servicio MySQL desde Servicios
```

#### Paso 2: Ejecuta los scripts SQL

```bash
cd /ruta/al/proyecto/Banco-PSE-Backend/backend/database

# Crear la base de datos y tablas
mysql -u root -p < schema.sql

# Cargar datos de prueba
mysql -u root -p banco_pse < datos-prueba.sql
```

#### Paso 3: Verifica la instalación

```bash
mysql -u root -p -e "USE banco_pse; SELECT id, nombre, email, rol, balance FROM usuario;"
```

---

## 👥 Usuarios de Prueba

Después de ejecutar `datos-prueba.sql`, tendrás los siguientes usuarios:

### 🧑‍💼 Clientes (rol: cliente)
| Nombre | Email | Contraseña | Balance |
|--------|-------|------------|---------|
| Juan Pérez | juan.perez@email.com | password123 | $500,000 |
| María García | maria.garcia@email.com | password123 | $750,000 |
| Carlos Rodríguez | carlos.rodriguez@email.com | password123 | $1,000,000 |
| Ana Martínez | ana.martinez@email.com | password123 | $300,000 |

### 👨‍💼 Administrador (rol: administrador)
| Nombre | Email | Contraseña | Balance |
|--------|-------|------------|---------|
| Administrador Sistema | admin@banco-pse.com | Admin2024! | $0 |

### 🏦 Usuario Banco (rol: banco)
| Nombre | Email | Contraseña | Balance |
|--------|-------|------------|---------|
| Banco PSE | banco@pse.com | BancoSeguro2025! | $0 |

**Nota:** Este usuario recibe todos los pagos procesados en el sistema.

### 🏨 Sistema Turismo (rol: cliente)
| Nombre | Email | Contraseña | Balance |
|--------|-------|------------|---------|
| Solución Turismo | solucion.turismo@sistema.com | Turismo2024! | $0 |

**Nota:** Usuario para integración con el sistema de turismo externo.

---

## 🔧 Comandos Útiles

### Ver todas las tablas
```bash
# Con Docker
docker-compose exec mysql mysql -uroot -proot_password -e "USE banco_pse; SHOW TABLES;"

# MySQL local
mysql -u root -p -e "USE banco_pse; SHOW TABLES;"
```

### Ver todos los usuarios
```bash
# Con Docker
docker-compose exec mysql mysql -uroot -proot_password -e "USE banco_pse; SELECT * FROM usuario;"

# MySQL local
mysql -u root -p -e "USE banco_pse; SELECT * FROM usuario;"
```

### Ver todos los pagos
```bash
# Con Docker
docker-compose exec mysql mysql -uroot -proot_password -e "USE banco_pse; SELECT * FROM pago;"

# MySQL local
mysql -u root -p -e "USE banco_pse; SELECT * FROM pago;"
```

### Reiniciar la base de datos (borrar todo)
```bash
# Con Docker
docker-compose exec mysql mysql -uroot -proot_password -e "DROP DATABASE IF EXISTS banco_pse;"
docker-compose exec -T mysql mysql -uroot -proot_password < backend/database/schema.sql
docker-compose exec -T mysql mysql -uroot -proot_password banco_pse < backend/database/datos-prueba.sql

# MySQL local
mysql -u root -p -e "DROP DATABASE IF EXISTS banco_pse;"
mysql -u root -p < schema.sql
mysql -u root -p banco_pse < datos-prueba.sql
```

---

## 🔐 Información de Seguridad

### Credenciales de Docker MySQL
- **Usuario**: root
- **Contraseña**: root_password
- **Puerto**: 3306
- **Base de datos**: banco_pse

⚠️ **IMPORTANTE**: Estas credenciales son solo para desarrollo local. Cambiar en producción.

### Contraseñas Hasheadas

Todas las contraseñas en la base de datos están hasheadas con bcrypt (10 rounds).

Para generar una nueva contraseña hasheada:

```bash
cd backend
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('TuContraseña', 10, (err, hash) => console.log(hash));"
```

---

## 📝 Notas Adicionales

- Los datos de prueba son **locales** a tu máquina. No se sincronizan con otros desarrolladores.
- Si modificas `datos-prueba.sql` y haces commit, otros desarrolladores podrán ejecutar el script actualizado.
- El volumen de Docker `mysql-data` persiste los datos entre reinicios del contenedor.
- Para empezar de cero, elimina el volumen: `docker-compose down -v`

## 🔗 Relacionados

- [README Principal](../../README.md)
- [Flujo Completo del Sistema](../../FLUJO-COMPLETO.md)
- [Especificaciones Frontend](../../ESPECIFICACIONES-FRONTEND.md)
