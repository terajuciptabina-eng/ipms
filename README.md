# IPMS — Configurable Identity & Profile Management System

A configurable, multi-agency identity and profile management platform foundation. The initial use case is an administrative profiling and credential-record prototype; the product must not be hard-coded to one military branch or agency.

> **Important:** This repository is a software-development scaffold only. Use synthetic records. Do not commit real personnel, visitor, credential, facility, operational, or classified information. Production use requires relevant agency authorisation, security review, privacy/data-governance approval, and an approved deployment environment.

## Product direction

The same platform can be configured for different organisations, including TUDM (Tentera Udara Diraja Malaysia), TDM (Tentera Darat Malaysia), TLDM (Tentera Laut Diraja Malaysia), and other authorised government departments or enterprises. These are configuration profiles over a shared platform, not separate code forks.

## Multi-agency design principles

1. **Shared core, configurable tenant:** agency identity, organisation hierarchy, profile categories, custom fields, module switches, branding, locale and workflow definitions are configuration, not hard-coded conditionals.
2. **Strong tenant separation:** every tenant-owned record is scoped to an organisation/tenant. Enforce scope in APIs and the database, test cross-tenant access denial, and separate platform administration from tenant administration.
3. **Policy-defined permissions:** role and permission assignments are configured per tenant. Do not assume one branch's rank structure, titles, approval chain, or access policy applies to another.
4. **Configuration versioning:** tenant configuration changes are versioned and audited; migrations must not silently overwrite customisations.
5. **Credential abstraction:** support pluggable credential types and reader adapters. Retaining an existing card depends on documented card technology and an authorised compatibility assessment. A card UID alone must not be treated as proof of identity.
6. **Safe prototype boundary:** reader integration is limited to authorised test-card identification and simulated event recording. No gate/barrier control, physical access decision, or operational security integration is included.
7. **Data minimisation:** keep credential references separate from profile data; avoid storing raw card identifiers where unnecessary. Use synthetic data in development.
8. **Deployment independence:** support approved central-and-local deployment patterns; never host real agency data in a public GitHub repository, GitHub Pages, or an unapproved public cloud.

## Configuration model (conceptual)

- `platform`: product-level feature catalogue and platform operators.
- `tenant`: an agency or organisation deployment.
- `tenant_profile`: display name, acronym, logo/theme, locale, timezone and terminology.
- `tenant_module`: enabled modules for that tenant.
- `profile_schema` / `profile_field`: tenant-defined profile categories and additional metadata fields.
- `workflow_definition`: configurable administrative workflow definitions.
- `role` / `permission`: tenant-scoped authorisation.
- `credential_type` / `credential_reference`: abstract credential metadata and protected reference.
- `reader_adapter`: vendor-neutral reader integration boundary for test environments.
- `audit_event`: append-oriented record of administrative and configuration changes.

Avoid tenant-specific hard-coded logic in shared services. Resolve settings through validated configuration with safe platform defaults.

## Initial modules

- Identity and organisation directory
- Personnel / member profiles
- Credential registry (metadata only)
- Visitor and appointment administration
- Contractor and vehicle profiles
- Administrative requests and approval workflows
- Simulated identity-event history
- Reports and exports
- Tenant, user, role and configuration administration
- Audit and synchronisation status

Modules can be enabled or disabled per tenant. New modules should use versioned module contracts.

## Suggested technical foundation

- Web: React + TypeScript
- API: NestJS + TypeScript
- Database: PostgreSQL
- Device adapter: isolated service using documented vendor SDK / supported PC/SC interfaces where applicable
- API contracts: OpenAPI
- Tests: unit, integration and tenant-isolation tests
- Delivery: CI checks; deployment target selected by the authorised system owner

Start as a modular monolith with clear domain boundaries. Split services only when justified by verified requirements.

## Repository map

```
apps/
  web/                    # tenant-aware administration UI
  api/                    # modular application API
services/
  device-adapter/         # isolated, test-only reader adapter boundary
packages/
  contracts/              # shared DTOs and API contracts
database/
  migrations/
  seeds/                  # synthetic demo data only
docs/
  architecture/
  configuration/
  database/
  security/
  operations/
tests/
  unit/
  integration/
  tenant-isolation/
```

## Development sequence

1. Architecture decisions, threat model, data classification and synthetic-data policy.
2. Tenant configuration model, tenant isolation and authentication/authorisation foundations.
3. Identity and profile administration.
4. Configurable modules and workflow engine.
5. Test-only RFID compatibility spike after card technology is confirmed.
6. Audit, reporting, sync design and security validation.
7. Formal review and authorisation before any real-data pilot or production integration.

## Agency configuration example

A TUDM deployment, TDM deployment and TLDM deployment may use different terminology and profile fields while sharing the same platform release. Each receives its own tenant configuration, module set, roles, approval definitions and data boundary. Do not copy real personnel data between tenants.

## Contribution rule

Before implementing a feature, document its domain/module, whether it is shared-core or tenant-configurable, authorisation and tenant-scope requirements, data sensitivity and retention requirements, and tests (especially negative cross-tenant tests).

Do not add real agency names, sensitive site details, personnel records, card numbers, network diagrams, or operational procedures to demo fixtures or public issue discussions.