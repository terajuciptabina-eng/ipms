-- IPMS migration 002: configurable TUDM administration foundations
-- Apply after database/schema/001_initial.sql.
-- Development baseline only; review before production.

CREATE TABLE custom_profile_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  category_id UUID NOT NULL,
  field_key TEXT NOT NULL,
  field_label TEXT NOT NULL,
  data_type TEXT NOT NULL CHECK (data_type IN ('text','date','boolean','number','enum')),
  is_required BOOLEAN NOT NULL DEFAULT false,
  is_sensitive BOOLEAN NOT NULL DEFAULT false,
  options JSONB NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(options) = 'array'),
  display_order INTEGER NOT NULL DEFAULT 0,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, id),
  UNIQUE (tenant_id, category_id, field_key),
  FOREIGN KEY (tenant_id, category_id) REFERENCES profile_categories(tenant_id, id)
);

CREATE TABLE tenant_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  permission_key TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, id),
  UNIQUE (tenant_id, permission_key)
);

CREATE TABLE role_permissions (
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  role_id UUID NOT NULL,
  permission_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (tenant_id, role_id, permission_id),
  FOREIGN KEY (tenant_id, role_id) REFERENCES tenant_roles(tenant_id, id),
  FOREIGN KEY (tenant_id, permission_id) REFERENCES tenant_permissions(tenant_id, id)
);

CREATE TABLE workflow_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  workflow_key TEXT NOT NULL,
  workflow_name TEXT NOT NULL,
  version INTEGER NOT NULL CHECK (version > 0),
  definition JSONB NOT NULL CHECK (jsonb_typeof(definition) = 'object'),
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, id),
  UNIQUE (tenant_id, workflow_key, version)
);

CREATE INDEX idx_custom_fields_tenant_category ON custom_profile_fields(tenant_id, category_id);
CREATE INDEX idx_workflows_tenant_enabled ON workflow_definitions(tenant_id, is_enabled);

-- Enforce fail-closed tenant scope for every new tenant-owned table.
DO $$
DECLARE table_name TEXT;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'custom_profile_fields', 'tenant_permissions', 'role_permissions', 'workflow_definitions'
  ] LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', table_name);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY', table_name);
    EXECUTE format(
      'CREATE POLICY tenant_isolation ON %I USING (tenant_id = NULLIF(current_setting(''app.tenant_id'', true), '''')::uuid) WITH CHECK (tenant_id = NULLIF(current_setting(''app.tenant_id'', true), '''')::uuid)',
      table_name
    );
  END LOOP;
END $$;

-- The trusted API must set app.tenant_id transaction-locally after checking
-- authenticated membership. Never accept this setting directly from a client.