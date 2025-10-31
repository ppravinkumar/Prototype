/*
  # Add Dynamic Ring Support

  1. Schema Changes
    - Remove the constraint limiting ring_number to 1-3
    - Add ring_order column for maintaining sequence
    - Add is_final_ring boolean flag to identify the last ring
    - Update constraints to support N rings

  2. Migration Details
    - Drops existing ring_number constraint
    - Adds new constraint for positive ring numbers
    - Adds ring_order column with default ordering
    - Adds is_final_ring boolean with default false
    - Maintains backward compatibility with existing data

  3. Notes
    - Existing deployments with 3 rings remain unchanged
    - New deployments can have 1 to N rings
    - The final ring doesn't require pass_criteria_pct or wait_days
*/

-- Drop the old constraint that limited rings to 1-3
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'autonomous_deployment_rings_ring_number_check'
  ) THEN
    ALTER TABLE autonomous_deployment_rings 
    DROP CONSTRAINT autonomous_deployment_rings_ring_number_check;
  END IF;
END $$;

-- Add new constraint allowing any positive integer
ALTER TABLE autonomous_deployment_rings 
ADD CONSTRAINT autonomous_deployment_rings_ring_number_check 
CHECK (ring_number > 0);

-- Add ring_order column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'autonomous_deployment_rings' 
    AND column_name = 'ring_order'
  ) THEN
    ALTER TABLE autonomous_deployment_rings 
    ADD COLUMN ring_order integer;
  END IF;
END $$;

-- Add is_final_ring column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'autonomous_deployment_rings' 
    AND column_name = 'is_final_ring'
  ) THEN
    ALTER TABLE autonomous_deployment_rings 
    ADD COLUMN is_final_ring boolean DEFAULT false;
  END IF;
END $$;

-- Set ring_order to match ring_number for existing data
UPDATE autonomous_deployment_rings 
SET ring_order = ring_number 
WHERE ring_order IS NULL;

-- Mark ring 3 as final ring for existing deployments
UPDATE autonomous_deployment_rings 
SET is_final_ring = true 
WHERE ring_number = 3 AND is_final_ring = false;

-- Create index for ring_order if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_autonomous_deployment_rings_order 
ON autonomous_deployment_rings(deployment_id, ring_order);
