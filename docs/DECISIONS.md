# TradeAssist — Architecture Decision Records

## ADR-001: RAG over Fine-Tuning for LLM Customisation
- **Date**: 2026-03-09
- **Status**: Accepted
- **Context**: We need role-specific AI assistants that are grounded in current UK trade regulations and compliance documents. The two main approaches are fine-tuning a base model or using Retrieval-Augmented Generation (RAG).
- **Decision**: Use RAG with AWS Bedrock Knowledge Bases instead of fine-tuning.
- **Alternatives considered**:
  - **Fine-tuning**: More specialised responses but expensive ($$$), slow to iterate, requires training data curation, and difficult to keep up-to-date when regulations change.
  - **Prompt engineering only**: Cheapest but limited by context window size and no access to full regulation documents.
- **Consequences**:
  - ✅ Faster to iterate — just update documents in S3
  - ✅ Cheaper — no training costs, pay per query
  - ✅ Easy to keep current — swap/add documents when regulations change
  - ✅ Transparent — can cite exact source documents
  - ⚠️ Response quality depends on document chunking and retrieval quality
  - ⚠️ Slightly higher latency per query (retrieval + generation)

---

## ADR-002: AWS Bedrock as LLM Provider
- **Date**: 2026-03-09
- **Status**: Accepted
- **Context**: Need to choose an LLM provider for the chat assistant. Options include OpenAI, Anthropic direct, AWS Bedrock, or self-hosted open-source models.
- **Decision**: Use AWS Bedrock with Claude 3.5 Sonnet as the primary model.
- **Alternatives considered**:
  - **OpenAI GPT-4**: Strong model but adds external dependency outside AWS ecosystem.
  - **Anthropic direct API**: Good model but separate billing, no native AWS integration.
  - **Self-hosted (Llama)**: Full control but requires GPU infrastructure management, higher ops burden.
- **Consequences**:
  - ✅ Native AWS integration — same account, IAM, billing
  - ✅ Bedrock Knowledge Bases provide managed RAG pipeline
  - ✅ No GPU infrastructure to manage
  - ✅ User already has AWS access
  - ⚠️ Vendor lock-in to AWS ecosystem
  - ⚠️ Model selection limited to what Bedrock offers

---

## ADR-003: Per-User Private Knowledge Bases
- **Date**: 2026-03-09
- **Status**: Accepted
- **Context**: Users want to upload their own documents (customer bills, project specs, company procedures) to get personalised AI assistance alongside the shared role regulations.
- **Decision**: Implement a two-layer knowledge base system — shared role KBs (admin-managed) + user private document storage with metadata filtering.
- **Alternatives considered**:
  - **Single KB per user**: Maximum isolation but extremely expensive (one OpenSearch collection per user).
  - **Shared KB with no user docs**: Simpler but doesn't meet the requirement.
  - **External vector DB (Pinecone, Weaviate)**: More flexibility but adds external dependency.
- **Consequences**:
  - ✅ Users get personalised assistance based on their own documents
  - ✅ Shared regulations are maintained centrally
  - ✅ Cost-effective — single OpenSearch collection with metadata filtering
  - ⚠️ Need careful metadata tagging to ensure data isolation between users
  - ⚠️ KB sync latency — uploaded documents take time to become searchable

---

## ADR-004: Individual Branding Per Role (Multi-Brand SaaS)
- **Date**: 2026-03-09
- **Status**: Accepted
- **Context**: Each trade role should feel like its own dedicated product (SparkAssist for electricians, PipeAssist for plumbers, etc.) rather than a generic platform with role selection.
- **Decision**: Single codebase with dynamic theming driven by role configuration. Each role can have its own domain, colours, landing page content, and system prompt.
- **Alternatives considered**:
  - **Separate codebases per role**: Maximum customisation but unmaintainable at scale.
  - **Single brand with role tabs**: Simpler but less compelling marketing and SEO.
  - **White-label platform**: Over-engineered for current needs.
- **Consequences**:
  - ✅ Each role feels like a dedicated product — better marketing and SEO
  - ✅ Single codebase — one deployment, shared infrastructure
  - ✅ Easy to add new roles — just add a config JSON
  - ✅ Individual domains possible for each brand
  - ⚠️ Theming system needs to be robust and well-tested
  - ⚠️ SEO requires per-role meta tags, structured data, and landing page content

---

## ADR-005: Freemium Pricing Model with Stripe
- **Date**: 2026-03-09
- **Status**: Accepted
- **Context**: Need a monetisation strategy that allows users to try the product before paying, while generating revenue from power users.
- **Decision**: Three-tier freemium model (Free / Pro £9.99/mo / Business £29.99/mo) with Stripe for payment processing.
- **Alternatives considered**:
  - **Pay-per-query**: Unpredictable costs for users, harder to market.
  - **Free trial then paid**: Higher barrier to entry, lower conversion.
  - **Ads-supported free tier**: Poor UX for professional tool, low revenue.
