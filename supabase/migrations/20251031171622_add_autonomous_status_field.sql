/*
  # Add Autonomous Status Field

  ## Overview
  This migration adds autonomous_status tracking to autonomous deployment tables to enable comprehensive status monitoring at deployment, group, and ring levels.

  ## 1. Schema Changes

  ### autonomous_deployments table
    - Add `autonomous_status` column (text, nullable) - Overall deployment autonomous status
    - Supported values: 'Yet to apply', 'In Progress', 'Installed', 'Failed', 'Completed'
    - Defaults to 'Yet to apply' for new records

  ### autonomous_deployment_groups table
    - Add `autonomous_status` column (text, nullable) - Group-level autonomous status
    - Same status values as deployment level

  ### autonomous_deployment_group_rings table
    - Add `autonomous_status` column (text, nullable) - Ring-level autonomous status
    - Same status values as deployment and group levels

  ## 2. Indexes
    - Create indexes on autonomous_status columns for efficient status-based queries

  ## 3. Data Migration
    - Existing records will have NULL autonomous_status initially
    - A separate migration will populate historical data with appropriate status values
    - New records will use default value 'Yet to apply'

  ## 4. Important Notes
    - The autonomous_status field is separate from the existing 'status' and 'overall_status' fields
    - autonomous_status specifically tracks the autonomous deployment lifecycle
    - Nullable to maintain backward compatibility with existing deployments
    - Status values align with rollout summary reporting requirements
*/

-- Add autonomous_status column to autonomous_deployments
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'autonomous_deployments'
    AND column_name = 'autonomous_status'
  ) THEN
    ALTER TABLE autonomous_deployments
    ADD COLUMN autonomous_status text DEFAULT 'Yet to apply';
  END IF;
END $$;

-- Add autonomous_status column to autonomous_deployment_groups
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'autonomous_deployment_groups'
    AND column_name = 'autonomous_status'
  ) THEN
    ALTER TABLE autonomous_deployment_groups
    ADD COLUMN autonomous_status text DEFAULT 'Yet to apply';
  END IF;
END $$;

-- Add autonomous_status column to autonomous_deployment_group_rings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'autonomous_deployment_group_rings'
    AND column_name = 'autonomous_status'
  ) THEN
    ALTER TABLE autonomous_deployment_group_rings
    ADD COLUMN autonomous_status text DEFAULT 'Yet to apply';
  END IF;
END $$;

-- Create indexes for efficient status-based queries
CREATE INDEX IF NOT EXISTS idx_autonomous_deployments_autonomous_status
ON autonomous_deployments(autonomous_status);

CREATE INDEX IF NOT EXISTS idx_autonomous_deployment_groups_autonomous_status
ON autonomous_deployment_groups(autonomous_status);

CREATE INDEX IF NOT EXISTS idx_autonomous_deployment_group_rings_autonomous_status
ON autonomous_deployment_group_rings(autonomous_status);

-- Add comments to document the field
COMMENT ON COLUMN autonomous_deployments.autonomous_status IS 'Autonomous deployment lifecycle status: Yet to apply, In Progress, Installed, Failed, Completed';
COMMENT ON COLUMN autonomous_deployment_groups.autonomous_status IS 'Group-level autonomous deployment status: Yet to apply, In Progress, Installed, Failed, Completed';
COMMENT ON COLUMN autonomous_deployment_group_rings.autonomous_status IS 'Ring-level autonomous deployment status: Yet to apply, In Progress, Installed, Failed, Completed';
