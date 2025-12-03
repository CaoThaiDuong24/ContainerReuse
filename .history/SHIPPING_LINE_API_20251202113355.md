# Shipping Line API (iContainerHub_HangTau)

API documentation for managing shipping lines (hãng tàu) in the Container Reseu system.

## Base URL
```
http://localhost:5000/api/iContainerHub_HangTau
```

## Endpoints

### 1. Get All Shipping Lines
Get a list of all shipping lines with optional filters.

**Endpoint:** `GET /api/iContainerHub_HangTau`

**Query Parameters:**
- `status` (optional): Filter by status (`active` | `inactive`)
- `country` (optional): Filter by country
- `search` (optional): Search by name, code, fullName, or scacCode

**Example:**
```bash
curl http://localhost:5000/api/iContainerHub_HangTau
curl http://localhost:5000/api/iContainerHub_HangTau?status=active
curl http://localhost:5000/api/iContainerHub_HangTau?search=maersk
```

**Response:**
```json
{
  "success": true,
  "count": 53,
  "data": [
    {
      "id": "1",
      "code": "MAEU",
      "name": "Maersk",
      "fullName": "Maersk Line",
      "scacCode": "MAEU",
      "country": "Denmark",
      "website": "https://www.maersk.com",
      "email": "contact@maersk.com",
      "phone": "+45 33 63 33 63",
      "status": "active",
      "createdAt": "2023-01-01",
      "updatedAt": "2023-12-01"
    }
  ]
}
```

---

### 2. Get Shipping Line by ID
Get detailed information about a specific shipping line.

**Endpoint:** `GET /api/iContainerHub_HangTau/:id`

**Example:**
```bash
curl http://localhost:5000/api/iContainerHub_HangTau/1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "code": "MAEU",
    "name": "Maersk",
    "fullName": "Maersk Line",
    "scacCode": "MAEU",
    "country": "Denmark",
    "website": "https://www.maersk.com",
    "email": "contact@maersk.com",
    "phone": "+45 33 63 33 63",
    "status": "active",
    "createdAt": "2023-01-01",
    "updatedAt": "2023-12-01"
  }
}
```

---

### 3. Get Shipping Line by Code
Get shipping line by its code (e.g., MAEU, COSU, HLCU).

**Endpoint:** `GET /api/iContainerHub_HangTau/code/:code`

**Example:**
```bash
curl http://localhost:5000/api/iContainerHub_HangTau/code/MAEU
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "code": "MAEU",
    "name": "Maersk",
    "fullName": "Maersk Line",
    "scacCode": "MAEU",
    "country": "Denmark",
    "status": "active"
  }
}
```

---

### 4. Search Shipping Lines
Search shipping lines by query string.

**Endpoint:** `GET /api/iContainerHub_HangTau/search?q=<query>`

**Query Parameters:**
- `q` (required): Search query

**Example:**
```bash
curl "http://localhost:5000/api/iContainerHub_HangTau/search?q=maersk"
```

**Response:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": "1",
      "code": "MAEU",
      "name": "Maersk",
      "fullName": "Maersk Line",
      "status": "active"
    }
  ]
}
```

---

### 5. Get Statistics
Get statistical information about shipping lines.

**Endpoint:** `GET /api/iContainerHub_HangTau/statistics`

**Example:**
```bash
curl http://localhost:5000/api/iContainerHub_HangTau/statistics
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 53,
    "active": 53,
    "inactive": 0,
    "byCountry": {
      "Denmark": 1,
      "China": 5,
      "Germany": 2,
      "USA": 3
    }
  }
}
```

---

### 6. Get Countries
Get a list of all countries where shipping lines are based.

**Endpoint:** `GET /api/iContainerHub_HangTau/countries`

**Example:**
```bash
curl http://localhost:5000/api/iContainerHub_HangTau/countries
```

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    "China",
    "Denmark",
    "Germany",
    "Japan",
    "USA"
  ]
}
```

---

### 7. Refresh Data
Clear cache and fetch fresh data from the API.

**Endpoint:** `POST /api/iContainerHub_HangTau/refresh`

**Example:**
```bash
curl -X POST http://localhost:5000/api/iContainerHub_HangTau/refresh
```

**Response:**
```json
{
  "success": true,
  "message": "Shipping line data refreshed successfully",
  "count": 53,
  "data": [...]
}
```

---

### 8. Create Shipping Line
Create a new shipping line (placeholder - requires API implementation).

