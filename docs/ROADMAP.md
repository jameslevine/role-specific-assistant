# TradeAssist — Project Roadmap

## Project Overview

TradeAssist is a multi-tenant SaaS platform that provides AI-powered personal assistants tailored to specific trade and professional roles. Each role (electrician, plumber, bricklayer, etc.) gets its own branded product (e.g., SparkAssist, PipeAssist, BrickAssist) with a dedicated landing page and AI assistant powered by RAG (Retrieval-Augmented Generation) using AWS Bedrock. The assistants are grounded in the latest UK regulations, compliance standards, and professional documentation, with users also able to upload their own private documents for personalised assistance.

## Goals & Success Criteria

- **MVP Launch**: 5 role-specific assistants live with UK regulations
- **User Acquisition**: 500 free-tier users within first 3 months
- **Conversion Rate**: 5% free-to-paid conversion
- **Response Quality**: 90%+ user satisfaction on AI responses
- **Compliance Accuracy**: Responses cite correct, current regulations
- **Uptime**: 99.9% availability

---

## Milestones

### Phase 1: Foundation (Weeks 1-3)
> Project setup, infrastructure, authentication, and core backend

| # | Feature | Priority | Status |
|---|---------|----------|--------|
| 1.1 | Project documentation & architecture | P0 | 🟡 In Progress |
| 1.2 | AWS Infrastructure (SAM/CloudFormation) | P0 | 🔴 Not Started |
| 1.3 | Cognito authentication setup | P0 | 🔴 Not Started |
| 1.4 | DynamoDB table design & creation | P0 | 🔴 Not Started |
| 1.5 | Backend Express Lambda scaffold | P0 | 🔴 Not Started |
| 1.6 | User management API (CRUD) | P0 | 🔴 Not Started |
| 1.7 | Frontend React scaffold with auth flows | P0 | 🔴 Not Started |
| 1.8 | Role configuration system | P0 | 🔴 Not Started |

### Phase 2: RAG Engine (Weeks 3-5)
> Bedrock Knowledge Bases, document ingestion, chat API

| # | Feature | Priority | Status |
|---|---------|----------|--------|
| 2.1 | Bedrock Knowledge Base setup (shared role KBs) | P0 | 🔴 Not Started |
| 2.2 | S3 document storage structure | P0 | 🔴 Not Started |
| 2.3 | Document ingestion pipeline (admin) | P0 | 🔴 Not Started |
| 2.4 | Chat API with Bedrock RAG | P0 | 🔴 Not Started |
| 2.5 | Streaming response support | P1 | 🔴 Not Started |
| 2.6 | Conversation history (DynamoDB) | P0 | 🔴 Not Started |
| 2.7 | Role-specific system prompts | P0 | 🔴 Not Started |
| 2.8 | Frontend chat interface | P0 | 🔴 Not Started |
| 2.9 | User private document upload & KB | P1 | 🔴 Not Started |
| 2.10 | Document management UI (upload/view/delete) | P1 | 🔴 Not Started |

### Phase 3: Role System & Landing Pages (Weeks 5-7)
> Multi-brand system, landing pages, role onboarding

| # | Feature | Priority | Status |
|---|---------|----------|--------|
| 3.1 | Role configuration JSON schema | P0 | 🔴 Not Started |
| 3.2 | Dynamic theming system (per role) | P0 | 🔴 Not Started |
| 3.3 | Landing page template (responsive) | P0 | 🔴 Not Started |
| 3.4 | SparkAssist (Electrician) landing page & KB | P0 | 🔴 Not Started |
| 3.5 | PipeAssist (Plumber) landing page & KB | P0 | 🔴 Not Started |
| 3.6 | BrickAssist (Bricklayer) landing page & KB | P0 | 🔴 Not Started |
| 3.7 | TimberAssist (Carpenter) landing page & KB | P0 | 🔴 Not Started |
| 3.8 | BrushAssist (Painter) landing page & KB | P0 | 🔴 Not Started |
| 3.9 | SEO optimization per landing page | P1 | 🔴 Not Started |
| 3.10 | Role onboarding flow | P1 | 🔴 Not Started |

### Phase 4: Monetization & Polish (Weeks 7-9)
> Stripe billing, usage tracking, tier enforcement

| # | Feature | Priority | Status |
|---|---------|----------|--------|
| 4.1 | Stripe integration (subscriptions) | P0 | 🔴 Not Started |
| 4.2 | Free/Pro/Business tier enforcement | P0 | 🔴 Not Started |
| 4.3 | Usage tracking & rate limiting | P0 | 🔴 Not Started |
| 4.4 | Billing management UI | P0 | 🔴 Not Started |
| 4.5 | Document upload limits per tier | P1 | 🔴 Not Started |
| 4.6 | Analytics dashboard (admin) | P2 | 🔴 Not Started |
| 4.7 | CloudWatch monitoring & alarms | P1 | 🔴 Not Started |

### Phase 5: Launch & Iterate (Weeks 9-10)
> Testing, optimization, soft launch

| # | Feature | Priority | Status |
|---|---------|----------|--------|
| 5.1 | E2E testing (Cypress) | P0 | 🔴 Not Started |
| 5.2 | Performance optimization | P1 | 🔴 Not Started |
| 5.3 | SEO & meta tags for all landing pages | P1 | 🔴 Not Started |
| 5.4 | Beta user onboarding | P0 | 🔴 Not Started |
| 5.5 | Feedback collection system | P1 | 🔴 Not Started |
| 5.6 | Documentation & user guides | P1 | 🔴 Not Started |

---

## Future Phases

### Phase 6: Geographic Expansion
- Ireland regulations
- Australia regulations
- USA (state-by-state, starting California/Texas/Florida)
- Canada (provincial)
- EU (Germany, France, Netherlands — requires i18n)

### Phase 7: Additional Roles (Phase 2 Roles)
- Scaffolder (ScaffAssist)
- Gas Engineer (FlameAssist)
- HVAC Technician (ClimateAssist)
- Roofer (RoofAssist)
- Glazier (GlassAssist)
- Tiler (TileAssist)
- Plasterer (PlasterAssist)
- Welder (WeldAssist)
- Landscaper (GreenAssist)
- Fire Alarm Engineer (AlarmAssist)

### Phase 8: Professional Services Roles
- Architect, Structural Engineer, Building Inspector, Estate Agent, Quantity Surveyor

### Phase 9: Advanced Features
- Mobile app (React Native / Expo)
- Voice assistant integration
- AR/camera features (point at wiring, get guidance)
- Team collaboration features
- Compliance audit report generation
- Integration with trade management software

---

## Completed Tasks

| Date | Task | Notes |
|------|------|-------|
| 2026-03-09 | Project planning & requirements gathering | Defined architecture, role list, pricing model |
