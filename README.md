# IPMS — Identity & Profiling Management System

**Current product focus: IPMS TUDM Edition.** The current public prototype is a TUDM-first administrative identity and profiling workspace. The platform architecture is intended to remain configurable for other agencies in the future; TDM, TLDM and other agency editions are not current development targets.

> **Status:** interactive browser prototype / mockup. It is not an operational system, not an official TUDM system, and not approved for real personnel data. Use synthetic records only. Production use requires formal agency authorisation, security and privacy review, approved infrastructure, and a production implementation.

## Open the prototype

GitHub Pages: https://terajuciptabina-eng.github.io/ipms/

The prototype currently includes:

- Dashboard with synthetic profile counts and recent activity
- Personnel, visitor and contractor profile directory
- Profile detail, create and update workflows
- Visitor and contractor filtered views
- Administrative request creation and simulated approve/reject decisions
- Test-only credential metadata registry using fictional references
- Illustrative users and role display
- CSV exports for profiles, requests, credential metadata and audit events
- Browser-local activity log and configurable demo organisation label
- Responsive layout for desktop, tablet and mobile browsers

## Demo data and storage

- Eight fictional profile records and eight original vector avatar illustrations are supplied.
- Names, reference numbers, emails, phone numbers, organisations and events are synthetic.
- Changes are stored in the current browser's localStorage. They are not synchronised across users or devices.
- The reset option restores the original synthetic sample dataset.
- CSV exports contain only the current browser's demo data.

## Important limitations

This is a static HTML/CSS/JavaScript prototype. It does **not** currently provide:
- Backend API or PostgreSQL connection
- Real authentication, account recovery, session management or server-side role enforcement
- Multi-user collaboration, central/local synchronisation or server-side audit guarantees
- Real credential enrolment, RFID reading, UID processing, reader control or physical access decisions
- Official TUDM approval, integration or production security controls

The card module is metadata-only and uses fictional test references. It must not be connected to gate/barrier controllers or operational security systems.

## Database foundation

PostgreSQL schema and migration drafts are retained under `database/`. They have not been executed against a PostgreSQL instance and are not production-certified. Apply order is documented in the database section below and in the SQL file comments. Tenant isolation policies require a trusted API to authenticate users and set the tenant context transaction-locally; browser code must never set that context.

## Architecture direction

The intended future implementation is a modular monolith with:
- Web application: React + TypeScript
- API: NestJS + TypeScript
- Database: PostgreSQL
- API contracts: OpenAPI
- Automated unit, integration and tenant-isolation tests
- Isolated device adapter only for approved non-production test hardware after card technology compatibility is confirmed

The current static prototype is deliberately not a substitute for that backend architecture.

## Safety and data governance

1. Keep all public repository fixtures synthetic.
2. Never commit actual TUDM personnel, visitor, credential, facility, operational or classified information.
3. Do not store raw card identifiers or unnecessary personal data.
4. A card UID alone is not proof of identity. Existing card compatibility must be assessed by frequency, chip, protocol and authentication method before selecting reader hardware.
5. Keep RFID work test-only and separate from physical access decision systems.
6. Production data must only be handled in infrastructure explicitly approved by the agency.
7. Agency-specific profile fields, roles, workflows and module switches should be configurable rather than hard-coded into shared domain logic.

## Repository map

```
index.html                 # GitHub Pages application shell
app.js                     # interactive browser prototype
assets/profiles/           # synthetic vector avatar illustrations
mockups/profiles/          # earlier standalone profile gallery
database/schema/           # PostgreSQL schema draft
database/migrations/       # versioned schema changes
database/seeds/            # synthetic demo tenant and records
tests/                     # Playwright browser tests
.github/workflows/         # browser test and Pages deployment workflows
docs/                      # architecture, configuration, security notes
```

## Browser test coverage

GitHub Actions runs Playwright/Chromium tests for dashboard navigation, profile search and filters, profile detail and edit, administrative request creation and simulated review, demo credential metadata, role display, reports, audit events and mobile layout.

## Development sequence

1. Complete the TUDM-first administrative prototype and validate workflows with synthetic data.
2. Review and execute database migrations in a controlled development PostgreSQL environment.
3. Implement backend authentication, authorisation, API contracts and server-side tenant isolation.
4. Add visitor, contractor, vehicle and appointment administration with approved requirements.
5. Assess existing card technology before any test-only reader integration.
6. Complete security, privacy, operational and agency approval before any real-data pilot.

**Do not use this public prototype for real TUDM records or operational access control.**