- **Consequences**:
  - ✅ Low barrier to entry — users can try before buying
  - ✅ Predictable revenue from subscriptions
  - ✅ Stripe handles PCI compliance, invoicing, and subscription lifecycle
  - ⚠️ Need to carefully balance free tier limits to drive conversion
  - ⚠️ Stripe fees (2.9% + 30p per transaction)

---

## ADR-006: Express Monolith on Lambda (Not Microservices)
- **Date**: 2026-03-09
- **Status**: Accepted
- **Context**: Need to decide on the backend architecture — monolith vs microservices for the API layer.
- **Decision**: Single Express application deployed as a Lambda function via serverless-http, following the project's established patterns.
- **Alternatives considered**:
  - **Individual Lambda per endpoint**: Better isolation but more complex deployment and cold starts.
  - **ECS/Fargate containers**: More control but higher cost and ops overhead for MVP.
  - **API Gateway direct integrations**: No code for simple CRUD but limited for complex logic.
- **Consequences**:
  - ✅ Simple deployment — one Lambda function
  - ✅ Familiar Express patterns — easy to develop and test locally
  - ✅ Consistent with project's established backend rules
  - ⚠️ Cold start latency (mitigated with provisioned concurrency if needed)
  - ⚠️ Single function size limit (250MB deployed)

---

## ADR-007: UK-First Geographic Strategy
- **Date**: 2026-03-09
- **Status**: Accepted
- **Context**: Trade regulations vary significantly by country and jurisdiction. Need to decide which market to target first.
- **Decision**: Launch with UK (England & Wales) regulations first, then expand to Ireland, Australia, USA, Canada, and EU.
- **Alternatives considered**:
  - **USA first**: Larger market but complex (50 states with different regulations).
  - **Multi-country from day one**: Too much content to curate for MVP.
- **Consequences**:
  - ✅ Focused content curation — UK regulations are well-documented
  - ✅ Smaller, manageable scope for MVP
  - ✅ English-language only for initial launch
  - ⚠️ Limited initial market size
  - ⚠️ Need to design for geographic expansion from the start (jurisdiction field in role config)

---

## ADR-008: OpenSearch Serverless for Vector Store
- **Date**: 2026-03-09
- **Status**: Accepted
- **Context**: Bedrock Knowledge Bases require a vector store backend. Options include OpenSearch Serverless, Aurora PostgreSQL (pgvector), Pinecone, or Redis.
- **Decision**: Use OpenSearch Serverless as the vector store, managed by Bedrock Knowledge Bases.
- **Alternatives considered**:
  - **Aurora PostgreSQL with pgvector**: Good but requires VPC, provisioned capacity, more ops.
  - **Pinecone**: Excellent vector DB but external dependency, additional cost.
  - **Redis (MemoryDB)**: Fast but less mature for vector search.
- **Consequences**:
  - ✅ Fully managed by Bedrock KB — no infrastructure to manage
  - ✅ Native AWS integration
  - ✅ Serverless — scales automatically
  - ⚠️ OpenSearch Serverless has a minimum cost (~$700/month for 2 OCUs)
  - ⚠️ Less control over indexing and search parameters

---

## ADR-009: S3 + CloudFront with OAC for Frontend Hosting
- **Date**: 2026-03-09
- **Status**: Accepted
- **Context**: Need to host the React SPA with support for multiple custom domains (one per role brand).
- **Decision**: S3 bucket with CloudFront distribution using Origin Access Control (OAC). CloudFront Functions handle domain-based routing.
- **Alternatives considered**:
  - **Amplify Hosting**: Simpler but less control over CloudFront configuration.
  - **Vercel/Netlify**: External hosting, not AWS-native.
  - **ECS/Fargate with SSR**: Over-engineered for SPA, higher cost.
- **Consequences**:
  - ✅ No public S3 access — secure OAC configuration
  - ✅ Global CDN with edge caching
  - ✅ Multiple custom domains on single distribution
  - ✅ Per project infrastructure rules
  - ⚠️ SPA routing requires CloudFront error page configuration (404 → index.html)
  - ⚠️ No server-side rendering (SEO handled via pre-rendering or meta tags)

---

## ADR-010: DynamoDB Single-Table Design Consideration
- **Date**: 2026-03-09
- **Status**: Accepted
- **Context**: Need to decide on DynamoDB table strategy — single table design vs multiple tables.
- **Decision**: Use multiple tables (one per entity type) for clarity and maintainability at this stage, with GSIs for access patterns.
- **Alternatives considered**:
  - **Single table design**: More efficient for DynamoDB but complex to design and maintain, harder for new developers.
  - **RDS/Aurora**: Relational model but not serverless-first, higher cost.
- **Consequences**:
  - ✅ Easier to understand and maintain
  - ✅ Clear separation of concerns
  - ✅ Simpler backup and restore per table
  - ⚠️ Multiple table reads for cross-entity queries (mitigated with GSIs)
  - ⚠️ Could migrate to single-table design later if performance requires it
