# Dashboard API Endpoints

Документация API эндпойнтов для дашборда IntegrityOS.

## Базовый URL

```
/api/dashboard
```

---

## 1. Статистика дашборда

Получить общую статистику для дашборда.

### Endpoint

```
GET /api/dashboard/stats
```

### Описание

Возвращает основные метрики системы:
- Общее количество объектов
- Общее количество обследований
- Количество найденных дефектов
- Количество критических проблем

### Response

**Status Code:** `200 OK`

```json
{
  "totalObjects": 1247,
  "totalInspections": 3421,
  "defectsFound": 89,
  "criticalIssues": 12
}
```

### Пример запроса

```javascript
const response = await fetch('/api/dashboard/stats');
const data = await response.json();
```

### Ошибки

**Status Code:** `500 Internal Server Error`

```json
{
  "error": "Failed to fetch dashboard statistics"
}
```

---

## 2. Распределение по методам

Получить распределение дефектов по методам контроля.

### Endpoint

```
GET /api/dashboard/methods-distribution
```

### Описание

Возвращает статистику по каждому методу контроля с количеством и процентом.

### Response

**Status Code:** `200 OK`

```json
[
  {
    "method": "VIK",
    "count": 450,
    "percentage": 32
  },
  {
    "method": "PVK",
    "count": 380,
    "percentage": 27
  },
  {
    "method": "MPK",
    "count": 290,
    "percentage": 21
  },
  {
    "method": "UZK",
    "count": 180,
    "percentage": 13
  },
  {
    "method": "RGK",
    "count": 120,
    "percentage": 8
  }
]
```

### Пример запроса

```javascript
const response = await fetch('/api/dashboard/methods-distribution');
const data = await response.json();
```

### Ошибки

**Status Code:** `500 Internal Server Error`

```json
{
  "error": "Failed to fetch methods distribution"
}
```

---

## 3. Распределение по критичности

Получить распределение объектов по уровню критичности.

### Endpoint

```
GET /api/dashboard/criticality-distribution
```

### Описание

Возвращает количество объектов в каждой категории критичности с цветом для визуализации.

### Response

**Status Code:** `200 OK`

```json
[
  {
    "label": "Норма",
    "count": 856,
    "color": "#28ca42"
  },
  {
    "label": "Средняя",
    "count": 302,
    "color": "#ffbd2e"
  },
  {
    "label": "Высокая",
    "count": 89,
    "color": "#dc2626"
  }
]
```

### Пример запроса

```javascript
const response = await fetch('/api/dashboard/criticality-distribution');
const data = await response.json();
```

### Ошибки

**Status Code:** `500 Internal Server Error`

```json
{
  "error": "Failed to fetch criticality distribution"
}
```

---

## 4. Последние обследования

Получить список последних обследований.

### Endpoint

```
GET /api/dashboard/recent-inspections
```

### Описание

Возвращает список последних обследований с информацией об объекте, методе, дате и наличии дефектов.

### Query Parameters

| Параметр | Тип | Обязательный | По умолчанию | Описание |
|----------|-----|--------------|--------------|----------|
| `limit` | number | Нет | 5 | Количество записей для возврата |

### Response

**Status Code:** `200 OK`

```json
[
  {
    "id": 1,
    "objectName": "Кран подвесной",
    "method": "VIK",
    "date": "2024-01-20",
    "defectFound": true,
    "criticality": "medium"
  },
  {
    "id": 2,
    "objectName": "Турбокомпрессор ТВ-80-1",
    "method": "PVK",
    "date": "2024-01-19",
    "defectFound": false,
    "criticality": "normal"
  },
  {
    "id": 3,
    "objectName": "Участок трубы №45",
    "method": "MPK",
    "date": "2024-01-18",
    "defectFound": true,
    "criticality": "high"
  }
]
```

### Пример запроса

```javascript
// Получить последние 5 обследований
const response = await fetch('/api/dashboard/recent-inspections');
const data = await response.json();

// Получить последние 10 обследований
const response2 = await fetch('/api/dashboard/recent-inspections?limit=10');
const data2 = await response2.json();
```

### Ошибки

**Status Code:** `500 Internal Server Error`

```json
{
  "error": "Failed to fetch recent inspections"
}
```

---

## Типы данных

### DashboardStats

```typescript
interface DashboardStats {
  totalObjects: number;      // Общее количество объектов
  totalInspections: number;   // Общее количество обследований
  defectsFound: number;       // Количество найденных дефектов
  criticalIssues: number;      // Количество критических проблем
}
```

### MethodDistribution

```typescript
interface MethodDistribution {
  method: string;        // Код метода (VIK, PVK, MPK, и т.д.)
  count: number;         // Количество дефектов
  percentage: number;    // Процент от общего количества
}
```

### CriticalityDistribution

```typescript
interface CriticalityDistribution {
  label: string;    // Название категории (Норма, Средняя, Высокая)
  count: number;    // Количество объектов
  color: string;    // HEX цвет для визуализации
}
```

### RecentInspection

```typescript
interface RecentInspection {
  id: number;                    // ID обследования
  objectName: string;            // Название объекта
  method: string;                // Метод контроля
  date: string;                  // Дата в формате YYYY-MM-DD
  defectFound: boolean;          // Найден ли дефект
  criticality: 'normal' | 'medium' | 'high';  // Уровень критичности
}
```

---

## Интеграция с БД

Все эндпойнты в настоящее время возвращают mock данные. Для интеграции с реальной БД необходимо:

1. Заменить mock данные на реальные запросы к БД в каждом route файле
2. Добавить обработку ошибок БД
3. Добавить валидацию входных параметров
4. Добавить кэширование при необходимости
5. Добавить пагинацию для больших наборов данных

### Пример интеграции

```typescript
// app/api/dashboard/stats/route.ts
import { db } from '@/lib/db';

export async function GET() {
  try {
    const stats = await db.getDashboardStats();
    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}
```

---

## Примечания

- Все даты возвращаются в формате ISO 8601 (YYYY-MM-DD)
- Все числовые значения возвращаются как числа, не строки
- Все эндпойнты поддерживают только GET запросы
- В будущем могут быть добавлены фильтры по датам, магистралям и другим параметрам

