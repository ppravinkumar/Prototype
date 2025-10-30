/*
  # Add Customization Mode and Policy Start Date/Time Fields

  1. Changes to manual_deployments table
    - Add `customization_mode` field to track the selected mode ('enable_customisation' or 'follow_policy')
    - Add `policy_start_date` field for Follow Policy mode
    - Add `policy_start_time` field for Follow Policy mode
    - Keep existing `is_customised` field for backward compatibility (will be deprecated)
  
  2. Notes
    - Default customization_mode to 'enable_customisation' for existing deployments
    - Policy date/time fields are nullable as they're only used in 'follow_policy' mode
    - The is_customised boolean field can be derived from customization_mode but kept for compatibility
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'manual_deployments' AND column_name = 'customization_mode'
  ) THEN
    ALTER TABLE manual_deployments ADD COLUMN customization_mode text DEFAULT 'enable_customisation' NOT NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'manual_deployments' AND column_name = 'policy_start_date'
  ) THEN
    ALTER TABLE manual_deployments ADD COLUMN policy_start_date date;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'manual_deployments' AND column_name = 'policy_start_time'
  ) THEN
    ALTER TABLE manual_deployments ADD COLUMN policy_start_time time;
  END IF;
END $$;