# Уведомления API

- **OpenAPI Version:** `3.1.1`
- **API Version:** `0.0.0`

REST API для push-уведомлений

## Operations

### Вход в систему

- **Method:** `POST`
- **Path:** `/auth/login`

Аутентификация пользователя по логину и паролю с выдачей JWT-токена.

#### Request Body

##### Content-Type: application/json

- **`password` (required)**

  `string` — Пароль пользователя

- **`username` (required)**

  `string` — Имя пользователя

**Example:**

```json
{
  "username": "Kira",
  "password": "12345678"
}
```

#### Responses

##### Status: 200 Сессия пользователя

###### Content-Type: application/json

- **`token` (required)**

  `string`, format: `jwt` — JWT-токен для аутентификации последующих запросов

**Example:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30"
}
```

##### Status: 400 Стандартный объект ошибки

###### Content-Type: application/json

- **`code` (required)**

  `number`, possible values: `400, 401` — HTTP-статус ответа (код)

- **`message` (required)**

  `string` — Понятное сообщение об ошибке, которое можно сразу показать пользователю в интерфейсе

**Example:**

```json
{
  "message": "Неверные данные для входа",
  "code": 400
}
```

### Установать Firebase-токен пользователя

- **Method:** `POST`
- **Path:** `/auth/setFirebaseToken`

Установать Firebase-токен пользователя для последующего использования при отправки уведомлений сервером. (требует авторизации)

#### Request Body

##### Content-Type: application/json

- **`firebaseToken` (required)**

  `string` — Firebase-токен пользователя

**Example:**

```json
{
  "firebaseToken": "0000000000000000_00000:00000000000000000000-0000000000000000000000000000000000000000000000000000_000000000000000000000000000-00000000000000000"
}
```

##### Content-Type: application/x-www-form-urlencoded

- **`firebaseToken` (required)**

  `string` — Firebase-токен пользователя

**Example:**

```json
{
  "firebaseToken": "0000000000000000_00000:00000000000000000000-0000000000000000000000000000000000000000000000000000_000000000000000000000000000-00000000000000000"
}
```

##### Content-Type: multipart/form-data

- **`firebaseToken` (required)**

  `string` — Firebase-токен пользователя

**Example:**

```json
{
  "firebaseToken": "0000000000000000_00000:00000000000000000000-0000000000000000000000000000000000000000000000000000_000000000000000000000000000-00000000000000000"
}
```

#### Responses

##### Status: 204 Response for status 204

###### Content-Type: type

##### Status: 401 Стандартный объект ошибки

###### Content-Type: application/json

- **`code` (required)**

  `number`, possible values: `400, 401` — HTTP-статус ответа (код)

- **`message` (required)**

  `string` — Понятное сообщение об ошибке, которое можно сразу показать пользователю в интерфейсе

**Example:**

```json
{
  "message": "Неверные данные для входа",
  "code": 400
}
```

### Получить уведомления

- **Method:** `GET`
- **Path:** `/notifications`

Запрос списка последних непрочитанных уведомлений текущего пользователя. (требует авторизации)

#### Responses

##### Status: 200 Список новых уведомлений

###### Content-Type: application/json

**Array of:**

- **`date` (required)**

  `string`, format: `date-time` — Дата и время создания уведомления в формате ISO 8601

- **`priority` (required)**

  `string`, possible values: `"low", "medium", "high", "critical"`, default: `"medium"` — Приоритет важности уведомления

- **`text` (required)**

  `string` — Текстовое содержание уведомления

- **`icon`**

  `string`, format: `uri` — Ссылка на иконку уведомления (опционально)

- **`title`**

  `string` — Заголовок уведомления (опционально)

**Example:**

```json
[
  {
    "date": "2006-10-04T12:00:00.000Z",
    "title": "Сообщение от L",
    "icon": "https://example.com/icon.png",
    "priority": "medium",
    "text": "Приходи в офис в 6 вечера"
  }
]
```

##### Status: 401 Стандартный объект ошибки

###### Content-Type: application/json

- **`code` (required)**

  `number`, possible values: `400, 401` — HTTP-статус ответа (код)

- **`message` (required)**

  `string` — Понятное сообщение об ошибке, которое можно сразу показать пользователю в интерфейсе

**Example:**

```json
{
  "message": "Неверные данные для входа",
  "code": 400
}
```

## Schemas

### error

- **Type:**`object`

Стандартный объект ошибки

- **`code` (required)**

  `number`, possible values: `400, 401` — HTTP-статус ответа (код)

- **`message` (required)**

  `string` — Понятное сообщение об ошибке, которое можно сразу показать пользователю в интерфейсе

**Example:**

```json
{
  "message": "Неверные данные для входа",
  "code": 400
}
```
