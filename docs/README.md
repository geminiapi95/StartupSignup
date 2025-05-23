# Проектная документация

## Обзор проекта

Этот проект представляет собой современный лендинг-сайт с функцией регистрации в листе ожидания для стартапа. Посетители могут оставлять свои электронные адреса и имена для получения раннего доступа к продукту или услуге. Проект использует современные веб-технологии и включает панель администратора для управления собранными данными.

## Технический стек

- **Фронтенд**: React, Vite, Tailwind CSS, Shadcn UI
- **Бэкенд**: Node.js, Express
- **База данных**: PostgreSQL
- **ORM**: Drizzle ORM
- **Валидация**: Zod
- **Клиентская маршрутизация**: Wouter
- **Управление запросами**: TanStack Query (React Query)

## Архитектура

Проект следует современной архитектуре веб-приложений с разделением на серверную и клиентскую части:

### Серверная часть (Backend)

- `server/index.ts` - Точка входа сервера Express
- `server/routes.ts` - Маршруты API
- `server/storage.ts` - Интерфейс хранилища и реализация хранилища с использованием базы данных
- `server/db.ts` - Конфигурация и подключение к базе данных
- `server/vite.ts` - Интеграция с Vite для разработки

### Клиентская часть (Frontend)

- `client/src/main.tsx` - Точка входа React приложения
- `client/src/App.tsx` - Основной компонент приложения, маршрутизация
- `client/src/pages/` - Страницы приложения
- `client/src/components/` - Переиспользуемые компоненты
- `client/src/hooks/` - Пользовательские хуки
- `client/src/lib/` - Утилиты и конфигурация

### Общие ресурсы (Shared)

- `shared/schema.ts` - Описание схемы базы данных, типы данных и валидационные схемы

## Схема базы данных

### Таблица `users`

- `id` - Уникальный идентификатор пользователя (Primary Key)
- `username` - Имя пользователя
- `password` - Хешированный пароль
- `is_admin` - Флаг администратора

### Таблица `waitlist`

- `id` - Уникальный идентификатор записи (Primary Key)
- `fullName` - Полное имя пользователя
- `email` - Электронный адрес
- `createdAt` - Дата и время создания записи

## API Endpoints

### Публичные API

- `GET /api/waitlist/count` - Получение количества записей в листе ожидания
- `POST /api/waitlist` - Добавление новой записи в лист ожидания

### Административные API (требуют аутентификации)

- `POST /api/admin/setup` - Первоначальная настройка аккаунта администратора
- `POST /api/admin/login` - Вход администратора
- `GET /api/admin/waitlist` - Получение всех записей из листа ожидания
- `DELETE /api/admin/waitlist/:id` - Удаление записи из листа ожидания

## Страницы приложения

### Публичные страницы

- **Главная страница** (`/`) - Лендинг с секциями:
  - Hero секция с формой листа ожидания
  - Features - описание возможностей
  - About - информация о компании/продукте
  - FAQ - часто задаваемые вопросы
  - Testimonials - отзывы пользователей

### Административные страницы

- **Страница входа** (`/admin`) - Вход в административную панель
- **Дашборд** (`/admin/dashboard`) - Просмотр и управление данными листа ожидания

## Аутентификация и авторизация

Проект использует простую аутентификацию на основе логина и пароля для административных функций:

1. Администратор входит через форму на `/admin`
2. При успешной аутентификации сервер выдает токен сессии
3. Токен используется для всех последующих административных запросов
4. Middleware на сервере проверяет валидность токена

## Учетные данные по умолчанию

- **Имя пользователя**: admin
- **Пароль**: admin123

## Процесс разработки

### Установка и запуск

1. Клонировать репозиторий
2. Установить зависимости: `npm install`
3. Создать .env файл с переменными окружения
4. Запустить проект: `npm run dev`

### Переменные окружения

- `DATABASE_URL` - URL для подключения к PostgreSQL базе данных
- `SESSION_SECRET` - Секретный ключ для сессий
- `NODE_ENV` - Окружение (development/production)

## Рабочие процессы

Проект использует настроенный рабочий процесс Replit, который запускает команду `npm run dev` для запуска как серверной, так и клиентской части приложения.

## Будущие улучшения

1. Подтверждение email через отправку писем
2. Расширенная аналитика в панели администратора
3. Интеграция с сервисами рассылки новостей
4. Улучшенная безопасность (2FA, аудит доступа)
5. Экспорт данных в различные форматы