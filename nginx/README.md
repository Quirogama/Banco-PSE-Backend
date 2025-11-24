# Guía de Instalación y Configuración de NGINX

## Instalación de NGINX

### En Ubuntu/Debian:
```bash
sudo apt update
sudo apt install nginx
```

### En macOS:
```bash
brew install nginx
```

### En CentOS/RHEL:
```bash
sudo yum install nginx
```

## Configuración

### 1. Copiar el archivo de configuración:
```bash
sudo cp nginx/banco-pse.conf /etc/nginx/sites-available/banco-pse
sudo ln -s /etc/nginx/sites-available/banco-pse /etc/nginx/sites-enabled/
```

### 2. Generar certificados SSL (desarrollo):
```bash
chmod +x nginx/generate-ssl.sh
./nginx/generate-ssl.sh
```

### 3. Verificar configuración:
```bash
sudo nginx -t
```

### 4. Reiniciar NGINX:
```bash
sudo systemctl restart nginx
# O en macOS:
# brew services restart nginx
```

### 5. Agregar entrada en /etc/hosts (para desarrollo local):
```bash
echo "127.0.0.1 banco-pse.local" | sudo tee -a /etc/hosts
```

## Uso con Docker

Si prefieres usar Docker, ejecuta:

```bash
docker-compose up -d
```

Esto levantará todos los servicios (NGINX, Backend, Frontend, MySQL) automáticamente.

## Verificación

Accede a: https://banco-pse.local

- Frontend: https://banco-pse.local
- API: https://banco-pse.local/api

## Producción

Para producción, reemplaza los certificados autofirmados por certificados válidos de Let's Encrypt:

```bash
sudo certbot --nginx -d tudominio.com -d www.tudominio.com
```

## Logs

- Access log: `/var/log/nginx/banco-pse-access.log`
- Error log: `/var/log/nginx/banco-pse-error.log`
