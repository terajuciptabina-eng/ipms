-- Migration 003: profile avatar path for synthetic UI/demo records.
ALTER TABLE person_profiles
  ADD COLUMN profile_image_path TEXT;

ALTER TABLE person_profiles
  ADD CONSTRAINT person_profiles_image_path_safe CHECK (
    profile_image_path IS NULL OR
    (profile_image_path NOT LIKE '/%' AND profile_image_path NOT LIKE '%..%' AND profile_image_path NOT LIKE '%://%')
  );

COMMENT ON COLUMN person_profiles.profile_image_path IS
  'Relative path to an approved profile image asset; never store an arbitrary remote URL.';