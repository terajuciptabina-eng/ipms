# IPMS — Identity & Profiling Management System

**Current product focus: IPMS TUDM Edition.** The first implementation is being designed around the administrative identity and profiling needs of Tentera Udara Diraja Malaysia (TUDM). The platform architecture will remain extensible so it can be configured for other agencies in the future, but TDM, TLDM and other agency editions are not current development targets.

> **Development status:** foundation and mockup work in progress. This repository is currently public and contains software source/documentation only. Use synthetic records. Do not commit real personnel, visitor, credential, facility, operational or classified information. Production use requires written authorisation from the relevant agency, security/privacy review and an approved deployment environment.

## Current scope — TUDM

- Personnel identity and profile administration
- Organisation directory and configurable administrative categories
- Existing-card credential registry, subject to card compatibility assessment
- RFID reader adapter prototype for authorised test cards only
- Visitor and appointment administration
- Contractor and vehicle profiles
- Administrative request and approval workflows
- Simulated identity-event history
- Reporting, user/role administration and audit trail

Physical access decisions, gate/barrier control and integration with operational security systems are explicitly outside this prototype scope. The system must not be treated as an approved physical access-control system.

## Profile gallery mockup

A responsive static UI mockup with eight fictional profiles and illustrated avatars is available at:

- [Open profile gallery source](mockups/profiles/index.html)
- [View synthetic profile seed](database/seeds/003_tudm_demo_profiles.sql)
- [View avatar assets](assets/profiles/)

The profile gallery includes search and filters for category and status. The avatars are original vector illustrations, not photographs of real people. Every name, reference number, email, phone number, organisation label and profile detail is fictional and intended only for UI demonstration.

## Database files

Apply in this order:

1. `database/schema/001_initial.sql`
2. `database/migrations/002_configuration_extensions.sql`
3. `database/migrations/003_profile_avatar_path.sql`
4. `database/seeds/001_tudm_demo.sql`
5. `database/seeds/002_tudm_demo_permissions.sql`
6. `database/seeds/003_tudm_demo_profiles.sql`

The seed files create only a synthetic `tudm-demo` tenant. They do not contain actual TUDM personnel data. The SQL has been committed but has not yet been executed against a PostgreSQL instance.

## Future extensibility

Keep agency-specific terminology, profile fields, module switches, roles and workflow definitions configurable. Do not build TDM/TLDM editions now and do not introduce branch-specific hard-coded assumptions into shared domain logic. Future agency deployments must have separate tenant boundaries and independent approval, data-governance and deployment decisions.

## Architecture principles

1. **TUDM-first delivery:** prioritise TUDM administrative workflows and user experience now.
2. **Future-ready data model:** tenant ownership and configuration boundaries are designed in from the start, without building other agency editions prematurely.
3. **Tenant isolation:** every tenant-owned record is scoped server-side. Cross-tenant access must fail closed and be covered by automated tests.
4. **Configurable policy:** role assignments and approval definitions are configuration, not assumptions embedded in code.
5. **Credential abstraction:** retain existing cards only when their technology is confirmed compatible. A card UID alone is not proof of identity.
6. **Safe RFID prototype:** authorised test-card identification and simulated event logging only; no real access decisions.
7. **Data minimisation:** avoid storing raw card identifiers and unnecessary personal data.
8. **Approved deployment:** never host real agency data in this public repository, GitHub Pages or unapproved public cloud.

## Suggested technical foundation

- Web: React + TypeScript
- API: NestJS + TypeScript
- Database: PostgreSQL
- Device adapter: isolated service using documented vendor SDK / supported PC/SC interfaces where applicable
- API contracts: OpenAPI
- Tests: unit, integration and tenant-isolation tests
- Deployment: target to be selected by the authorised system owner

Start as a modular monolith with clear domain boundaries. Split services only when justified by verified requirements.

## Repository map

```
apps/web/                 # TUDM-first administration UI
apps/api/                 # modular application API
services/device-adapter/  # isolated, test-only reader adapter
packages/contracts/       # shared DTOs and API contracts
database/schema/          # PostgreSQL schema
database/migrations/      # versioned migrations
database/seeds/           # synthetic demo configuration and profiles only
assets/profiles/          # original synthetic vector avatars
mockups/profiles/         # static profile gallery mockup
docs/architecture/
docs/configuration/
docs/database/
docs/security/
tests/unit/
tests/integration/
tests/tenant-isolation/
```

## Development sequence

1. TUDM-first database foundation and tenant-safe configuration.
2. Authentication, roles and permissions.
3. Personnel identity and profile administration.
4. Visitor, contractor and vehicle administration.
5. RFID compatibility prototype after the existing card technology is confirmed.
6. Administrative workflows, audit, reporting and hybrid sync design.
7. Formal agency review and authorisation before any real-data pilot.

## Contribution rule

Before implementing a feature, document its TUDM workflow, module ownership, tenant scope, authorisation requirements, data sensitivity/retention and tests. Use synthetic data in every development fixture.

Do not add real personnel records, card numbers, facility details, network diagrams, security procedures or operational instructions to source control or public issue discussions.
