# Development data and security policy

## Repository classification

This repository is currently public. It may contain generic software source, architecture patterns and synthetic examples only. Do not commit real personnel records, visitor details, card identifiers, credentials, site/facility details, network topology, security procedures, classified information, or agency operational data.

## Required before real deployment

- Written authorisation from the owning agency and system owner.
- Data classification, privacy impact and records-retention assessment.
- Threat model and independent security review.
- Approved hosting, identity provider, encryption/key management, backup and incident-response arrangements.
- Security testing of tenant isolation, authentication, authorisation, audit logging and data export.
- Formal approval for every external integration and any use of physical credentials.

## Credential handling

- Use fake test credentials in development.
- Do not place raw card UIDs or card secrets in logs, screenshots, issue reports or source control.
- Use a keyed, protected reference where a stable correlation token is needed; keep keys outside the repository and application database where practical.
- UID-only card matching is not strong proof of identity. Evaluate documented authentication features of the specific card technology under an authorised test plan.
- Do not implement physical access decisions or gate/barrier control in this prototype.

## Logging and audit

Record administrative actions and configuration changes with actor, tenant, action, timestamp, outcome and correlation reference. Avoid logging unnecessary personal data or credential secrets. Protect audit records from ordinary application-user modification.

## Public issue/PR hygiene

Use synthetic identifiers and generic descriptions. Do not upload photographs of cards, passes, screens containing real identities, internal documents or facility diagrams.