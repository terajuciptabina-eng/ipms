# Architecture decision records

## ADR-001: Shared multi-tenant product

**Status:** Accepted for foundation.

**Decision:** Build one configurable product serving multiple tenants. Agency differences are represented by tenant configuration rather than branch-specific forks.

**Reason:** Reduce duplicated maintenance while allowing controlled differences in terminology, profile schemas, modules, roles, workflows and reports.

## ADR-002: Modular monolith initially

**Status:** Accepted for foundation.

**Decision:** Begin with explicit domain modules in one deployable application. Define stable API contracts and adapter boundaries for future separation.

**Reason:** A solo/small development team can validate domain boundaries without introducing premature distributed-system complexity.

## ADR-003: Tenant isolation by default

**Status:** Accepted for foundation.

**Decision:** Tenant scope is enforced server-side and at the persistence boundary where supported. Cross-tenant access is denied by default and tested.

**Reason:** Agency-specific records and configuration must remain separate.

## ADR-004: Synthetic-only prototype

**Status:** Accepted.

**Decision:** All development and demonstration environments use synthetic data. Any real-data pilot requires written agency authorisation and an approved environment.

## ADR-005: RFID as a replaceable adapter

**Status:** Accepted for prototype boundary.

**Decision:** Implement a vendor-neutral reader adapter interface only after identifying the authorised test card technology. Initial scope is test-card identification and simulated event history, not physical access control.

**Reason:** Existing-card compatibility is technology-dependent and should not be assumed.