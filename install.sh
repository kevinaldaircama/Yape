#!/bin/bash

SCRIPT="/usr/local/bin/yape"
AUTO_MENU="/etc/profile.d/yape_auto.sh"

function banner() {
clear
echo "===================================================="
echo "        PANEL PROFESIONAL - YAPE SERVER PRO         "
echo "===================================================="
}

function ip_publica() {
  curl -s ifconfig.me
}

function verificar_dns() {
  DOM=$1
  IP=$(ip_publica)
  DNS=$(dig +short $DOM | tail -n1)

  if [[ "$DNS" == "$IP" ]]; then
    return 0
  else
    echo ""
    echo "❌ ERROR: El dominio NO apunta a este servidor"
    echo "Tu IP actual: $IP"
    echo "El dominio apunta a: $DNS"
    echo ""
    echo "CONFIGURACIÓN CORRECTA:"
    echo "Tipo: A"
    echo "Host: $DOM"
    echo "Valor: $IP"
    echo ""
    echo "Corrige el DNS e intenta de nuevo"
    exit 1
  fi
}

function mensaje_instalado() {
  IP=$(ip_publica)

  PUERTO=$(grep "listen" /etc/nginx/sites-available/default | awk '{print $2}' | tr -d ';')

  echo ""
  echo "===================================================="
  echo "   ARCHIVOS INSTALADOS EXITOSAMENTE"
  echo "===================================================="

  if [[ "$PUERTO" == "80" ]]; then
     echo "URL: http://$IP"
  else
     echo "URL: http://$IP:$PUERTO"
  fi

  echo "Para abrir el panel escribe: menu"
  echo "===================================================="
}

function instalar_servidor() {
banner

echo "Instalando servicios..."

apt update -y
apt install nginx git certbot python3-certbot-nginx dnsutils curl -y

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

mensaje_instalado
}

function cambiar_puerto() {
banner

read -p "Nuevo puerto: " PORT

sed -i "s/listen .*/listen $PORT;/" /etc/nginx/sites-available/default

systemctl restart nginx

IP=$(ip_publica)

echo ""
echo "Puerto cambiado correctamente"
echo "Nueva URL: http://$IP:$PORT"
}

function instalar_dominio() {
banner

read -p "Ingresa tu dominio o subdominio: " DOMINIO

verificar_dns $DOMINIO

sed -i "s/server_name .*/server_name $DOMINIO;/" /etc/nginx/sites-available/default

systemctl restart nginx

certbot --nginx -d $DOMINIO --non-interactive --agree-tos -m admin@$DOMINIO

echo ""
echo "==========================================="
echo " SSL INSTALADO CORRECTAMENTE"
echo " Accede desde:"
echo " 👉 https://$DOMINIO"
echo "==========================================="
}

function desinstalar() {
banner

echo "Desinstalando sistema..."

apt purge nginx certbot python3-certbot-nginx -y
rm -rf /etc/nginx
rm -rf /var/www/html
rm -f $SCRIPT
rm -f $AUTO_MENU

sed -i '/alias menu/d' ~/.bashrc

echo ""
echo "======================================"
echo " Sistema desinstalado correctamente"
echo " El menú ya NO volverá a aparecer"
echo "======================================"

exit 0
}

function auto_script() {
echo "bash $SCRIPT" > $AUTO_MENU
chmod +x $AUTO_MENU

echo "Auto inicio activado"
echo "Cada vez que entres al servidor se abrirá el panel"
}

function instalar_menu() {
cp $0 $SCRIPT
chmod +x $SCRIPT

if ! grep -q "alias menu" ~/.bashrc; then
  echo "alias menu='$SCRIPT'" >> ~/.bashrc
fi

source ~/.bashrc
}

function menu() {
banner

echo "1. Instalar servidor web"
echo "2. Cambiar puerto"
echo "3. Configurar dominio + SSL"
echo "4. Activar auto script"
echo "5. Desinstalar sistema"
echo "6. Salir"
echo ""
read -p "Selecciona una opción: " op

case $op in
1) instalar_servidor ;;
2) cambiar_puerto ;;
3) instalar_dominio ;;
4) auto_script ;;
5) desinstalar ;;
6) exit ;;
*) echo "Opción inválida" ;;
esac
}

instalar_menu
menu
