export interface CognitoUser {
  sub: string;
  email: string;
  "cognito:username": string;
  "cognito:groups"?: string[];
  token_use: string;
  auth_time: number;
  iss: string;
  exp: number;
  iat: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: CognitoUser;
    }
  }
}

export enum SubscriptionTier {
  FREE = "free",
  PRO = "pro",
  BUSINESS = "business",
}

export enum DocumentStatus {
  PROCESSING = "processing",
  READY = "ready",
  FAILED = "failed",
}

export enum MessageRole {
  USER = "user",
  ASSISTANT = "assistant",
}

export interface User {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  selectedRole: string;
  tier: SubscriptionTier;
  stripeCustomerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  conversationId: string;
  userId: string;
  roleSlug: string;
  title: string;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  messageId: string;
  conversationId: string;
  userId: string;
  role: MessageRole;
  content: string;
  citations?: Citation[];
  createdAt: string;
}

export interface Citation {
  documentId: string;
  documentName: string;
  excerpt: string;
  pageNumber?: number;
  source: "shared" | "private";
}

export interface UserDocument {
  documentId: string;
  userId: string;
  roleSlug: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  description?: string;
  s3Key: string;
  status: DocumentStatus;
  createdAt: string;
}

export interface Subscription {
  subscriptionId: string;
  userId: string;
  stripeSubscriptionId: string;
  tier: SubscriptionTier;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UsageRecord {
  userId: string;
  date: string;
  questionsUsed: number;
  tier: SubscriptionTier;
}

export interface RoleConfig {
  slug: string;
  brandName: string;
  tagline: string;
  description: string;
  icon: string;
  primaryColor: string;
  secondaryColor: string;
  systemPrompt: string;
  features: string[];
  regulations: string[];
  jurisdiction: string;
  knowledgeBaseId?: string;
  available: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  lastEvaluatedKey?: Record<string, unknown>;
}

export interface ChatRequest {
  message: string;
  conversationId?: string;
  includePrivateDocs?: boolean;
}

export interface ChatResponse {
  conversationId: string;
  messageId: string;
  response: string;
  citations: Citation[];
  usage: {
    questionsUsedToday: number;
    questionsRemainingToday: number | null;
    tier: SubscriptionTier;
  };
}
