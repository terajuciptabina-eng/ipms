-- IPMS PostgreSQL foundation schema
-- Synthetic-development baseline. Review and approve before any production use.
-- No physical access-control decisions or gate/barrier integrations are implemented here.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_key TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','suspended','archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE tenant_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  version INTEGER NOT NULL CHECK (version > 0),
  schema_version INTEGER NOT NULL CHECK (schema_version > 0),
  configuration JSONB NOT NULL CHECK (jsonb_typeof(configuration) = 'object'),
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, version)
);

CREATE TABLE organisation_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  parent_id UUID,
  unit_code TEXT NOT NULL,
  unit_name TEXT NOT NULL,
  unit_type TEXT NOT NULL DEFAULT 'organisation',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, id),
  UNIQUE (tenant_id, unit_code),
  FOREIGN KEY (tenant_id, parent_id) REFERENCES organisation_units(tenant_id, id)
);

CREATE TABLE profile_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  category_key TEXT NOT NULL,
  label TEXT NOT NULL,
  description TEXT,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, id),
  UNIQUE (tenant_id, category_key)
);

CREATE TABLE person_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  profile_reference TEXT NOT NULL,
  category_id UUID NOT NULL,
  organisation_unit_id UUID,
  display_name TEXT NOT NULL,
  preferred_name TEXT,
  profile_status TEXT NOT NULL DEFAULT 'pending' CHECK (profile_status IN ('pending','active','inactive','suspended','archived')),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(metadata) = 'object'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, id),
  UNIQUE (tenant_id, profile_reference),
  FOREIGN KEY (tenant_id, category_id) REFERENCES profile_categories(tenant_id, id),
  FOREIGN KEY (tenant_id, organisation_unit_id) REFERENCES organisation_units(tenant_id, id)
);

CREATE TABLE credential_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  type_key TEXT NOT NULL,
  label TEXT NOT NULL,
  technology_notes TEXT,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, id),
  UNIQUE (tenant_id, type_key)
);

CREATE TABLE credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  person_profile_id UUID NOT NULL,
  credential_type_id UUID NOT NULL,
  credential_reference_digest TEXT NOT NULL,
  digest_key_version TEXT NOT NULL,
  credential_status TEXT NOT NULL DEFAULT 'pending' CHECK (credential_status IN ('pending','active','revoked','expired','lost')),
  valid_from TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, id),
  UNIQUE (tenant_id, credential_reference_digest),
  FOREIGN KEY (tenant_id, person_profile_id) REFERENCES person_profiles(tenant_id, id),
  FOREIGN KEY (tenant_id, credential_type_id) REFERENCES credential_types(tenant_id, id),
  CHECK (valid_until IS NULL OR valid_from IS NULL OR valid_until > valid_from)
);

CREATE TABLE reader_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  reader_reference TEXT NOT NULL,
  adapter_type TEXT NOT NULL,
  vendor_name TEXT,
  model_name TEXT,
  environment_label TEXT NOT NULL DEFAULT 'test' CHECK (environment_label IN ('test','approved_nonproduction','production')),
  reader_status TEXT NOT NULL DEFAULT 'registered' CHECK (reader_status IN ('registered','disabled','retired')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, id),
  UNIQUE (tenant_id, reader_reference)
);

CREATE TABLE identity_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  credential_id UUID,
  reader_id UUID,
  event_type TEXT NOT NULL CHECK (event_type IN ('test_card_read','profile_lookup','simulated_check_in','simulated_check_out','administrative_review')),
  event_result TEXT NOT NULL CHECK (event_result IN ('recorded','unmatched','rejected','error')),
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  correlation_reference UUID NOT NULL DEFAULT gen_random_uuid(),
  details JSONB NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(details) = 'object'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, credential_id) REFERENCES credentials(tenant_id, id),
  FOREIGN KEY (tenant_id, reader_id) REFERENCES reader_registry(tenant_id, id)
);

CREATE TABLE administrative_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  request_reference TEXT NOT NULL,
  request_type TEXT NOT NULL,
  subject_profile_id UUID,
  request_status TEXT NOT NULL DEFAULT 'submitted' CHECK (request_status IN ('draft','submitted','under_review','approved','rejected','cancelled','closed')),
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, id),
  UNIQUE (tenant_id, request_reference),
  FOREIGN KEY (tenant_id, subject_profile_id) REFERENCES person_profiles(tenant_id, id)
);

CREATE TABLE approval_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  request_id UUID NOT NULL,
  step_number INTEGER NOT NULL CHECK (step_number > 0),
  decision TEXT NOT NULL CHECK (decision IN ('pending','approved','rejected','returned','cancelled')),
  decision_note TEXT,
  decided_by UUID,
  decided_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  FOREIGN KEY (tenant_id, request_id) REFERENCES administrative_requests(tenant_id, id),
  UNIQUE (tenant_id, request_id, step_number)
);

CREATE TABLE application_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  external_identity_subject TEXT NOT NULL,
  display_name TEXT NOT NULL,
  account_status TEXT NOT NULL DEFAULT 'invited' CHECK (account_status IN ('invited','active','disabled','locked')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, id),
  UNIQUE (tenant_id, external_identity_subject)
);

CREATE TABLE tenant_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  role_key TEXT NOT NULL,
  role_name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, id),
  UNIQUE (tenant_id, role_key)
);

CREATE TABLE user_role_assignments (
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  user_id UUID NOT NULL,
  role_id UUID NOT NULL,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (tenant_id, user_id, role_id),
  FOREIGN KEY (tenant_id, user_id) REFERENCES application_users(tenant_id, id),
  FOREIGN KEY (tenant_id, role_id) REFERENCES tenant_roles(tenant_id, id)
);

CREATE TABLE audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  actor_user_id UUID,
  action_key TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_reference TEXT,
  outcome TEXT NOT NULL CHECK (outcome IN ('success','denied','failure')),
  correlation_reference UUID NOT NULL DEFAULT gen_random_uuid(),
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  safe_metadata JSONB NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(safe_metadata) = 'object'),
  FOREIGN KEY (tenant_id, actor_user_id) REFERENCES application_users(tenant_id, id)
);

CREATE INDEX idx_person_profiles_tenant_status ON person_profiles(tenant_id, profile_status);
CREATE INDEX idx_person_profiles_tenant_category ON person_profiles(tenant_id, category_id);
CREATE INDEX idx_credentials_tenant_profile ON credentials(tenant_id, person_profile_id);
CREATE INDEX idx_identity_events_tenant_time ON identity_events(tenant_id, occurred_at DESC);
CREATE INDEX idx_admin_requests_tenant_status ON administrative_requests(tenant_id, request_status);
CREATE INDEX idx_audit_events_tenant_time ON audit_events(tenant_id, occurred_at DESC);

-- Tenant isolation is enforced in application services and should additionally
-- be implemented with PostgreSQL Row-Level Security before any non-demo deployment.
-- RLS policies require a trusted server-set tenant context and a non-owner DB role.
-- Do not assume this schema alone is a production security approval.