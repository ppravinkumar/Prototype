/*
  # Add Customisation and Notification Fields to Manual Deployments

  ## Overview
  This migration adds fields to control optional customisation settings and notification preferences
  for manual deployments.

  ## 1. New Columns Added to `manual_deployments`
  
  ### `is_customised` (boolean, not null, default: false)
  - Determines whether the deployment uses custom settings
  - When false, customisation options (date/time, reboot settings, notifications) use default values
  - When true, user-configured customisation options are applied
  
  ### `show_notifications` (boolean, not null, default: true)
  - Controls whether notifications are shown for this deployment
  - true: Show notifications to users
  - false: Do not show notifications
  - Only applies when is_customised is true

  ## 2. Important Notes
  - Both fields have default values to ensure backwards compatibility
  - Fields are non-nullable to maintain data consistency
  - When is_customised is false, the application logic will use default values for all customisation options
*/

-- Add is_customised column to manual_deployments table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'manual_deployments' AND column_name = 'is_customised'
  ) THEN
    ALTER TABLE manual_deployments ADD COLUMN is_customised boolean NOT NULL DEFAULT false;
  END IF;
END $$;

-- Add show_notifications column to manual_deployments table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'manual_deployments' AND column_name = 'show_notifications'
  ) THEN
    ALTER TABLE manual_deployments ADD COLUMN show_notifications boolean NOT NULL DEFAULT true;
  END IF;
END $$;
