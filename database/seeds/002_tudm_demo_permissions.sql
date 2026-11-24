-- Synthetic TUDM demo permission catalogue. Not official policy.
BEGIN;
SET LOCAL app.tenant_id = '11111111-1111-4111-8111-111111111111';

INSERT INTO tenant_permissions (tenant_id, permission_key, description)
SELECT t.id, p.permission_key, p.description
FROM tenants t
CROSS JOIN (VALUES
  ('profiles.read', 'Read permitted profile records'),
  ('profiles.create', 'Create profile records'),
  ('profiles.update', 'Update permitted profile records'),
  ('credentials.read', 'Read credential registry metadata'),
  ('credentials.manage', 'Manage credential registry metadata'),
  ('visitors.manage', 'Manage visitor administration records'),
  ('contractors.manage', 'Manage contractor profile records'),
  ('vehicles.manage', 'Manage vehicle profile records'),
  ('requests.review', 'Review administrative requests'),
  ('reports.read', 'Read authorised reports'),
  ('configuration.manage', 'Manage tenant configuration'),
  ('audit.read', 'Read authorised audit events')
) AS p(permission_key, description)
WHERE t.tenant_key = 'tudm-demo'
ON CONFLICT (tenant_id, permission_key) DO NOTHING;

-- Illustrative least-privilege mappings for the demo only; replace with approved TUDM policy.
INSERT INTO role_permissions (tenant_id, role_id, permission_id)
SELECT r.tenant_id, r.id, p.id
FROM tenant_roles r
JOIN tenant_permissions p ON p.tenant_id = r.tenant_id
WHERE r.role_key = 'system_admin'
  AND r.tenant_id = (SELECT id FROM tenants WHERE tenant_key = 'tudm-demo')
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (tenant_id, role_id, permission_id)
SELECT r.tenant_id, r.id, p.id
FROM tenant_roles r
JOIN tenant_permissions p ON p.tenant_id = r.tenant_id
WHERE r.role_key = 'profile_admin'
  AND p.permission_key IN ('profiles.read','profiles.create','profiles.update','credentials.read','credentials.manage','visitors.manage','contractors.manage','vehicles.manage')
  AND r.tenant_id = (SELECT id FROM tenants WHERE tenant_key = 'tudm-demo')
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (tenant_id, role_id, permission_id)
SELECT r.tenant_id, r.id, p.id
FROM tenant_roles r
JOIN tenant_permissions p ON p.tenant_id = r.tenant_id
WHERE r.role_key = 'review_officer'
  AND p.permission_key IN ('profiles.read','requests.review')
  AND r.tenant_id = (SELECT id FROM tenants WHERE tenant_key = 'tudm-demo')
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (tenant_id, role_id, permission_id)
SELECT r.tenant_id, r.id, p.id
FROM tenant_roles r
JOIN tenant_permissions p ON p.tenant_id = r.tenant_id
WHERE r.role_key = 'report_viewer'
  AND p.permission_key IN ('reports.read')
  AND r.tenant_id = (SELECT id FROM tenants WHERE tenant_key = 'tudm-demo')
ON CONFLICT DO NOTHING;

COMMIT;