/*
  # Add Force Install Enabled Field to Manual Deployments

  ## Overview
  This migration adds a boolean field to control whether the force install date and time
  should be applied for manual deployments.

  ## 1. New Column Added to `manual_deployments`
  
  ### `force_install_enabled` (boolean, not null, default: true)
  - Determines whether force install date and time should be applied
  - When false, force_install_date and force_install_time are ignored
  - When true, force_install_date and force_install_time are applied if set
  - Only relevant when is_customised is true
  - Defaults to true for backward compatibility with existing deployments

  ## 2. Important Notes
  - Field has a default value of true to ensure backwards compatibility
  - Field is non-nullable to maintain data consistency
  - Works in conjunction with is_customised field
  - When is_customised is false, this field has no effect
*/

-- Add force_install_enabled column to manual_deployments table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'manual_deployments' AND column_name = 'force_install_enabled'
  ) THEN
    ALTER TABLE manual_deployments ADD COLUMN force_install_enabled boolean NOT NULL DEFAULT true;
  END IF;
END $$;