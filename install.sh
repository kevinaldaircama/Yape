#!/bin/bash

SCRIPT="/usr/local/bin/yape"

function banner() {
clear
echo "==============================================="
echo "     INSTALADOR PROFESIONAL - YAPE PANEL       "
echo "==============================================="
}

function ip() {
  curl -s ifconfig.me
}

function verificar_dns() {
  DOM=$1
  MIIP=$(ip)
  DNS=$(dig +short $DOM | tail -n1)

  if [[ "$DNS" == "$MIIP" ]]; then
    return 0
  else
    echo ""
    echo "❌ El dominio NO apunta a este servidor"
    echo "Tu IP es: $MIIP"
    echo "El dominio apunta a: $DNS"
    echo ""
    echo "Debes crear un registro A:"
    echo "Host: $DOM"
    echo "Tipo: A"
    echo "Valor: $MIIP"
    exit 1
  fi
}

function instalar() {
banner

echo "Instalando paquetes..."
apt update -y
apt install nginx git certbot python3-certbot-nginx dnsutils -y

mkdir -p /var/www/html

cat > /etc/nginx/sites-available/default <<EOF
server {
    listen 80;
    server_name _;
    root /var/www/html;
    index index.html index.htm;

    location / {
        try_files \$uri \$uri.html \$uri/ /index.html;
    }
}
EOF

systemctl restart nginx

MIIP=$(ip)

echo ""
echo "==============================================="
echo " Archivos instalados exitosamente"
echo " Accede desde:"
echo " 👉 http://$MIIP"
echo "==============================================="
}

function puerto() {
banner
read -p "Nuevo puerto: " P

sed -i "s/listen .*/listen $P;/" /etc/nginx/sites-available/default

systemctl restart nginx

MIIP=$(ip)

echo "Puerto cambiado"
echo "Nueva URL: http://$MIIP:$P"
}

function dominio() {
banner
read -p "Ingresa tu dominio o subdominio: " DOM

verificar_dns $DOM

sed -i "s/server_name .*/server_name $DOM;/" /etc/nginx/sites-available/default

systemctl restart nginx

certbot --nginx -d $DOM --non-interactive --agree-tos -m admin@$DOM

echo ""
echo "==============================================="
echo " SSL instalado correctamente"
echo " URL final:"
echo " 👉 https://$DOM"
echo "==============================================="
}

function desinstalar() {
banner
echo "Eliminando todo..."

apt purge nginx certbot python3-certbot-nginx -y
rm -rf /etc/nginx
rm -rf /var/www/html
rm -f $SCRIPT
sed -i '/yape/d' ~/.bashrc

echo "Sistema desinstalado correctamente"
echo "El menú ya no volverá a aparecer"
}

function instalar_menu() {
cp $0 $SCRIPT
chmod +x $SCRIPT
echo "alias menu='$SCRIPT'" >> ~/.bashrc
source ~/.bashrc
}

function menu() {
banner
echo "1. Instalar servidor web"
echo "2. Cambiar puerto"
echo "3. Configurar dominio + SSL"
echo "4. Desinstalar sistema"
echo "5. Salir"
echo ""
read -p "Opción: " op

case $op in
1) instalar ;;
2) puerto ;;
3) dominio ;;
4) desinstalar ;;
5) exit ;;
*) echo "Opción inválida" ;;
esac
}

instalar_menu
menu
