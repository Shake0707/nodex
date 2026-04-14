#!/bin/bash
# Run once on the server to get the first Let's Encrypt certificate.
# After that, certbot container handles auto-renewal every 12h.
#
# Usage:
#   chmod +x init-ssl.sh
#   EMAIL=your@email.com ./init-ssl.sh

set -e

DOMAIN="nodex.uz"
EMAIL="${EMAIL:-admin@nodex.uz}"

echo "==> Creating dummy certificate so nginx can start..."
docker compose run --rm --entrypoint "sh -c \
  'mkdir -p /etc/letsencrypt/live/$DOMAIN && \
   openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
     -keyout /etc/letsencrypt/live/$DOMAIN/privkey.pem \
     -out /etc/letsencrypt/live/$DOMAIN/fullchain.pem \
     -subj \"/CN=localhost\"'" \
  certbot

echo "==> Starting nginx..."
docker compose up -d nginx

echo "==> Waiting for nginx to be ready..."
sleep 5

echo "==> Requesting Let's Encrypt certificate for $DOMAIN..."
docker compose run --rm certbot certonly \
  --webroot -w /var/www/certbot \
  -d "$DOMAIN" -d "www.$DOMAIN" \
  --email "$EMAIL" \
  --agree-tos --no-eff-email \
  --force-renewal

echo "==> Reloading nginx with real certificate..."
docker compose exec nginx nginx -s reload

echo ""
echo "SSL is ready! Now start all services:"
echo "  docker compose up -d"
