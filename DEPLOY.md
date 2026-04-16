# Nodex — Инструкция по деплою на VPS

> Стек: Docker Compose · Nginx · Let's Encrypt SSL · Neon PostgreSQL

---

## Требования к серверу

| Параметр | Минимум |
|----------|---------|
| ОС | Ubuntu 22.04 LTS |
| RAM | 1 GB |
| CPU | 1 vCPU |
| Диск | 20 GB |
| Открытые порты | 22 (SSH), 80 (HTTP), 443 (HTTPS) |

---

## Шаг 1 — Установка Docker

Подключись к серверу по SSH и выполни:

```bash
# Обновить пакеты
sudo apt update && sudo apt upgrade -y

# Установить Docker
curl -fsSL https://get.docker.com | sh

# Добавить своего пользователя в группу docker (чтобы не писать sudo)
sudo usermod -aG docker $USER

# Применить группу без перелогина
newgrp docker

# Проверить что Docker работает
docker --version
docker compose version
```

---

## Шаг 2 — Клонировать репозиторий

```bash
cd /opt
git clone https://github.com/shake0707/nodex.git
cd nodex
```

---

## Шаг 3 — Создать файл окружения

```bash
cp .env.production.example .env
nano .env
```

Заполни все значения:

```env
# Строку подключения берёшь из Neon Dashboard → вкладка Connection string
DATABASE_URL=postgresql://neondb_owner:ПАРОЛЬ@ep-xxx.neon.tech/neondb?sslmode=require

# Случайная строка минимум 32 символа (можно сгенерировать: openssl rand -hex 32)
SESSION_SECRET=сюда_вставь_случайную_строку

# Домен сайта
CORS_ORIGIN=https://nodex.uz

# URL API — оставь как есть если домен nodex.uz
NEXT_PUBLIC_API_URL=https://nodex.uz/api
NEXT_PUBLIC_SITE_URL=https://nodex.uz
```

Сохрани: `Ctrl+O` → Enter → `Ctrl+X`

---

## Шаг 4 — Получить SSL-сертификат

> Этот шаг нужно сделать **до** запуска всего стека — nginx не стартует без сертификата.

### 4.1 — Временно отключить HTTPS-блок в nginx

```bash
nano nginx/nginx.conf
```

Найди строку `# ─── HTTPS ───` и **закомментируй весь блок** ниже неё — от `server {` до последнего `}`:

```nginx
# server {
#     listen 443 ssl;
#     ... весь блок ...
# }
```

Сохрани файл.

### 4.2 — Запустить только nginx (на HTTP)

```bash
docker compose up -d nginx
```

### 4.3 — Получить сертификат через certbot

```bash
docker compose run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email admin@nodex.uz \
  --agree-tos \
  --no-eff-email \
  -d nodex.uz \
  -d www.nodex.uz
```

Должно появиться: `Successfully received certificate.`

### 4.4 — Вернуть HTTPS-блок в nginx

```bash
nano nginx/nginx.conf
```

Раскомментируй весь HTTPS-блок обратно (убери `#` перед каждой строкой).

### 4.5 — Перезапустить nginx

```bash
docker compose restart nginx
```

---

## Шаг 5 — Запустить весь стек

```bash
docker compose up -d --build
```

Это займёт 3–5 минут при первом запуске (сборка образов).

Проверить статус:

```bash
docker compose ps
```

Все сервисы должны быть в статусе `Up`:

```
NAME       STATUS
api        Up
web        Up
nginx      Up
certbot    Up
```

Посмотреть логи если что-то не так:

```bash
# Все сервисы
docker compose logs -f

# Конкретный сервис
docker compose logs -f api
docker compose logs -f web
```

---

## Шаг 6 — Создать администратора

```bash
docker compose exec api sh -c "ADMIN_USERNAME=admin ADMIN_PASSWORD=ВАШ_ПАРОЛЬ ./node_modules/.bin/tsx prisma/seed.ts"
```

> Замени `ВАШ_ПАРОЛЬ` на надёжный пароль. Запомни его — это вход в /admin панель.

Если всё прошло успешно увидишь:
```
✅ Admin yaratildi: admin (id: 1)
```

---

## Шаг 7 — Проверка

Открой в браузере:

| URL | Что должно быть |
|-----|-----------------|
| `https://nodex.uz` | Главная страница сайта |
| `https://nodex.uz/api` | `{"message":"Cannot GET /api"}` (это нормально) |
| `https://nodex.uz/admin` | Страница входа в админку |

---

## Обновление сайта

Когда вышли новые изменения — на сервере:

```bash
cd /opt/nodex
git pull
docker compose up -d --build
```

---

## Полезные команды

```bash
# Остановить всё
docker compose down

# Перезапустить один сервис
docker compose restart api

# Посмотреть логи в реальном времени
docker compose logs -f api

# Зайти внутрь контейнера
docker compose exec api sh

# Проверить занятое место
docker system df
```

---

## Возможные проблемы

### Сайт не открывается по домену
- Убедись что DNS запись `A` для `nodex.uz` указывает на IP сервера
- Проверь что порты 80 и 443 открыты: `sudo ufw allow 80 && sudo ufw allow 443`

### Ошибка при получении SSL-сертификата
- Убедись что домен уже смотрит на IP сервера (DNS propagation может занять до 24ч)
- Проверь что nginx запущен: `docker compose ps nginx`

### API не отвечает
- Проверь `.env` — особенно `DATABASE_URL`
- Посмотри логи: `docker compose logs api`

### Контейнер api падает сразу после старта
- Скорее всего неверный `DATABASE_URL` — проверь строку подключения в Neon Dashboard
