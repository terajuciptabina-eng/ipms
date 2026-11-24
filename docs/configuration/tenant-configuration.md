# Tenant configuration contract (draft)

Tenant configuration is the product's extension point. It allows different branches/agencies to customise the same platform without code forks.

## Example (synthetic only)

```json
{
  "schemaVersion": 1,
  "tenantKey": "agency-demo",
  "profile": {
    "displayName": "Agency Demo",
    "shortName": "DEMO",
    "locale": "ms-MY",
    "timeZone": "Asia/Kuala_Lumpur",
    "terminology": {
      "person": "Member",
      "organisation": "Organisation",
      "visitor": "Visitor"
    }
  },
  "modules": {
    "identity": true,
    "personnelProfiles": true,
    "visitorAdministration": true,
    "contractorProfiles": true,
    "vehicleProfiles": false,
    "credentialRegistry": true,
    "approvalWorkflow": true,
    "reports": true
  },
  "profileCategories": ["member", "visitor", "contractor"],
  "customFields": [],
  "workflowDefinitions": [],
  "credentialTypes": ["rfid-card"],
  "retentionPolicyKey": "default-demo"
}
```

## Validation rules

- `tenantKey` is stable, unique and immutable after activation.
- `schemaVersion` is mandatory; migrations must be explicit and reversible where possible.
- Unknown module keys are rejected rather than silently enabled.
- Custom field keys are stable machine identifiers; labels are localisable.
- Field types are allow-listed (text, date, boolean, enum, number). No executable code or arbitrary SQL in configuration.
- Workflow definitions use a constrained declarative schema; no eval, arbitrary scripts or untrusted plugin code.
- Configuration changes require an authorised tenant administrator and produce an audit event.
- No configuration field should contain card secrets, private keys, passwords, actual personnel details, or sensitive operational instructions.

## Branch-agnostic rules

Do not hard-code branch names, rank structures, unit structures, terminology, approval chains, credential formats or record categories in shared business logic. Supply them as tenant-owned configuration and validate them against platform policy.