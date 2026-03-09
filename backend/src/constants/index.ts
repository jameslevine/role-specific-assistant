import { SubscriptionTier } from "../types";

// Table names
export const USERS_TABLE = process.env.USERS_TABLE!;
export const CONVERSATIONS_TABLE = process.env.CONVERSATIONS_TABLE!;
export const MESSAGES_TABLE = process.env.MESSAGES_TABLE!;
export const DOCUMENTS_TABLE = process.env.DOCUMENTS_TABLE!;
export const USAGE_TABLE = process.env.USAGE_TABLE!;
export const SUBSCRIPTIONS_TABLE = process.env.SUBSCRIPTIONS_TABLE!;

// S3 Buckets
export const USER_DOCS_BUCKET = process.env.USER_DOCS_BUCKET!;
export const ROLE_DOCS_BUCKET = process.env.ROLE_DOCS_BUCKET!;

// Cognito
export const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID!;
export const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID!;
export const AWS_REGION = process.env.AWS_REGION || "eu-west-2";

// Bedrock
export const BEDROCK_MODEL_ID =
  process.env.BEDROCK_MODEL_ID || "anthropic.claude-3-5-sonnet-20241022-v2:0";

// Secrets Manager
export const STRIPE_SECRET_KEY_ARN = process.env.STRIPE_SECRET_KEY_ARN!;
export const STRIPE_WEBHOOK_SECRET_ARN = process.env.STRIPE_WEBHOOK_SECRET_ARN!;

// Tier limits
export const TIER_LIMITS: Record<
  SubscriptionTier,
  {
    questionsPerDay: number | null;
    documentsTotal: number;
    maxFileSizeBytes: number;
    apiRequestsPerMinute: number;
  }
> = {
  [SubscriptionTier.FREE]: {
    questionsPerDay: 10,
    documentsTotal: 5,
    maxFileSizeBytes: 5 * 1024 * 1024, // 5MB
    apiRequestsPerMinute: 30,
  },
  [SubscriptionTier.PRO]: {
    questionsPerDay: null, // unlimited
    documentsTotal: 100,
    maxFileSizeBytes: 25 * 1024 * 1024, // 25MB
    apiRequestsPerMinute: 60,
  },
  [SubscriptionTier.BUSINESS]: {
    questionsPerDay: null, // unlimited
    documentsTotal: 500,
    maxFileSizeBytes: 50 * 1024 * 1024, // 50MB
    apiRequestsPerMinute: 120,
  },
};

// Supported file types
export const SUPPORTED_FILE_TYPES = [
  "application/pdf",
  "text/plain",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
];

// Presigned URL expiry (seconds)
export const PRESIGNED_URL_EXPIRY = 3600;

// Chat
export const MAX_MESSAGE_LENGTH = 4000;
export const MAX_CONVERSATION_HISTORY = 20;

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 50;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Error Codes
export const ERROR_CODES = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  RATE_LIMITED: "RATE_LIMITED",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;
