# IntegrityOS API Endpoints Documentation

Полная документация всех API эндпоинтов фронтенда и бэкенда.

## Содержание

1. [Frontend API Routes (Next.js)](#frontend-api-routes-nextjs)
2. [Backend API Endpoints (FastAPI)](#backend-api-endpoints-fastapi)
3. [Типы данных](#типы-данных)
4. [Обработка ошибок](#обработка-ошибок)

---

## Frontend API Routes (Next.js)

Все фронтенд API routes находятся в `/app/api/` и проксируют запросы к бэкенду.

### Dashboard API

#### GET `/api/dashboard/stats`

Получить статистику для дашборда.

**Ответ:**
```json
{
  "totalObjects": 1247,
  "totalInspections": 3421,
  "defectsFound": 89,
  "criticalIssues": 12,
  "activeDefects": 547,
  "highRisk": 62,
  "repairsPerYear": 14
}
```

**Backend:** `/statistics`

---

#### GET `/api/dashboard/defects`

Получить список дефектов для дашборда.

**Параметры запроса:**
- `pipeline` (optional): Фильтр по магистрали
- `status` (optional): Фильтр по статусу
- `method` (optional): Фильтр по методу
- `limit` (optional, default: 10): Лимит результатов

**Ответ:**
```json
[
  {
    "id": 1,
    "pipeline": "TP-1",
    "status": "active",
    "method": "MFL",
    "riskClass": "high",
    "date": "2025-04-22"
  }
]
```

**Backend:** `/defects`

---

#### GET `/api/dashboard/events`

Получить список событий для дашборда.

**Параметры запроса:**
- `limit` (optional, default: 10): Лимит результатов

**Ответ:**
```json
[
  {
    "id": 1,
    "date": "2025-04-20",
    "message": "Обнаружен новый дефект",
    "type": "defect"
  }
]
```

**Примечание:** В настоящее время возвращает mock данные. Будет подключено к бэкенду в будущем.

---

#### GET `/api/dashboard/criticality-distribution`

Получить распределение дефектов по критичности.

**Ответ:**
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

**Backend:** `/statistics`

---

#### GET `/api/dashboard/methods-distribution`

Получить распределение по методам диагностики.

**Ответ:**
```json
[
  {
    "method": "MFL",
    "count": 450
  },
  {
    "method": "UT",
    "count": 320
  }
]
```

**Backend:** `/statistics`

---

#### GET `/api/dashboard/recent-inspections`

Получить последние обследования.

**Параметры запроса:**
- `limit` (optional, default: 10): Лимит результатов

**Ответ:**
```json
[
  {
    "id": 1,
    "date": "2025-04-22",
    "object": "Сегмент 1",
    "method": "MFL",
    "result": "Дефект обнаружен"
  }
]
```

**Backend:** `/defects` (с сортировкой по дате)

---

### Objects API

#### GET `/api/objects`

Получить список всех объектов (сегментов).

**Параметры запроса:**
- `pipeline` (optional): Фильтр по магистрали
- `type` (optional): Фильтр по типу
- `limit` (optional, default: 100): Лимит результатов

**Ответ:**
```json
[
  {
    "id": 1,
    "name": "Сегмент 1",
    "type": "pipeline_section",
    "pipeline": "MT-01",
    "year": 1985,
    "material": "17Г1С",
    "inspections": 12,
    "defects": 3,
    "criticalDefects": 1,
    "location": {
      "latitude": 52.96,
      "longitude": 63.12,
      "altitude": 250.0
    }
  }
]
```

**Backend:** `/defects` (группировка по сегментам)

---

#### GET `/api/objects/[id]`

Получить детальную информацию об объекте по ID.

**Параметры пути:**
- `id`: ID объекта (номер сегмента)

**Ответ:**
```json
{
  "id": 1,
  "name": "Сегмент 1",
  "type": "pipeline_section",
  "pipeline": "MT-01",
  "lat": 52.96,
  "lon": 63.12,
  "year": 1985,
  "material": "17Г1С",
  "criticality": "medium",
  "inspections": [
    {
      "id": 1,
      "date": "2024-01-15",
      "method": "VIK",
      "defectFound": true,
      "qualityGrade": "требует_мер",
      "param1": 2.5,
      "param2": 15,
      "param3": 0.8
    }
  ],
  "defects": [
    {
      "id": 1,
      "date": "2024-01-15",
      "description": "Коррозия стенки",
      "depth": 2.5,
      "length": 15,
      "width": 0.8,
      "criticality": "medium"
    }
  ],
  "recommendations": [
    "Плановый ремонт в Q2 2024",
    "Усиленный контроль"
  ]
}
```

**Backend:** `/defects?segment={id}`

---

### Analytics API

#### GET `/api/analytics`

Получить аналитические данные.

**Параметры запроса:**
- `period` (optional, default: 'year'): Период анализа ('year', 'quarter', 'month')

**Ответ:**
```json
{
  "trends": {
    "inspectionsGrowth": "23",
    "defectsReduction": "-12",
    "plannedWorks": 24
  },
  "yearlyData": [
    {
      "year": 2020,
      "inspections": 120,
      "defects": 15
    }
  ],
  "pipelineComparison": [
    {
      "pipeline": "MT-01",
      "objects": 450,
      "defects": 35,
      "critical": 8
    }
  ]
}
```

**Backend:** `/statistics`, `/defects`

---

### AI Analysis API

#### GET `/api/ai-analysis`

Получить данные AI анализа и ML прогнозов.

**Ответ:**
```json
{
  "totalAnalyzed": 1247,
  "normal": 856,
  "medium": 302,
  "high": 89,
  "modelAccuracy": "94.2",
  "lastTraining": "2024-01-15",
  "algorithm": "XGBoost",
  "predictions": [
    {
      "objectId": 1,
      "objectName": "Сегмент 1",
      "currentRisk": "medium",
      "predictedRisk": "high",
      "confidence": 87,
      "factors": [
        "Высокая глубина коррозии",
        "Низкая толщина стенки"
      ]
    }
  ]
}
```

**Backend:** `/ml/model/metrics`, `/ml/model/info`, `/statistics`, `/defects`

---

### Map API

#### GET `/api/map/defects`

Получить дефекты для отображения на карте.

**Параметры запроса:**
- `method` (optional): Фильтр по методу диагностики
- `criticality` (optional): Фильтр по критичности ('normal', 'medium', 'high', 'all')

**Ответ:**
```json
[
  {
    "id": "DEF001",
    "lat": 52.96,
    "lng": 63.12,
    "criticality": "medium",
    "severity": "средний",
    "type": "коррозия",
    "segment": 1,
    "pipeline": "MT-01"
  }
]
```

**Backend:** `/defects`

---

### AI Chat API

#### POST `/api/ai/chat`

Отправить сообщение в AI чат.

**Тело запроса:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Какие дефекты найдены на сегменте 1?"
    }
  ]
}
```

**Ответ:**
```json
{
  "message": "На сегменте 1 обнаружено 3 дефекта..."
}
```

**Примечание:** Требует настройки `OPENAI_API_KEY` в `.env.local`

---

### System Info API

#### GET `/api/info`

Получить информацию о системе.

**Ответ:**
```json
{
  "application": "IntegrityOS",
  "version": "1.0.0",
  "database_mode": "local",
  "total_defects": 1500,
  "ml_available": true,
  "statistics": {
    "total_defects": 1500,
    "defects_by_type": {...},
    "defects_by_severity": {...}
  },
  "available_endpoints": {
    "defects": "/defects",
    "statistics": "/statistics",
    "export": "/export/json",
    "ml_predict": "/ml/predict",
    "ml_metrics": "/ml/model/metrics",
    "ml_info": "/ml/model/info",
    "docs": "/docs"
  }
}
```

**Backend:** `/info`

---

### Export API

#### GET `/api/export/json`

Экспортировать все дефекты в JSON файл.

**Ответ:** Файл `defects_export.json` для скачивания

**Backend:** `/export/json` (требует аутентификации)

**Примечание:** Автоматически выполняет логин с admin/admin для разработки

---

### Admin API

#### POST `/api/admin/reload`

Перезагрузить данные из CSV файлов.

**Примечание:** Требует аутентификации (автоматический логин с admin/admin для разработки)

**Ответ:**
```json
{
  "status": "success",
  "message": "Data reloaded",
  "inserted": 1500,
  "errors": 0,
  "error_log": null
}
```

**Backend:** `/reload` (требует admin токен)

---

### Notifications API

#### GET `/api/notifications`

Получить уведомления на основе критических дефектов.

**Параметры запроса:**
- `filter` (optional): Фильтр ('all', 'unread', 'critical')

**Ответ:**
```json
[
  {
    "id": 1,
    "type": "critical",
    "title": "Критический дефект обнаружен",
    "message": "Объект \"Сегмент 1\" требует немедленного внимания",
    "date": "2024-01-20",
    "read": false,
    "objectId": 1,
    "defectId": "DEF001"
  }
]
```

**Backend:** `/defects` (фильтрация по критичности)

---

### Defects by Type/Segment API

#### GET `/api/defects/type/[type]`

Получить дефекты по типу.

**Параметры пути:**
- `type`: Тип дефекта (коррозия, сварной шов, металлический объект и т.д.)

**Ответ:**
```json
{
  "total": 100,
  "defects": [...],
  "filters_applied": {
    "defect_type": "коррозия"
  }
}
```

**Backend:** `/defects/type/{type}`

---

#### GET `/api/defects/segment/[id]`

Получить дефекты по номеру сегмента.

**Параметры пути:**
- `id`: Номер сегмента

**Ответ:**
```json
{
  "total": 50,
  "defects": [...],
  "filters_applied": {
    "segment": 1
  }
}
```

**Backend:** `/defects/segment/{id}`

---

## Backend API Endpoints (FastAPI)

Базовый URL: `http://localhost:8000` (настраивается через `API_BASE_URL`)

### Health Check

#### GET `/health`

Проверить статус API.

**Ответ:**
```json
{
  "status": "healthy",
  "database": "connected",
  "defects_count": 1500
}
```

---

#### GET `/`

Корневой эндпоинт - информация о сервисе.

**Ответ:**
```json
{
  "service": "IntegrityOS API",
  "version": "1.0.0",
  "status": "active",
  "docs": "/docs"
}
```

---

#### GET `/info`

Получить детальную информацию о системе.

**Ответ:**
```json
{
  "application": "IntegrityOS",
  "version": "1.0.0",
  "database_mode": "local",
  "total_defects": 1500,
  "ml_available": true,
  "statistics": {
    "total_defects": 1500,
    "defects_by_type": {...},
    "defects_by_severity": {...}
  },
  "available_endpoints": {
    "defects": "/defects",
    "statistics": "/statistics",
    "export": "/export/json",
    "ml_predict": "/ml/predict",
    "ml_metrics": "/ml/model/metrics",
    "ml_info": "/ml/model/info",
    "docs": "/docs"
  }
}
```

---

### Authentication

#### POST `/auth/login`

Вход в систему и получение JWT токена.

**Тело запроса:**
```json
{
  "username": "admin",
  "password": "admin"
}
```

**Ответ:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600,
  "role": "admin"
}
```

---

#### GET `/auth/me`

Получить информацию о текущем пользователе.

**Заголовки:**
- `Authorization: Bearer {token}`

**Ответ:**
```json
{
  "username": "admin",
  "role": "admin"
}
```

---

### Defects

#### GET `/defects`

Получить список всех дефектов с опциональной фильтрацией.

**Параметры запроса:**
- `defect_type` (optional): Тип дефекта ('коррозия', 'сварной шов', 'металлический объект')
- `segment` (optional): Номер сегмента
- `limit` (optional): Лимит результатов
- `skip` (optional): Пропустить N результатов

**Ответ:**
```json
{
  "total": 100,
  "defects": [
    {
      "defect_id": "DEF001",
      "segment_number": 1,
      "measurement_distance_m": 150.5,
      "pipeline_id": "MT-01",
      "details": {
        "type": "коррозия",
        "parameters": {
          "depth_percent": 45.5,
          "length_mm": 120.0,
          "width_mm": 50.0,
          "depth_mm": 5.5,
          "wall_thickness_mm": 12.0
        },
        "location": {
          "latitude": 43.5,
          "longitude": 76.9,
          "altitude": 250.0,
          "timestamp": "2024-01-15T10:30:00"
        },
        "surface_location": "ВНШ",
        "distance_to_weld_m": 2.5,
        "erf_b31g_code": 0.85,
        "severity": "средний"
      }
    }
  ],
  "filters_applied": {
    "defect_type": null,
    "segment": null
  }
}
```

---

#### GET `/defects/{defect_id}`

Получить дефект по ID.

**Параметры пути:**
- `defect_id`: ID дефекта

**Ответ:**
```json
{
  "defect_id": "DEF001",
  "segment_number": 1,
  "measurement_distance_m": 150.5,
  "pipeline_id": "MT-01",
  "details": {
    "type": "коррозия",
    "parameters": {
      "depth_percent": 45.5,
      "length_mm": 120.0,
      "width_mm": 50.0
    },
    "location": {
      "latitude": 43.5,
      "longitude": 76.9,
      "altitude": 250.0
    }
  }
}
```

---

#### GET `/defects/search`

Поиск дефектов с множественными фильтрами.

**Параметры запроса:**
- `defect_type` (optional): Тип дефекта
- `segment` (optional): Номер сегмента

**Ответ:** Аналогичен `/defects`

---

#### GET `/defects/type/{defect_type}`

Получить дефекты по типу.

**Параметры пути:**
- `defect_type`: Тип дефекта

**Ответ:** Аналогичен `/defects`

---

#### GET `/defects/segment/{segment_id}`

Получить дефекты по номеру сегмента.

**Параметры пути:**
- `segment_id`: Номер сегмента

**Ответ:** Аналогичен `/defects`

---

### Statistics

#### GET `/statistics`

Получить статистику по всем дефектам.

**Ответ:**
```json
{
  "total_defects": 1500,
  "defects_by_type": {
    "коррозия": 800,
    "сварной шов": 500,
    "металлический объект": 200
  },
  "defects_by_severity": {
    "критичный": 150,
    "высокий": 300,
    "средний": 600,
    "низкий": 450
  },
  "total_segments": 45,
  "average_depth_percent": 35.5
}
```

---

### Machine Learning

#### POST `/ml/predict`

Предсказать критичность дефекта с помощью ML модели.

**Тело запроса (вложенная структура):**
```json
{
  "defect_id": "DEF001",
  "segment_number": 1,
  "measurement_distance_m": 150.5,
  "pipeline_id": "MT-01",
  "details": {
    "type": "коррозия",
    "parameters": {
      "depth_percent": 45.5,
      "length_mm": 120.0,
      "width_mm": 50.0,
      "depth_mm": 5.5,
      "wall_thickness_mm": 12.0
    },
    "location": {
      "latitude": 43.5,
      "longitude": 76.9,
      "altitude": 250.0
    },
    "surface_location": "ВНШ",
    "distance_to_weld_m": 2.5,
    "erf_b31g_code": 0.85
  }
}
```

**Тело запроса (плоская структура):**
```json
{
  "depth_percent": 45.5,
  "depth_mm": 5.5,
  "length_mm": 120.0,
  "width_mm": 50.0,
  "wall_thickness_mm": 12.0,
  "distance_to_weld_m": 2.5,
  "erf_b31g": 0.85,
  "altitude_m": 250.0,
  "latitude": 43.5,
  "longitude": 76.9,
  "measurement_distance_m": 150.5,
  "defect_type": "коррозия",
  "surface_location": "ВНШ"
}
```

**Ответ:**
```json
{
  "severity": "критичный",
  "probability": 0.85,
  "probabilities": {
    "критичный": 0.85,
    "высокий": 0.10,
    "средний": 0.04,
    "низкий": 0.01
  },
  "model_type": "XGBoost",
  "prediction_timestamp": "2025-01-07T10:30:45.123456"
}
```

---

#### GET `/ml/model/info`

Получить информацию о загруженной ML модели.

**Ответ:**
```json
{
  "model_type": "XGBoost",
  "is_loaded": true,
  "last_training": "2024-01-15",
  "features_count": 15
}
```

---

#### GET `/ml/model/metrics`

Получить метрики качества модели.

**Ответ:**
```json
{
  "accuracy": 0.92,
  "precision": 0.89,
  "recall": 0.91,
  "f1_score": 0.90,
  "classification_report": "              precision    recall  f1-score   support\n\n    критичный       0.95      0.92      0.93       150\n      высокий       0.88      0.90      0.89       300\n     средний       0.87      0.88      0.87       600\n       низкий       0.91      0.93      0.92       450\n\n    accuracy                           0.90      1500\n   macro avg       0.90      0.91      0.90      1500\nweighted avg       0.90      0.90      0.90      1500\n"
}
```

---

### Export

#### GET `/export/json`

Экспортировать все дефекты в JSON файл.

**Заголовки:**
- `Authorization: Bearer {token}` (требуется admin)

**Ответ:** Файл `defects_export.json`

---

### Admin (требуется аутентификация)

Все административные эндпоинты требуют JWT токен с ролью `admin`.

#### POST `/admin/defects`

Создать новый дефект вручную.

**Заголовки:**
- `Authorization: Bearer {token}`

**Тело запроса:**
```json
{
  "defect_id": "DEF001",
  "segment_number": 1,
  "measurement_distance_m": 150.5,
  "pipeline_id": "MT-01",
  "details": {
    "type": "коррозия",
    "parameters": {
      "depth_percent": 45.5,
      "length_mm": 120.0,
      "width_mm": 50.0
    },
    "location": {
      "latitude": 43.5,
      "longitude": 76.9,
      "altitude": 250.0
    }
  }
}
```

**Ответ:**
```json
{
  "defect_id": "DEF001",
  "message": "Defect created successfully"
}
```

---

#### PUT `/admin/defects/{defect_id}`

Обновить существующий дефект.

**Заголовки:**
- `Authorization: Bearer {token}`

**Параметры пути:**
- `defect_id`: ID дефекта

**Тело запроса:** Аналогично POST `/admin/defects`

**Ответ:**
```json
{
  "defect_id": "DEF001",
  "message": "Defect updated successfully"
}
```

---

#### DELETE `/admin/defects/{defect_id}`

Удалить дефект.

**Заголовки:**
- `Authorization: Bearer {token}`

**Параметры пути:**
- `defect_id`: ID дефекта

**Ответ:** `204 No Content`

---

#### POST `/admin/defects/update-all-severities`

Обновить критичность всех дефектов через ML модель.

**Заголовки:**
- `Authorization: Bearer {token}`

**Ответ:**
```json
{
  "updated": 1500,
  "message": "All severities updated successfully"
}
```

---

#### POST `/reload`

Перезагрузить данные из CSV файлов.

**Заголовки:**
- `Authorization: Bearer {token}`

**Ответ:**
```json
{
  "loaded": 1500,
  "message": "Data reloaded successfully"
}
```

---

#### DELETE `/clear`

Очистить все дефекты из базы данных.

**Заголовки:**
- `Authorization: Bearer {token}`

**Ответ:** `204 No Content`

---

## Типы данных

### Defect (Дефект)

```typescript
interface Defect {
  defect_id: string;
  segment_number: number;
  measurement_distance_m: number;
  pipeline_id: string;
  details: {
    type: 'коррозия' | 'сварной шов' | 'металлический объект';
    parameters: {
      depth_percent?: number;
      depth_mm?: number;
      length_mm?: number;
      width_mm?: number;
      wall_thickness_mm?: number;
    };
    location: {
      latitude: number;
      longitude: number;
      altitude: number;
      timestamp?: string;
    };
    surface_location?: 'ВНШ' | 'ВНТ';
    distance_to_weld_m?: number;
    erf_b31g_code?: number;
    severity?: 'критичный' | 'высокий' | 'средний' | 'низкий';
  };
}
```

### Severity Levels (Уровни критичности)

- `критичный` / `critical` - Критический
- `высокий` / `high` - Высокий
- `средний` / `medium` - Средний
- `низкий` / `low` - Низкий

### Defect Types (Типы дефектов)

- `коррозия` - Коррозия
- `сварной шов` - Сварной шов
- `металлический объект` - Металлический объект

---

## Обработка ошибок

### Стандартные HTTP коды

- `200 OK` - Успешный запрос
- `201 Created` - Ресурс создан
- `204 No Content` - Успешное удаление
- `400 Bad Request` - Неверный запрос
- `401 Unauthorized` - Требуется аутентификация
- `403 Forbidden` - Недостаточно прав
- `404 Not Found` - Ресурс не найден
- `500 Internal Server Error` - Ошибка сервера

### Формат ошибки

```json
{
  "error": "Error message",
  "detail": "Detailed error description"
}
```

---

## Примечания

1. Все эндпоинты бэкенда доступны через переменную окружения `API_BASE_URL` (по умолчанию `http://localhost:8000`)
2. Административные эндпоинты требуют JWT токен, полученный через `/auth/login`
3. Токен передается в заголовке: `Authorization: Bearer {token}`
4. Время жизни токена: 60 минут (настраивается через `JWT_ACCESS_TOKEN_EXPIRE_MINUTES`)
5. По умолчанию создается администратор: `username: admin`, `password: admin`

---

## Примеры использования

### Получение всех дефектов

```typescript
const response = await fetch('http://localhost:8000/defects');
const data = await response.json();
console.log(data.defects);
```

### Получение дефектов с фильтрацией

```typescript
const response = await fetch('http://localhost:8000/defects?defect_type=коррозия&segment=1');
const data = await response.json();
```

### ML предсказание

```typescript
const response = await fetch('http://localhost:8000/ml/predict', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    depth_percent: 45.5,
    length_mm: 120.0,
    defect_type: 'коррозия',
    // ... другие параметры
  }),
});
const prediction = await response.json();
console.log(prediction.severity);
```

### Аутентификация и административный запрос

```typescript
// 1. Вход
const loginResponse = await fetch('http://localhost:8000/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'admin' }),
});
const { access_token } = await loginResponse.json();

// 2. Использование токена
const adminResponse = await fetch('http://localhost:8000/admin/defects', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${access_token}`,
  },
  body: JSON.stringify({ /* данные дефекта */ }),
});
```

---

**Последнее обновление:** 2025-01-07

