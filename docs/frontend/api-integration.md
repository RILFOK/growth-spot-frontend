# Frontend — интеграция с API

## Общая схема
Frontend взаимодействует с backend через HTTP API, используя общий Axios-клиент.

Все запросы централизованы через файл `src/api/client.js`, что позволяет единообразно настраивать базовый URL, заголовки, таймауты и обработку ошибок авторизации.

## Базовый URL
Для API используется выражение:

`import.meta.env.VITE_API_URL || '/api'`

Это означает, что:
- в локальной или нестандартной среде базовый адрес можно переопределить через `VITE_API_URL`;
- по умолчанию frontend ожидает backend API по пути `/api`.

## HTTP-клиент
Основной HTTP-клиент расположен в файле:

`src/api/client.js`

### Настройки клиента
По умолчанию используются:
- `timeout: 10000`
- заголовок `Content-Type: application/json`

## Авторизация
Если в `localStorage` присутствует `token`, он автоматически добавляется в заголовок:

`Authorization: Bearer <token>`

Это позволяет не передавать токен вручную в каждом отдельном запросе.

## Поведение при ошибке авторизации
Если backend возвращает ответ со статусом `401`, frontend:
- очищает локальные данные авторизации;
- сохраняет сообщение об ошибке сессии;
- перенаправляет пользователя на страницу входа `/admin/login`.

Такое поведение реализовано через Axios interceptor.

## Используемые endpoint'ы

### Auth
- `POST /auth/login`
- `POST /auth/verify-2fa`
- `POST /auth/enable-2fa`
- `POST /auth/disable-2fa`
- `GET /auth/me`

### Leads
- `GET /leads`
- `POST /leads`
- `PATCH /leads/:id`
- `DELETE /leads/:id`

### Settings
- `GET /settings`
- `PUT /settings`
- `GET /settings/public`

### Users
- `GET /users`
- `POST /users`
- `DELETE /users/:id`
- `PUT /users/:id/password`
- `PUT /users/:id/role`
- `PUT /users/me/password`

### IP / Security
- `GET /ip-info`
- `GET /ip-whitelist`
- `POST /ip-whitelist`
- `POST /ip-whitelist/:id/disable`
- `GET /blocked-ips`
- `POST /blocked-ips/:id/unblock`

## Особенность маршрутов
Во frontend endpoint'ы указываются без префикса `/api`, так как этот префикс уже входит в базовый URL клиента.

Например:
- во frontend используется `/auth/login`;
- фактически запрос уходит на `/api/auth/login`.