/*
  # Add Patch Tracking Columns

  1. Schema Changes
    - Add patch tracking columns to autonomous_deployment_groups table
      - `patches` (jsonb) - Array of patch identifiers/names
      - `patch_yet_to_apply` (integer) - Count of patches yet to apply
      - `patch_in_progress` (integer) - Count of patches in progress
      - `patch_installed` (integer) - Count of patches installed
      - `patch_failed` (integer) - Count of patches failed
      - `patch_installed_pct` (integer) - Installation percentage for patches

    - Add patch tracking columns to autonomous_deployment_group_rings table
      - `patches` (jsonb) - Array of patch identifiers/names
      - `patch_yet_to_apply` (integer) - Count of patches yet to apply
      - `patch_in_progress` (integer) - Count of patches in progress
      - `patch_installed` (integer) - Count of patches installed
      - `patch_failed` (integer) - Count of patches failed
      - `patch_installed_pct` (integer) - Installation percentage for patches

  2. Migration Details
    - Adds new columns with default values to maintain data integrity
    - All patch count columns default to 0
    - patches column defaults to empty JSONB array
    - Maintains backward compatibility with existing records
    - Creates indexes for frequently queried columns

  3. Notes
    - Existing deployments will have default values (0 patches, 0%)
    - New deployments can track multiple patches per rollout/ring
    - Patch progress mirrors target progress structure for consistency
    - Ready for seed data population in subsequent migration
*/

-- Add patch tracking columns to autonomous_deployment_groups
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'autonomous_deployment_groups'
    AND column_name = 'patches'
  ) THEN
    ALTER TABLE autonomous_deployment_groups
    ADD COLUMN patches jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'autonomous_deployment_groups'
    AND column_name = 'patch_yet_to_apply'
  ) THEN
    ALTER TABLE autonomous_deployment_groups
    ADD COLUMN patch_yet_to_apply integer DEFAULT 0;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'autonomous_deployment_groups'
    AND column_name = 'patch_in_progress'
  ) THEN
    ALTER TABLE autonomous_deployment_groups
    ADD COLUMN patch_in_progress integer DEFAULT 0;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'autonomous_deployment_groups'
    AND column_name = 'patch_installed'
  ) THEN
    ALTER TABLE autonomous_deployment_groups
    ADD COLUMN patch_installed integer DEFAULT 0;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'autonomous_deployment_groups'
    AND column_name = 'patch_failed'
  ) THEN
    ALTER TABLE autonomous_deployment_groups
    ADD COLUMN patch_failed integer DEFAULT 0;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'autonomous_deployment_groups'
    AND column_name = 'patch_installed_pct'
  ) THEN
    ALTER TABLE autonomous_deployment_groups
    ADD COLUMN patch_installed_pct integer DEFAULT 0;
  END IF;
END $$;

-- Add patch tracking columns to autonomous_deployment_group_rings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'autonomous_deployment_group_rings'
    AND column_name = 'patches'
  ) THEN
    ALTER TABLE autonomous_deployment_group_rings
    ADD COLUMN patches jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'autonomous_deployment_group_rings'
    AND column_name = 'patch_yet_to_apply'
  ) THEN
    ALTER TABLE autonomous_deployment_group_rings
    ADD COLUMN patch_yet_to_apply integer DEFAULT 0;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'autonomous_deployment_group_rings'
    AND column_name = 'patch_in_progress'
  ) THEN
    ALTER TABLE autonomous_deployment_group_rings
    ADD COLUMN patch_in_progress integer DEFAULT 0;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'autonomous_deployment_group_rings'
    AND column_name = 'patch_installed'
  ) THEN
    ALTER TABLE autonomous_deployment_group_rings
    ADD COLUMN patch_installed integer DEFAULT 0;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'autonomous_deployment_group_rings'
    AND column_name = 'patch_failed'
  ) THEN
    ALTER TABLE autonomous_deployment_group_rings
    ADD COLUMN patch_failed integer DEFAULT 0;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'autonomous_deployment_group_rings'
    AND column_name = 'patch_installed_pct'
  ) THEN
    ALTER TABLE autonomous_deployment_group_rings
    ADD COLUMN patch_installed_pct integer DEFAULT 0;
  END IF;
END $$;

-- Create indexes for patch-related queries
CREATE INDEX IF NOT EXISTS idx_autonomous_deployment_groups_patch_status
ON autonomous_deployment_groups(patch_installed_pct);

CREATE INDEX IF NOT EXISTS idx_autonomous_deployment_group_rings_patch_status
ON autonomous_deployment_group_rings(patch_installed_pct);
