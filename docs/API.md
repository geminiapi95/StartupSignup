# API документация

## Публичные эндпоинты

### Получение количества регистраций в листе ожидания

**Запрос:**
```
GET /api/waitlist/count
```

**Ответ (успешный):**
```json
{
  "success": true,
  "count": 123
}
```

### Добавление в лист ожидания

**Запрос:**
```
POST /api/waitlist
```

**Тело запроса:**
```json
{
  "fullName": "Иван Иванов",
  "email": "ivan@example.com"
}
```

**Ответ (успешный):**
```json
{
  "success": true,
  "message": "Successfully joined the waitlist",
  "data": {
    "id": 42,
    "fullName": "Иван Иванов",
    "email": "ivan@example.com",
    "createdAt": "2025-05-16T11:30:00.000Z"
  }
}
```

**Ответ (ошибка - уже зарегистрирован):**
```json
{
  "success": false,
  "message": "Email already registered in waitlist"
}
```

**Ответ (ошибка - валидация):**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "code": "invalid_string",
      "message": "Invalid email",
      "path": ["email"]
    }
  ]
}
```

## Административные эндпоинты

### Настройка администратора

**Запрос:**
```
POST /api/admin/setup
```

**Тело запроса:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Ответ (успешный):**
```json
{
  "success": true,
  "message": "Admin user created successfully",
  "data": {
    "id": 1,
    "username": "admin"
  }
}
```

### Вход администратора

**Запрос:**
```
POST /api/admin/login
```

**Тело запроса:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Ответ (успешный):**
```json
{
  "success": true,
  "token": "jwt-token-here"
}
```

**Ответ (ошибка - неверные учетные данные):**
```json
{
  "success": false,
  "message": "Invalid username or password"
}
```

### Получение всех записей листа ожидания

**Запрос:**
```
GET /api/admin/waitlist
```

**Заголовки:**
```
Authorization: Bearer jwt-token-here
```

**Ответ (успешный):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "fullName": "Иван Иванов",
      "email": "ivan@example.com",
      "createdAt": "2025-05-16T10:00:00.000Z"
    },
    {
      "id": 2,
      "fullName": "Мария Петрова",
      "email": "maria@example.com",
      "createdAt": "2025-05-16T10:30:00.000Z"
    }
  ]
}
```

### Удаление записи из листа ожидания

**Запрос:**
```
DELETE /api/admin/waitlist/:id
```

**Заголовки:**
```
Authorization: Bearer jwt-token-here
```

**Ответ (успешный):**
```json
{
  "success": true,
  "message": "Entry deleted successfully"
}
```

**Ответ (ошибка - запись не найдена):**
```json
{
  "success": false,
  "message": "Entry not found"
}
```

## Коды состояний

- `200` - Запрос успешно выполнен
- `201` - Ресурс успешно создан
- `400` - Неверный запрос (ошибка валидации)
- `401` - Не авторизован
- `404` - Ресурс не найден
- `500` - Внутренняя ошибка сервера