**Endpoint:** `POST /api/iContainerHub_HangTau`

**Request Body:**
```json
{
  "code": "NEWC",
  "name": "New Carrier",
  "fullName": "New Carrier Line",
  "scacCode": "NEWC",
  "country": "Vietnam",
  "website": "https://newcarrier.com",
  "email": "contact@newcarrier.com",
  "phone": "+84 123 456 789",
  "status": "active"
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/iContainerHub_HangTau \
  -H "Content-Type: application/json" \
  -d '{"code":"NEWC","name":"New Carrier","status":"active"}'
```

---

### 9. Update Shipping Line
Update an existing shipping line (placeholder - requires API implementation).

**Endpoint:** `PUT /api/iContainerHub_HangTau/:id`

**Request Body:**
```json
{
  "name": "Updated Carrier Name",
  "website": "https://updated.com",
  "status": "inactive"
}
```

**Example:**
```bash
curl -X PUT http://localhost:5000/api/iContainerHub_HangTau/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Carrier Name"}'
```

---

### 10. Delete Shipping Line
Delete a shipping line (placeholder - requires API implementation).

**Endpoint:** `DELETE /api/iContainerHub_HangTau/:id`

**Example:**
```bash
curl -X DELETE http://localhost:5000/api/iContainerHub_HangTau/1
```

---

## Data Model

### ShippingLine Object
```typescript
{
  id: string;              // Unique identifier
  code: string;            // Mã hãng tàu (e.g., MAEU, COSU, HLCU)
  name: string;            // Tên hãng tàu
  fullName: string;        // Tên đầy đủ
  scacCode?: string;       // Standard Carrier Alpha Code
  country?: string;        // Quốc gia
  website?: string;        // Website
  email?: string;          // Email liên hệ
  phone?: string;          // Số điện thoại
  status: 'active' | 'inactive';
  createdAt?: string;      // Ngày tạo
  updatedAt?: string;      // Ngày cập nhật
}
```

---

## Frontend Usage

### TypeScript/React Example
```typescript
import { 
  getShippingLines, 
  getShippingLineById,
  searchShippingLines,
  getShippingLineStatistics
} from '@/lib/shippingLineService';

// Get all shipping lines
const { data: shippingLines } = await getShippingLines();

// Get active shipping lines only
const { data: activeLines } = await getShippingLines({ status: 'active' });

// Search shipping lines
const { data: searchResults } = await searchShippingLines('maersk');

// Get shipping line by ID
const { data: shippingLine } = await getShippingLineById('1');

// Get statistics
const { data: stats } = await getShippingLineStatistics();
```

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error message description",
  "error": "Detailed error (in development mode)"
}
```

**Common HTTP Status Codes:**
- `200 OK` - Success
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request parameters
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error
- `503 Service Unavailable` - External API unavailable

---

## Caching

The API uses a 5-minute cache to reduce load on the external API:
- Data is cached in memory for 5 minutes
- Use the `/refresh` endpoint to clear cache and get fresh data
- Cache is automatically refreshed on expiration

---

## Integration with External API

The shipping line API integrates with:
- **Endpoint:** `iContainerHub_HangTau`
- **External API:** `http://apiedepottest.gsotgroup.vn`
- **Authentication:** Token-based (automatically managed)

---

## Files Created

### Backend
1. **Model:** `backend/src/models/shippingLine.ts`
2. **Service:** `backend/src/services/shippingLineApiService.ts`
3. **Controller:** `backend/src/controllers/shippingLineController.ts`
4. **Routes:** `backend/src/routes/shippingLineRoutes.ts`

### Frontend
5. **Service:** `frontend/lib/shippingLineService.ts`

### Updated Files
6. **Backend Index:** `backend/src/index.ts` (added shipping line routes)

---

## Testing

Test the API endpoints:

```bash
# Test connection
curl http://localhost:5000/api/iContainerHub_HangTau

# Test statistics
curl http://localhost:5000/api/iContainerHub_HangTau/statistics

# Test search
curl "http://localhost:5000/api/iContainerHub_HangTau/search?q=maersk"

# Test refresh
curl -X POST http://localhost:5000/api/iContainerHub_HangTau/refresh
```

---

## Notes

- The API automatically handles token refresh when the external API token expires
- All shipping line codes are converted to uppercase for consistency
- The search functionality is case-insensitive
- Create, Update, and Delete endpoints are placeholders and require backend API implementation
