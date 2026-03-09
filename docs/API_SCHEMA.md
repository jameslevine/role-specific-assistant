# TradeAssist — API Schema

## Base URL

```
Production: https://api.tradeassist.co.uk/v1
Staging:    https://api-staging.tradeassist.co.uk/v1
Local:      http://localhost:3000/v1
```

## Versioning Strategy

- URL-based versioning: `/v1/`, `/v2/`, etc.
- Breaking changes require a new version
- Non-breaking additions (new fields, new endpoints) are added to the current version

## Authentication

- **Method**: JWT Bearer Token (AWS Cognito)
- **Header**: `Authorization: Bearer <token>`
- **Token Refresh**: Handled client-side via Cognito SDK
- All endpoints require authentication unless marked as `Public`

---

## Error Response Format

All errors follow a standard structure:

```json
{
  "message": "Human-readable error description",
  "code": "ERROR_CODE",
  "details": "Additional context (optional)"
}
```

### Standard Error Codes

| HTTP Status | Code | Description |
|-------------|------|-------------|
| 400 | `VALIDATION_ERROR` | Invalid request body/params |
| 401 | `UNAUTHORIZED` | Missing or invalid token |
| 403 | `FORBIDDEN` | Insufficient permissions or tier |
| 404 | `NOT_FOUND` | Resource not found |
| 409 | `CONFLICT` | Resource already exists |
| 429 | `RATE_LIMITED` | Usage limit exceeded |
| 500 | `INTERNAL_ERROR` | Server error |

---

## Endpoints

### Chat

#### `POST /v1/:roleSlug/chat`
Send a message and receive an AI response.

**Auth**: Required
**Tier**: Free (10/day), Pro (unlimited), Business (unlimited)

