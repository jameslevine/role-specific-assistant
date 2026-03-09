# TradeAssist — Tools & Technology

## Language & Runtime

| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 20.x LTS | Backend runtime |
| TypeScript | 5.x | Type safety across frontend and backend |
| React | 18.x | Frontend UI framework |

---

## Frontend

### Core Framework & Build

| Library | Version | Justification |
|---------|---------|---------------|
| React | 18.x | Industry standard, large ecosystem, per project rules |
| TypeScript | 5.x | Type safety, better DX, catch errors at compile time |
| Vite | 5.x | Fast build tool, HMR, ESM-native, per project rules |

### UI & Styling

| Library | Version | Justification |
|---------|---------|---------------|
| MUI (Material UI) | 5.x | Comprehensive component library, theming support for multi-brand |
| @emotion/styled | 11.x | CSS-in-JS, dynamic theming per role brand, per project rules |
| @emotion/react | 11.x | Required peer dependency for MUI + Emotion |

### State Management & Data Fetching

| Library | Version | Justification |
|---------|---------|---------------|
| Zustand | 4.x | Lightweight global state, simple API, per project rules |
| TanStack Query (React Query) | 5.x | Server state management, caching, per project rules |

### Forms & Validation

| Library | Version | Justification |
|---------|---------|---------------|
| Formik | 2.x | Form state management, per project rules |
| Yup | 1.x | Schema-based validation, integrates with Formik |

### Internationalisation

| Library | Version | Justification |
|---------|---------|---------------|
| react-i18next | 14.x | i18n framework, supports UK English + future languages |
| i18next | 23.x | Core i18n library |

### Authentication

| Library | Version | Justification |
|---------|---------|---------------|
| @aws-amplify/auth | 6.x | Cognito integration for login/register/verify/forgot password |

### Routing

| Library | Version | Justification |
|---------|---------|---------------|
| react-router-dom | 6.x | Client-side routing, dynamic role-based routes |

### Utilities

| Library | Version | Justification |
|---------|---------|---------------|
| dayjs | 1.x | Lightweight date utility, per project rules |
| axios | 1.x | HTTP client for API calls |

---

## Backend

### Core Framework

| Library | Version | Justification |
|---------|---------|---------------|
| Express | 4.x | HTTP framework, per project rules |
| TypeScript | 5.x | Type safety |
| serverless-http | 3.x | Wraps Express for Lambda deployment |

### Validation

| Library | Version | Justification |
|---------|---------|---------------|
| Joi | 17.x | Server-side input validation, per project rules |

### AWS SDK

| Library | Version | Justification |
|---------|---------|---------------|
| @aws-sdk/client-dynamodb | 3.x | DynamoDB operations |
| @aws-sdk/lib-dynamodb | 3.x | DynamoDB document client |
| @aws-sdk/client-s3 | 3.x | S3 operations (presigned URLs, document management) |
| @aws-sdk/s3-request-presigner | 3.x | Generate presigned URLs for direct uploads |
| @aws-sdk/client-bedrock-runtime | 3.x | Bedrock LLM invocation |
| @aws-sdk/client-bedrock-agent-runtime | 3.x | Bedrock Knowledge Base queries |
| @aws-sdk/client-bedrock-agent | 3.x | Bedrock Knowledge Base management |
| @aws-sdk/client-secrets-manager | 3.x | Retrieve Stripe keys and other secrets |

### Authentication

| Library | Version | Justification |
|---------|---------|---------------|
| aws-jwt-verify | 4.x | Verify Cognito JWT tokens in middleware |

### Payments

| Library | Version | Justification |
|---------|---------|---------------|
| stripe | 14.x | Stripe API for subscriptions and billing |

### Utilities

| Library | Version | Justification |
|---------|---------|---------------|
| uuid | 9.x | Generate unique IDs for DynamoDB items |
| cors | 2.x | CORS middleware for Express |
| dayjs | 1.x | Date utility |

---

## Infrastructure & DevOps

### IaC & Deployment

| Tool | Version | Justification |
|------|---------|---------------|
| AWS SAM CLI | 1.x | CloudFormation deployment, local testing |
| CloudFormation | - | Infrastructure as Code, per project rules |
| AWS CLI | 2.x | S3 sync, CloudFront invalidation |

