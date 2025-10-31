/*
  # Add Ring Start and End Time Columns

  1. Schema Changes
    - Add start_time column to autonomous_deployment_group_rings table
    - Add end_time column to autonomous_deployment_group_rings table
    - Both columns are nullable timestamptz fields
    - Represents when each ring starts and ends within a rollout group

  2. Migration Details
    - Adds new columns with default NULL values
    - Maintains backward compatibility with existing records
    - Time values will be populated for active rings during deployment
    - NULL values indicate rings that haven't started or are waiting

  3. Notes
    - Start time indicates when a ring begins its deployment phase
    - End time indicates when a ring completes or is scheduled to complete
    - Times are relative to the group's overall deployment window
    - Rings may start at different times based on pass criteria and wait days
*/

-- Add start_time column to autonomous_deployment_group_rings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'autonomous_deployment_group_rings'
    AND column_name = 'start_time'
  ) THEN
    ALTER TABLE autonomous_deployment_group_rings
    ADD COLUMN start_time timestamptz;
  END IF;
END $$;

-- Add end_time column to autonomous_deployment_group_rings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'autonomous_deployment_group_rings'
    AND column_name = 'end_time'
  ) THEN
    ALTER TABLE autonomous_deployment_group_rings
    ADD COLUMN end_time timestamptz;
  END IF;
END $$;

-- Create index for querying rings by time ranges
CREATE INDEX IF NOT EXISTS idx_autonomous_deployment_group_rings_times
ON autonomous_deployment_group_rings(start_time, end_time);
