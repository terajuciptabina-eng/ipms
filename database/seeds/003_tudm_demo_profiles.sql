-- Entirely fictional demo records for UI development. No real TUDM personnel data.
-- Apply schema 001, migration 002, migration 003, then seed 001 and 002 before this file.
BEGIN;
SET LOCAL app.tenant_id = '11111111-1111-4111-8111-111111111111';

INSERT INTO organisation_units (tenant_id, unit_code, unit_name, unit_type)
SELECT id, v.unit_code, v.unit_name, 'demo'
FROM tenants
CROSS JOIN (VALUES
  ('DEMO-ORG-01', 'Unit Pentadbiran Demo'),
  ('DEMO-ORG-02', 'Unit Sokongan Teknikal Demo'),
  ('DEMO-ORG-03', 'Unit Operasi Pentadbiran Demo')
) AS v(unit_code, unit_name)
WHERE tenant_key = 'tudm-demo'
ON CONFLICT (tenant_id, unit_code) DO NOTHING;

WITH demo_rows(profile_reference, category_key, unit_code, display_name, preferred_name, profile_status, image_path, metadata) AS (
  VALUES
  ('DEMO-P-0001','personnel','DEMO-ORG-01','Aiman Hakim bin Razak','Aiman','active','assets/profiles/avatar-01.svg','{"demo":true,"designation":"Pegawai Pentadbiran Demo","email":"aiman.hakim@example.test","phone":"+60 10-0000 001"}'::jsonb),
  ('DEMO-P-0002','personnel','DEMO-ORG-02','Nur Aisyah binti Rahman','Aisyah','active','assets/profiles/avatar-02.svg','{"demo":true,"designation":"Penyelia Sokongan Demo","email":"aisyah.rahman@example.test","phone":"+60 10-0000 002"}'::jsonb),
  ('DEMO-P-0003','personnel','DEMO-ORG-02','Muhammad Danish bin Ismail','Danish','active','assets/profiles/avatar-03.svg','{"demo":true,"designation":"Juruteknik Demo","email":"danish.ismail@example.test","phone":"+60 10-0000 003"}'::jsonb),
  ('DEMO-P-0004','personnel','DEMO-ORG-03','Siti Nur Balqis binti Hamdan','Balqis','inactive','assets/profiles/avatar-04.svg','{"demo":true,"designation":"Penyelaras Rekod Demo","email":"balqis.hamdan@example.test","phone":"+60 10-0000 004"}'::jsonb),
  ('DEMO-V-0001','visitor',NULL,'Farid Azman bin Salleh','Farid','active','assets/profiles/avatar-05.svg','{"demo":true,"visitPurpose":"Mesyuarat Demo","sponsor":"Pegawai Pengiring Demo","email":"farid.salleh@example.test"}'::jsonb),
  ('DEMO-V-0002','visitor',NULL,'Nadia Izzati binti Omar','Nadia','pending','assets/profiles/avatar-06.svg','{"demo":true,"visitPurpose":"Urusan Pentadbiran Demo","sponsor":"Unit Penerima Demo","email":"nadia.omar@example.test"}'::jsonb),
  ('DEMO-C-0001','contractor','DEMO-ORG-02','Kumaravel a/l Muthu','Kumar','active','assets/profiles/avatar-07.svg','{"demo":true,"company":"Syarikat Contoh Teknikal Sdn. Bhd.","workCategory":"Penyelenggaraan Demo","email":"kumar@example.test"}'::jsonb),
  ('DEMO-C-0002','contractor','DEMO-ORG-01','Lim Wei Jian','Wei Jian','suspended','assets/profiles/avatar-08.svg','{"demo":true,"company":"Kontraktor Contoh Enterprise","workCategory":"Perkhidmatan Sokongan Demo","email":"weijian@example.test"}'::jsonb)
)
INSERT INTO person_profiles (tenant_id, profile_reference, category_id, organisation_unit_id, display_name, preferred_name, profile_status, profile_image_path, metadata)
SELECT t.id, d.profile_reference, c.id, o.id, d.display_name, d.preferred_name, d.profile_status, d.image_path, d.metadata
FROM demo_rows d
JOIN tenants t ON t.tenant_key = 'tudm-demo'
JOIN profile_categories c ON c.tenant_id = t.id AND c.category_key = d.category_key
LEFT JOIN organisation_units o ON o.tenant_id = t.id AND o.unit_code = d.unit_code
ON CONFLICT (tenant_id, profile_reference) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  organisation_unit_id = EXCLUDED.organisation_unit_id,
  display_name = EXCLUDED.display_name,
  preferred_name = EXCLUDED.preferred_name,
  profile_status = EXCLUDED.profile_status,
  profile_image_path = EXCLUDED.profile_image_path,
  metadata = EXCLUDED.metadata,
  updated_at = now();

COMMIT;