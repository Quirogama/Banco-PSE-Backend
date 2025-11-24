# Instrucciones para generar certificados SSL autofirmados (desarrollo)
# NO usar en producción - obtener certificados válidos de Let's Encrypt

# Crear directorio para certificados
mkdir -p nginx/ssl

# Generar certificado autofirmado
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/banco-pse.key \
  -out nginx/ssl/banco-pse.crt \
  -subj "/C=CO/ST=State/L=City/O=Banco PSE/CN=banco-pse.local"

# Para producción, usar Let's Encrypt:
# sudo certbot --nginx -d banco-pse.com -d www.banco-pse.com