**Request Body**:
```json
{
  "message": "What are the current regulations for domestic rewiring in the UK?",
  "conversationId": "conv_abc123",
  "includePrivateDocs": true
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| message | string | Yes | User's question (max 4000 chars) |
| conversationId | string | No | Existing conversation ID (omit to create new) |
| includePrivateDocs | boolean | No | Include user's private documents in RAG search (default: true) |

**Response** (200):
```json
{
  "conversationId": "conv_abc123",
  "messageId": "msg_def456",
  "response": "For domestic rewiring in the UK, you must comply with BS 7671:2018+A2:2022 (IET Wiring Regulations, 18th Edition)...",
  "citations": [
    {
      "documentId": "doc_xyz789",
      "documentName": "BS 7671:2018 18th Edition",
      "excerpt": "Regulation 411.3.3 states that...",
      "pageNumber": 42,
      "source": "shared"
    }
  ],
  "usage": {
    "questionsUsedToday": 3,
    "questionsRemainingToday": 7,
    "tier": "free"
  }
}
```

**Errors**:
- `429` — Daily question limit exceeded (free tier)
- `400` — Message too long or invalid roleSlug

---

### Conversations

#### `GET /v1/:roleSlug/conversations`
List all conversations for the authenticated user.

**Auth**: Required
**Tier**: All

**Query Parameters**:
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| limit | number | No | Max results (default: 20, max: 50) |
| lastEvaluatedKey | string | No | Pagination token |

**Response** (200):
```json
{
  "conversations": [
    {
      "conversationId": "conv_abc123",
      "title": "Domestic Rewiring Regulations",
      "roleSlug": "electrician",
      "createdAt": "2026-03-09T10:30:00Z",
      "updatedAt": "2026-03-09T11:15:00Z",
      "messageCount": 8
    }
  ],
  "lastEvaluatedKey": "eyJjb252..."
}
```

#### `GET /v1/:roleSlug/conversations/:conversationId`
Get full conversation history.

**Auth**: Required
**Tier**: All

**Response** (200):
```json
{
  "conversationId": "conv_abc123",
  "title": "Domestic Rewiring Regulations",
  "roleSlug": "electrician",
  "messages": [
    {
      "messageId": "msg_001",
      "role": "user",
      "content": "What are the current regulations for domestic rewiring?",
      "createdAt": "2026-03-09T10:30:00Z"
    },
    {
      "messageId": "msg_002",
      "role": "assistant",
      "content": "For domestic rewiring in the UK...",
      "citations": [...],
      "createdAt": "2026-03-09T10:30:05Z"
    }
  ]
}
```

#### `DELETE /v1/:roleSlug/conversations/:conversationId`
Delete a conversation and all its messages.

**Auth**: Required
**Tier**: All

**Response** (204): No content

#### `PATCH /v1/:roleSlug/conversations/:conversationId`
Update conversation metadata (e.g., title).

**Auth**: Required
**Tier**: All

**Request Body**:
```json
{
  "title": "Updated Conversation Title"
}
```

**Response** (200):
```json
{
  "conversationId": "conv_abc123",
  "title": "Updated Conversation Title",
  "updatedAt": "2026-03-09T12:00:00Z"
}
```

---

### Documents

#### `POST /v1/:roleSlug/documents/upload`
Request a presigned URL to upload a document.

**Auth**: Required
**Tier**: Free (5 docs), Pro (100 docs), Business (500 docs)

**Request Body**:
```json
{
  "fileName": "customer-invoice-2026.pdf",
  "fileType": "application/pdf",
  "fileSize": 2048576,
  "description": "Invoice for Smith residence rewiring project"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| fileName | string | Yes | Original file name |
| fileType | string | Yes | MIME type (application/pdf, text/plain, application/vnd.openxmlformats-officedocument.wordprocessingml.document, image/jpeg, image/png) |
| fileSize | number | Yes | File size in bytes |
| description | string | No | User description of the document |

**Response** (200):
```json
{
  "documentId": "doc_abc123",
  "uploadUrl": "https://tradeassist-user-docs.s3.eu-west-2.amazonaws.com/...",
  "expiresAt": "2026-03-09T11:00:00Z"
}
```

**Errors**:
- `403` — Document limit exceeded for tier
- `400` — Unsupported file type or file too large

#### `GET /v1/:roleSlug/documents`
List all documents for the authenticated user.

**Auth**: Required
**Tier**: All

**Query Parameters**:
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| limit | number | No | Max results (default: 20, max: 50) |
| lastEvaluatedKey | string | No | Pagination token |
| status | string | No | Filter by status: `processing`, `ready`, `failed` |

**Response** (200):
```json
{
  "documents": [
    {
      "documentId": "doc_abc123",
      "fileName": "customer-invoice-2026.pdf",
      "fileType": "application/pdf",
      "fileSize": 2048576,
      "description": "Invoice for Smith residence rewiring project",
      "status": "ready",
      "createdAt": "2026-03-09T10:30:00Z"
    }
  ],
  "lastEvaluatedKey": "eyJkb2N...",
  "usage": {
    "documentsUsed": 3,
    "documentsLimit": 5,
    "tier": "free"
  }
}
```

#### `GET /v1/:roleSlug/documents/:documentId`
Get document details.

**Auth**: Required
**Tier**: All

**Response** (200):
```json
{
  "documentId": "doc_abc123",
  "fileName": "customer-invoice-2026.pdf",
  "fileType": "application/pdf",
  "fileSize": 2048576,
  "description": "Invoice for Smith residence rewiring project",
  "status": "ready",
  "downloadUrl": "https://...",
  "createdAt": "2026-03-09T10:30:00Z"
}
```

#### `DELETE /v1/:roleSlug/documents/:documentId`
Delete a document and remove it from the knowledge base.

**Auth**: Required
**Tier**: All

**Response** (204): No content

---

### Users

#### `GET /v1/users/me`
Get the authenticated user's profile.

**Auth**: Required
**Tier**: All

**Response** (200):
```json
{
  "userId": "usr_abc123",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Smith",
  "selectedRole": "electrician",
  "tier": "pro",
  "createdAt": "2026-03-01T09:00:00Z",
  "usage": {
    "questionsUsedToday": 3,
    "questionsRemainingToday": null,
    "documentsUsed": 12,
    "documentsLimit": 100
  }
}
```

#### `PATCH /v1/users/me`
Update the authenticated user's profile.

**Auth**: Required
**Tier**: All

**Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "selectedRole": "electrician"
}
```

**Response** (200): Updated user object (same as GET)

---

### Subscriptions

#### `POST /v1/subscriptions/checkout`
Create a Stripe Checkout session for subscription upgrade.

**Auth**: Required
**Tier**: Free (upgrading)

**Request Body**:
```json
{
  "tier": "pro",
  "successUrl": "https://sparkassist.co.uk/billing?success=true",
  "cancelUrl": "https://sparkassist.co.uk/billing?cancelled=true"
}
```

**Response** (200):
```json
{
  "checkoutUrl": "https://checkout.stripe.com/c/pay/cs_live_..."
}
```

#### `GET /v1/subscriptions/me`
Get current subscription details.

**Auth**: Required
**Tier**: All

**Response** (200):
```json
{
  "subscriptionId": "sub_abc123",
  "tier": "pro",
  "status": "active",
  "currentPeriodStart": "2026-03-01T00:00:00Z",
  "currentPeriodEnd": "2026-04-01T00:00:00Z",
  "cancelAtPeriodEnd": false
}
```

#### `POST /v1/subscriptions/portal`
Create a Stripe Customer Portal session for managing subscription.

**Auth**: Required
**Tier**: Pro, Business

**Response** (200):
```json
{
  "portalUrl": "https://billing.stripe.com/p/session/..."
}
```

#### `POST /v1/webhooks/stripe`
Stripe webhook endpoint for subscription lifecycle events.

**Auth**: Stripe signature verification (not Cognito)
**Public**: Yes (Stripe-only)

**Events Handled**:
- `checkout.session.completed` — Upgrade user tier
- `customer.subscription.updated` — Sync tier changes
- `customer.subscription.deleted` — Downgrade to free
- `invoice.payment_failed` — Flag payment issue

---

### Roles (Public)

#### `GET /v1/roles`
List all available roles and their branding.

**Auth**: Not required
**Tier**: Public

**Response** (200):
```json
{
  "roles": [
    {
      "slug": "electrician",
      "brandName": "SparkAssist",
      "tagline": "Your AI Wiring Companion",
      "icon": "⚡",
      "primaryColor": "#F59E0B",
      "available": true
    },
    {
      "slug": "plumber",
      "brandName": "PipeAssist",
      "tagline": "Your AI Plumbing Expert",
      "icon": "🔧",
      "primaryColor": "#3B82F6",
      "available": true
    }
  ]
}
```

#### `GET /v1/roles/:roleSlug`
Get detailed role configuration.

**Auth**: Not required
**Tier**: Public

**Response** (200):
```json
{
  "slug": "electrician",
  "brandName": "SparkAssist",
  "tagline": "Your AI Wiring Companion",
  "description": "Your AI-powered assistant for all things electrical...",
  "icon": "⚡",
  "primaryColor": "#F59E0B",
  "secondaryColor": "#D97706",
  "features": [
    "BS 7671 18th Edition guidance",
    "Part P Building Regulations",
    "Cable sizing calculations",
    "Testing & inspection advice"
  ],
  "regulations": [
    "BS 7671:2018+A2:2022",
    "Part P Building Regulations",
    "Electricity at Work Regulations 1989"
  ],
  "jurisdiction": "UK"
}
```

---

### Admin

#### `POST /v1/admin/roles`
Create or update a role configuration.

**Auth**: Required (Admin only)

**Request Body**:
```json
{
  "slug": "electrician",
  "brandName": "SparkAssist",
  "tagline": "Your AI Wiring Companion",
  "description": "...",
  "icon": "⚡",
  "primaryColor": "#F59E0B",
  "secondaryColor": "#D97706",
  "systemPrompt": "You are SparkAssist, an expert AI assistant for electricians...",
  "features": [...],
  "regulations": [...],
  "jurisdiction": "UK"
}
```

**Response** (200): Created/updated role object

#### `POST /v1/admin/roles/:roleSlug/documents`
Upload a shared document to a role's knowledge base.

**Auth**: Required (Admin only)

**Request Body**:
```json
{
  "fileName": "bs-7671-18th-edition-summary.pdf",
  "fileType": "application/pdf",
  "fileSize": 5242880,
  "category": "regulation"
}
```

**Response** (200):
```json
{
  "documentId": "rdoc_abc123",
  "uploadUrl": "https://tradeassist-role-docs.s3.eu-west-2.amazonaws.com/...",
  "expiresAt": "2026-03-09T11:00:00Z"
}
```

#### `GET /v1/admin/analytics`
Get platform usage analytics.

**Auth**: Required (Admin only)

**Query Parameters**:
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| period | string | No | `day`, `week`, `month` (default: `week`) |
| roleSlug | string | No | Filter by role |

**Response** (200):
```json
{
  "period": "week",
  "totalUsers": 1250,
  "activeUsers": 340,
  "totalQuestions": 8500,
  "questionsByRole": {
    "electrician": 3200,
    "plumber": 2100,
    "bricklayer": 1500,
    "carpenter": 1000,
    "painter": 700
  },
  "subscriptions": {
    "free": 1050,
    "pro": 150,
    "business": 50
  }
}
```

---

## Rate Limiting

| Tier | Questions/Day | API Requests/Min | Document Uploads |
|------|--------------|-------------------|-----------------|
| Free | 10 | 30 | 5 total |
| Pro | Unlimited | 60 | 100 total |
| Business | Unlimited | 120 | 500 total |

Rate limit headers are included in all responses:
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 7
X-RateLimit-Reset: 2026-03-10T00:00:00Z
```
