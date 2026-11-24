# Multi-agency architecture

## Goal
One maintained product can serve multiple independently configured agencies. TUDM, TDM and TLDM are example tenant profiles. They must not be compiled into separate code forks.

## Logical layers

1. **Experience layer** — tenant-aware web interface, organisation-specific branding, terminology and enabled modules.
2. **Application layer** — identity/profile, organisation directory, credential registry, visitor administration, contractor/vehicle profiles, workflow, reporting and audit domains.
3. **Tenant configuration layer** — validated configuration for profile schemas, module entitlements, workflow definitions, role mappings, labels, branding and data retention settings.
4. **Persistence layer** — PostgreSQL with tenant ownership on tenant-scoped records, migration versioning, audit history and transactional outbox for approved synchronisation.
5. **Integration boundary** — documented, permissioned adapters for identity providers, approved data imports/exports and test-only RFID readers.

## Isolation model

- Resolve tenant context from authenticated server-side identity and verified membership, never from an untrusted client-supplied tenant ID alone.
- Every tenant-owned row carries a tenant identifier. Enforce tenant scope in service/data access and PostgreSQL Row-Level Security where suitable.
- Platform operators and tenant administrators have separate permission sets.
- Cross-tenant reads/writes must fail closed and be covered by automated negative tests.
- Background jobs, exports, caches, object storage paths and audit queries must preserve tenant scope.
- Do not create a global personnel search across tenants by default.

## Configurable agency profile

Tenant configuration may define: display name and acronym; theme/logo; locale/timezone; organisation tree labels; profile categories; custom profile field definitions; module enablement; role/permission assignments; administrative workflow definitions; reports; retention periods; enabled credential metadata types; and approved integrations.

Configurations are schema-validated, versioned, audited and deployed as data/configuration. A configuration change must not rewrite another tenant's data.

## Hybrid deployment

The product may support a central service and authorised local nodes. Define which data classes may reside locally, which actions are allowed offline, conflict handling, synchronisation direction, key management, and recovery objectives with the system owner. Prototype only with synthetic records. Do not infer or encode actual base connectivity or physical-security arrangements.

## Reader boundary

Reader support is an adapter contract, not business logic. The prototype may read authorised test cards and record simulated events. Card technology and cryptographic capability must be confirmed before selecting a reader. Do not implement gate/barrier control or real access decisions in this repository.

## Deployment

Production target must be selected and approved by the owning agency. Public GitHub is for non-sensitive source and documentation only; never store actual personnel, credential or operational data here. Do not deploy the live system or its data to GitHub Pages or unapproved public hosting.