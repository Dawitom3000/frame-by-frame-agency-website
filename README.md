# Discreet Connect

Discreet Connect is a privacy-first MVP for lawful adult companionship and dating in Addis Ababa. The product language, data model, and safety controls are intentionally designed to avoid facilitating exploitation, coercion, trafficking, underage use, illegal services, unsafe meetups, or non-consensual sharing.

The monorepo contains:

- `apps/mobile`: Expo React Native MVP with mock-first flows and API integration points.
- `apps/api`: Node.js, Express, TypeScript, Prisma, PostgreSQL, Redis, JWT auth, moderation routes, and tests.
- `apps/admin`: React web moderation dashboard.
- `packages/shared`: shared constants, Zod schemas, and TypeScript types.

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Copy environment values:

```bash
cp .env.example .env
```

3. Start PostgreSQL and Redis locally, then run Prisma:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run seed
```

4. Run the apps:

```bash
npm run dev:api
npm run dev:admin
npm run dev:mobile
```

## MVP Scope

Phase 1 implemented in this scaffold:

- Adult-only age gate and consent-first onboarding.
- Role onboarding for Customer and Companion.
- Companion discovery by broad Addis Ababa neighborhoods.
- Booking request flow using lawful, non-explicit meeting categories.
- Temporary chat mock in mobile and API routes for expiring chat.
- Privacy settings, quick exit screen, report/block flows.
- Admin moderation basics for verifications, reports, users, audit logs, and feature flags.
- Prisma schema, initial migration, and seed data for neighborhoods.

Phase 2 and Phase 3 are documented in [docs/ROADMAP.md](./docs/ROADMAP.md).

## Safety Positioning

This MVP is for lawful adult companionship and dating only. It bans minors, coercion, trafficking, threats, blackmail, doxxing, illegal services, explicit illegal offers, violence, scams, and unsafe meetups. It does not expose exact GPS, does not show map pins, does not publish ID documents, and does not make phone calls the default communication path.

Before any launch, the operator must complete local legal review in Ethiopia and disable any feature that is not lawful or safe in the target jurisdiction.

## Architecture Notes

- Authentication uses short-lived JWT access tokens and refresh-token rotation.
- Passwords are hashed with bcryptjs plus optional pepper.
- Sensitive contact handles and moderation evidence pointers are encrypted at rest.
- Chat text is encrypted at rest for MVP and expires through Redis TTL plus a scheduled deletion job.
- Reported chats preserve only necessary evidence in a moderation vault reference.
- Object storage is represented with storage keys and signed URL placeholders.
- End-to-end encryption is a Phase 3 upgrade path documented in [docs/SECURITY.md](./docs/SECURITY.md).

## Compliance Feature Flags

The API exposes admin-managed flags for:

- Price display.
- Booking availability.
- Off-app contact sharing.
- Customer verification before messaging.
- Companion verification before publishing.
- Data retention duration.
- Chat expiry and inactivity duration.

Defaults are conservative: price display is off, companion verification is required before publishing, and chat expiry is enabled.

## Tests

The API includes focused tests for:

- Adult-only auth policy.
- Booking permission boundaries.
- Chat expiry policy.
- Report preservation behavior.

Run:

```bash
npm run test -w apps/api
```

## Important Production Work Before Launch

- Complete Ethiopian legal review and local counsel sign-off.
- Replace placeholder liveness and ID verification with a vetted provider.
- Implement production object storage with KMS encryption and access logs.
- Implement E2EE for chat before handling highly sensitive conversations at scale.
- Add abuse operations playbooks and staff training.
- Run external security review and privacy impact assessment.