### CI/CD

| Tool | Version | Justification |
|------|---------|---------------|
| GitHub Actions | - | Automated build, test, deploy pipeline |

### Linting & Formatting

| Tool | Version | Justification |
|------|---------|---------------|
| ESLint | 8.x | Code linting (Airbnb + TypeScript config for frontend) |
| Prettier | 3.x | Code formatting |
| cfn-lint | - | CloudFormation template linting |
| cfn_nag | - | CloudFormation security linting |

### Commit Hooks & Standards

| Tool | Version | Justification |
|------|---------|---------------|
| Husky | 9.x | Git hooks on commit and push |
| commitlint | 18.x | Enforce conventional commit messages |
| lint-staged | 15.x | Run linters on staged files only |

### Testing

| Tool | Version | Justification |
|------|---------|---------------|
| Jest | 29.x | Unit and integration testing |
| React Testing Library | 14.x | Frontend component testing |
| Cypress | 13.x | E2E testing |
| Supertest | 6.x | API endpoint testing |

---

## AWS Services

| Service | Purpose | Configuration |
|---------|---------|---------------|
| AWS Lambda | Compute (Express monolith) | Node.js 20.x runtime, 512MB-1024MB memory |
| API Gateway | REST API | Cognito authorizer, throttling, CORS |
| DynamoDB | Database | On-demand capacity, encryption at rest |
| S3 | Object storage | SSE-S3 encryption, versioning, OAC |
| CloudFront | CDN | OAC to S3, custom domains, HTTPS |
| Cognito | Authentication | User pools, email verification |
| Bedrock | LLM + RAG | Claude 3.5 Sonnet, Titan Embeddings V2 |
| Bedrock Knowledge Bases | RAG vector search | OpenSearch Serverless backend |
| OpenSearch Serverless | Vector store | Managed by Bedrock KB |
| Secrets Manager | Secret storage | Stripe API keys, webhook secrets |
| CloudWatch | Monitoring | Logs, metrics, alarms |
| Textract | OCR | Image document processing (Pro/Business tier) |

---

## External Services

| Service | Purpose | Integration |
|---------|---------|-------------|
| Stripe | Payment processing | REST API + Webhooks |
| GitHub | Source control | Repository hosting + Actions CI/CD |

---

## Environment Setup

### Prerequisites

1. **Node.js 20.x** — Install via nvm: `nvm install 20`
2. **AWS CLI v2** — Install via Homebrew: `brew install awscli`
3. **SAM CLI** — Install via Homebrew: `brew install aws-sam-cli`
4. **Git** — Pre-installed on macOS

### Local Development

```bash
# Clone the repository
git clone https://github.com/<org>/role-specific-assistant.git
cd role-specific-assistant

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your AWS credentials and config

# Start backend locally (SAM CLI)
cd ../backend
sam local start-api

# Start frontend locally (Vite)
cd ../frontend
npm run dev
```

### Environment Variables

#### Backend (.env)
```
AWS_REGION=eu-west-2
USERS_TABLE=tradeassist-users
CONVERSATIONS_TABLE=tradeassist-conversations
MESSAGES_TABLE=tradeassist-messages
DOCUMENTS_TABLE=tradeassist-documents
USAGE_TABLE=tradeassist-usage
SUBSCRIPTIONS_TABLE=tradeassist-subscriptions
USER_DOCS_BUCKET=tradeassist-user-docs
ROLE_DOCS_BUCKET=tradeassist-role-docs
COGNITO_USER_POOL_ID=eu-west-2_xxxxx
COGNITO_CLIENT_ID=xxxxx
STRIPE_SECRET_KEY_ARN=arn:aws:secretsmanager:...
STRIPE_WEBHOOK_SECRET_ARN=arn:aws:secretsmanager:...
BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20241022-v2:0
```

#### Frontend (.env)
```
VITE_API_URL=http://localhost:3000/v1
VITE_COGNITO_USER_POOL_ID=eu-west-2_xxxxx
VITE_COGNITO_CLIENT_ID=xxxxx
VITE_COGNITO_REGION=eu-west-2
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
```
