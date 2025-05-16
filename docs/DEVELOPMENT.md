# Руководство по разработке

Это руководство содержит детальную информацию о процессе разработки приложения, структуре проекта и лучших практиках.

## Структура проекта

```
├── client                   # Клиентская часть (фронтенд)
│   ├── src
│   │   ├── components       # Переиспользуемые компоненты
│   │   │   ├── ui           # UI компоненты (shadcn)
│   │   │   └── ...          # Бизнес-компоненты
│   │   ├── hooks            # Пользовательские React-хуки
│   │   ├── lib              # Утилиты и вспомогательные функции
│   │   ├── pages            # Страницы приложения
│   │   │   ├── admin        # Страницы административной панели
│   │   │   └── ...          # Другие страницы
│   │   ├── App.tsx          # Основной компонент, маршрутизация
│   │   ├── index.css        # Глобальные стили
│   │   └── main.tsx         # Точка входа React-приложения
│   └── index.html           # HTML-шаблон
├── server                   # Серверная часть (бэкенд)
│   ├── index.ts             # Точка входа Express-сервера
│   ├── routes.ts            # API-маршруты
│   ├── storage.ts           # Интерфейс и реализация хранилища
│   ├── vite.ts              # Интеграция с Vite
│   └── db.ts                # Конфигурация базы данных
├── shared                   # Общие ресурсы для клиента и сервера
│   └── schema.ts            # Схема базы данных и валидация
├── docs                     # Документация проекта
│   ├── README.md            # Общая документация
│   ├── API.md               # Документация по API
│   └── DEVELOPMENT.md       # Руководство по разработке
└── ...                      # Конфигурационные файлы
```

## Рабочий процесс разработки

### 1. Обновление схемы базы данных

Для изменения структуры базы данных:

1. Отредактируйте файл `shared/schema.ts`
2. Определите новые таблицы/поля/связи
3. Создайте соответствующие схемы валидации и типы
4. Запустите миграцию: `npm run db:push`

Пример добавления нового поля в таблицу:

```typescript
// shared/schema.ts
export const waitlist = pgTable("waitlist", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  // Новое поле
  phoneNumber: varchar("phone_number", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow(),
});
```

### 2. Обновление интерфейса хранилища

После изменения схемы обновите интерфейс хранилища:

```typescript
// server/storage.ts
export interface IStorage {
  // Добавьте новые методы при необходимости
  getWaitlistEntryByPhone(phone: string): Promise<Waitlist | undefined>;
}

export class DatabaseStorage implements IStorage {
  // Реализуйте новые методы
  async getWaitlistEntryByPhone(phone: string): Promise<Waitlist | undefined> {
    const [entry] = await db
      .select()
      .from(waitlist)
      .where(eq(waitlist.phoneNumber, phone));
    return entry;
  }
}
```

### 3. Обновление API-маршрутов

Добавьте новые или измените существующие API-маршруты:

```typescript
// server/routes.ts
app.get('/api/waitlist/by-phone/:phone', async (req, res) => {
  try {
    const phone = req.params.phone;
    const entry = await storage.getWaitlistEntryByPhone(phone);
    
    if (!entry) {
      return res.status(404).json({ success: false, message: 'Entry not found' });
    }
    
    return res.json({ success: true, data: entry });
  } catch (error) {
    console.error('Error fetching waitlist entry by phone:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});
```

### 4. Обновление клиентской части

#### Создание/обновление компонентов

```tsx
// client/src/components/waitlist-form.tsx
import { useState } from 'react';
import { z } from 'zod';
// ...

export function WaitlistForm() {
  // Обновите форму для работы с новыми полями
  // ...
}
```

#### Обновление запросов

```tsx
// Пример использования с React Query
const { data, isLoading } = useQuery({
  queryKey: ['/api/waitlist/by-phone', phone],
  enabled: !!phone,
});
```

## Рекомендации по стилю кода

### React-компоненты

- Используйте функциональные компоненты и хуки
- Следуйте принципу "один компонент - одна ответственность"
- Выносите повторяющуюся логику в пользовательские хуки
- Используйте мемоизацию для оптимизации рендеринга (useMemo, useCallback)

### TypeScript

- Используйте строгую типизацию
- Избегайте `any` и `unknown` типов
- Создавайте интерфейсы для props компонентов
- Используйте дженерики для повторного использования типов

### CSS и стилизация

- Используйте Tailwind CSS для стилизации компонентов
- Следуйте консистентной системе цветов и отступов
- Поддерживайте адаптивность для разных размеров экранов
- Используйте shadcn/ui компоненты вместо создания собственных

## Тестирование

### Ручное тестирование

При тестировании приложения обратите внимание на:

1. Валидацию форм
2. Адаптивность на разных устройствах
3. Обработку ошибок
4. Производительность

### Автоматизированное тестирование

Будущие улучшения могут включать:

1. Модульные тесты с использованием Jest
2. Интеграционные тесты с использованием Testing Library
3. E2E тесты с использованием Cypress

## Деплой

Приложение может быть развернуто на Replit, используя кнопку Deploy. Replit Deployments автоматически обрабатывает:

1. Сборку приложения
2. Настройку хостинга
3. Настройку TLS/SSL
4. Проверки работоспособности

## Лучшие практики

1. **Безопасность**:
   - Всегда хешируйте пароли
   - Используйте валидацию данных с Zod
   - Обрабатывайте конфиденциальные данные осторожно

2. **Производительность**:
   - Минимизируйте количество запросов к API
   - Используйте кэширование в React Query
   - Оптимизируйте размер бандла

3. **Пользовательский опыт**:
   - Показывайте состояния загрузки
   - Предоставляйте понятные сообщения об ошибках
   - Обеспечивайте доступность (a11y)

4. **Структура кода**:
   - Поддерживайте модульную архитектуру
   - Следуйте принципам SOLID
   - Документируйте сложные части кода