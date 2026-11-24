-- Synthetic TUDM-first development tenant only. Not official TUDM data/configuration.
BEGIN;

INSERT INTO tenants (id, tenant_key, display_name, short_name)
VALUES ('11111111-1111-4111-8111-111111111111', 'tudm-demo', 'TUDM Demo Workspace', 'TUDM DEMO')
ON CONFLICT (tenant_key) DO NOTHING;

-- Demo seed only: set the tenant context inside this transaction for RLS-protected tables.
SET LOCAL app.tenant_id = '11111111-1111-4111-8111-111111111111';

INSERT INTO tenant_configurations (tenant_id, version, schema_version, configuration)
SELECT id, 1, 1,
'{
  "productEdition": "tudm-first",
  "locale": "ms-MY",
  "timeZone": "Asia/Kuala_Lumpur",
  "modules": {
    "personnelProfiles": true,
    "organisationDirectory": true,
    "credentialRegistry": true,
    "visitorAdministration": true,
    "contractorProfiles": true,
    "vehicleProfiles": true,
    "administrativeRequests": true,
    "simulatedIdentityEvents": true,
    "reports": true
  },
  "terminology": {
    "person": "Profil",
    "organisation": "Organisasi",
    "visitor": "Pelawat",
    "contractor": "Kontraktor"
  },
  "profileCategories": ["personnel", "visitor", "contractor"],
  "credentialTypes": ["rfid-card"],
  "readerMode": "test-only",
  "physicalAccessControl": false
}'::jsonb
FROM tenants WHERE tenant_key = 'tudm-demo'
ON CONFLICT (tenant_id, version) DO NOTHING;

INSERT INTO profile_categories (tenant_id, category_key, label, description)
SELECT t.id, v.category_key, v.label, v.description
FROM tenants t
CROSS JOIN (VALUES
  ('personnel', 'Anggota / Personel', 'Kategori profil pentadbiran; gunakan rekod sintetik sahaja.'),
  ('visitor', 'Pelawat', 'Kategori profil pelawat untuk ujian aliran pentadbiran.'),
  ('contractor', 'Kontraktor', 'Kategori profil kontraktor untuk ujian aliran pentadbiran.')
) AS v(category_key, label, description)
WHERE t.tenant_key = 'tudm-demo'
ON CONFLICT (tenant_id, category_key) DO NOTHING;

INSERT INTO credential_types (tenant_id, type_key, label, technology_notes)
SELECT id, 'rfid-card', 'Kad RFID (belum ditentukan)',
'Jenis teknologi kad mesti disahkan melalui ujian kad yang dibenarkan sebelum pemilihan reader.'
FROM tenants WHERE tenant_key = 'tudm-demo'
ON CONFLICT (tenant_id, type_key) DO NOTHING;

INSERT INTO tenant_roles (tenant_id, role_key, role_name, description)
SELECT id, v.role_key, v.role_name, v.description
FROM tenants
CROSS JOIN (VALUES
  ('system_admin', 'Pentadbir Sistem', 'Pentadbiran konfigurasi aplikasi dan akaun.'),
  ('profile_admin', 'Pentadbir Profil', 'Pengurusan rekod profil mengikut kebenaran.'),
  ('review_officer', 'Pegawai Penyemak', 'Semakan permohonan pentadbiran.'),
  ('report_viewer', 'Pembaca Laporan', 'Akses laporan yang dibenarkan.')
) AS v(role_key, role_name, description)
WHERE tenant_key = 'tudm-demo'
ON CONFLICT (tenant_id, role_key) DO NOTHING;

COMMIT;