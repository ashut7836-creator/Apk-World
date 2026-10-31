-- Add APK-specific metadata while preserving existing catalogue rows.
ALTER TABLE catalogue_items ADD COLUMN package_name TEXT;
ALTER TABLE catalogue_items ADD COLUMN version_code INTEGER;
