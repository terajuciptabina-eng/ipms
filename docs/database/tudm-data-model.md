# IPMS TUDM Edition — database foundation

## Current implementation scope

The first edition is TUDM-focused. The schema is tenant-aware to preserve a future extension path, but only a synthetic `tudm-demo` workspace is seeded. No other agency edition is being implemented now.

## Files

- `database/schema/001_initial.sql` — tenant, organisation, profile, credential metadata, test reader registry, simulated identity events, administrative requests, approvals, users, roles and audit events.
- `database/migrations/002_configuration_extensions.sql` — configurable profile fields, tenant permissions, role-permission assignments and versioned workflow definitions.
- `database/seeds/001_tudm_demo.sql` — synthetic TUDM-first demo configuration and sample categories/roles. It does not contain real personnel records.

## Main relationships

- One tenant owns its organisation units, profile categories, profile records, credential types, credentials, readers, requests, roles, permissions, workflows and audit events.
- A person profile belongs to one tenant and one profile category; its optional organisation unit must belong to the same tenant.
- A credential belongs to one profile and one credential type within the same tenant.
- Identity events may refer to a credential and a registered reader from the same tenant. Events are explicitly simulated/test-oriented.
- Administrative requests may refer to a profile; approval records are ordered steps for a request.
- Roles are assigned to application users within a tenant. Role permissions are tenant-scoped.
- Custom profile field definitions belong to a tenant and a profile category. Values are stored in the profile metadata object and must be validated against the active field schema by the API.

## Tenant isolation contract

The schema uses composite foreign keys to prevent cross-tenant relationships. Row-Level Security (RLS) is enabled and forced on tenant-owned tables. Policies require `app.tenant_id` to be set in the current transaction; if it is absent, tenant-scoped queries return no rows and writes are rejected.

API requirements:

1. Authenticate the user using the approved identity provider.
2. Verify the user's membership and permissions for the selected tenant on the server.
3. Begin a database transaction and set `SET LOCAL app.tenant_id = '<verified-tenant-uuid>'` using a parameterised, trusted server-side operation.
4. Execute all tenant-scoped queries in that transaction.
5. Use a database role that does not own the tables and does not have `BYPASSRLS`.
6. Never accept a tenant UUID or RLS context directly from an untrusted browser request without server-side membership verification.
7. Test absent tenant context, invalid membership, cross-tenant foreign keys, exports, background jobs and cache boundaries.

The `tenants` catalogue is platform-managed and intentionally does not have the same tenant RLS policy. It must not be exposed directly to ordinary users.

## Credential handling

`credentials.credential_reference_digest` is intended to hold a keyed digest/reference, not a raw card UID or card secret. The key must be held outside the repository and database, with documented rotation (`digest_key_version`). A plain unsalted hash is not sufficient for low-entropy card identifiers. Confirm the actual card technology and authentication capabilities before choosing a reader.

## Not yet implemented or verified

- No application API or UI is present yet.
- SQL has been committed but has not been executed against a PostgreSQL instance in this work session.
- No authentication provider, production key-management system, physical reader or live agency system is connected.
- The schema is a development foundation, not a production-ready security certification or official TUDM specification.