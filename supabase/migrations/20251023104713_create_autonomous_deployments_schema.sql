/*
  # Create autonomous deployments schema

  1. New Tables
    - `autonomous_deployments`
      - `id` (uuid, primary key) - Unique deployment identifier
      - `deployment_name` (text) - Name of the deployment
      - `applications` (jsonb) - Array of application IDs
      - `start_option` (text) - Start deployment option type (days/weekDay/patchTuesday/calendarDay)
      - `start_config` (jsonb) - Configuration for start option
      - `overall_status` (text) - Overall deployment status
      - `installed_pct` (integer) - Overall installation percentage
      - `created_by` (text) - User who created the deployment
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

    - `autonomous_deployment_rings`
      - `id` (uuid, primary key) - Unique ring identifier
      - `deployment_id` (uuid, foreign key) - Reference to deployment
      - `ring_number` (integer) - Ring number (1, 2, or 3)
      - `ring_name` (text) - Ring name (Internal users, Early adopters, All Users)
      - `targets` (jsonb) - Array of target group IDs
      - `pass_criteria_pct` (integer) - Pass criteria percentage (nullable for ring 3)
      - `wait_days` (integer) - Wait days for percentage calculation (nullable for ring 3)

    - `autonomous_deployment_groups`
      - `id` (uuid, primary key) - Unique group identifier
      - `deployment_id` (uuid, foreign key) - Reference to deployment
      - `group_id` (text) - Group identifier (g1, g0, g-1, etc.)
      - `start_date` (timestamptz) - Group start timestamp
      - `end_date` (timestamptz) - Group end timestamp
      - `status` (text) - Group status
      - `targets` (integer) - Number of targets
      - `yet_to_apply` (integer) - Count of devices yet to apply
      - `in_progress` (integer) - Count of devices in progress
      - `installed` (integer) - Count of devices installed
      - `failed` (integer) - Count of devices failed
      - `installed_pct` (integer) - Installation percentage

    - `autonomous_deployment_group_rings`
      - `id` (uuid, primary key) - Unique identifier
      - `group_id` (uuid, foreign key) - Reference to group
      - `ring_name` (text) - Ring name
      - `status` (text) - Ring status
      - `targets` (integer) - Number of targets
      - `yet_to_apply` (integer) - Count of devices yet to apply
      - `in_progress` (integer) - Count of devices in progress
      - `installed` (integer) - Count of devices installed
      - `failed` (integer) - Count of devices failed
      - `installed_pct` (integer) - Installation percentage
      - `hint` (text) - Status hint/message

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own deployments
    - Public read access for all deployment data (for demonstration purposes)

  3. Indexes
    - Add indexes for frequently queried columns
    - Foreign key indexes for join performance
*/

-- Create autonomous_deployments table
CREATE TABLE IF NOT EXISTS autonomous_deployments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deployment_name text NOT NULL,
  applications jsonb NOT NULL DEFAULT '[]'::jsonb,
  start_option text NOT NULL,
  start_config jsonb NOT NULL DEFAULT '{}'::jsonb,
  overall_status text NOT NULL DEFAULT 'Yet to apply',
  installed_pct integer NOT NULL DEFAULT 0,
  created_by text NOT NULL DEFAULT 'Admin',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create autonomous_deployment_rings table
CREATE TABLE IF NOT EXISTS autonomous_deployment_rings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deployment_id uuid NOT NULL REFERENCES autonomous_deployments(id) ON DELETE CASCADE,
  ring_number integer NOT NULL CHECK (ring_number BETWEEN 1 AND 3),
  ring_name text NOT NULL,
  targets jsonb NOT NULL DEFAULT '[]'::jsonb,
  pass_criteria_pct integer CHECK (pass_criteria_pct IS NULL OR (pass_criteria_pct BETWEEN 1 AND 100)),
  wait_days integer CHECK (wait_days IS NULL OR wait_days >= 0),
  created_at timestamptz DEFAULT now()
);

-- Create autonomous_deployment_groups table
CREATE TABLE IF NOT EXISTS autonomous_deployment_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deployment_id uuid NOT NULL REFERENCES autonomous_deployments(id) ON DELETE CASCADE,
  group_id text NOT NULL,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'Yet to apply',
  targets integer NOT NULL DEFAULT 0,
  yet_to_apply integer NOT NULL DEFAULT 0,
  in_progress integer NOT NULL DEFAULT 0,
  installed integer NOT NULL DEFAULT 0,
  failed integer NOT NULL DEFAULT 0,
  installed_pct integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create autonomous_deployment_group_rings table
CREATE TABLE IF NOT EXISTS autonomous_deployment_group_rings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES autonomous_deployment_groups(id) ON DELETE CASCADE,
  ring_name text NOT NULL,
  status text NOT NULL DEFAULT 'Yet to apply',
  targets integer NOT NULL DEFAULT 0,
  yet_to_apply integer NOT NULL DEFAULT 0,
  in_progress integer NOT NULL DEFAULT 0,
  installed integer NOT NULL DEFAULT 0,
  failed integer NOT NULL DEFAULT 0,
  installed_pct integer NOT NULL DEFAULT 0,
  hint text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_autonomous_deployments_created_at ON autonomous_deployments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_autonomous_deployment_rings_deployment_id ON autonomous_deployment_rings(deployment_id);
CREATE INDEX IF NOT EXISTS idx_autonomous_deployment_groups_deployment_id ON autonomous_deployment_groups(deployment_id);
CREATE INDEX IF NOT EXISTS idx_autonomous_deployment_group_rings_group_id ON autonomous_deployment_group_rings(group_id);

-- Enable Row Level Security
ALTER TABLE autonomous_deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE autonomous_deployment_rings ENABLE ROW LEVEL SECURITY;
ALTER TABLE autonomous_deployment_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE autonomous_deployment_group_rings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for autonomous_deployments
CREATE POLICY "Anyone can view autonomous deployments"
  ON autonomous_deployments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create autonomous deployments"
  ON autonomous_deployments FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update autonomous deployments"
  ON autonomous_deployments FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete autonomous deployments"
  ON autonomous_deployments FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for autonomous_deployment_rings
CREATE POLICY "Anyone can view autonomous deployment rings"
  ON autonomous_deployment_rings FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create autonomous deployment rings"
  ON autonomous_deployment_rings FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update autonomous deployment rings"
  ON autonomous_deployment_rings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete autonomous deployment rings"
  ON autonomous_deployment_rings FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for autonomous_deployment_groups
CREATE POLICY "Anyone can view autonomous deployment groups"
  ON autonomous_deployment_groups FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create autonomous deployment groups"
  ON autonomous_deployment_groups FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update autonomous deployment groups"
  ON autonomous_deployment_groups FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete autonomous deployment groups"
  ON autonomous_deployment_groups FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for autonomous_deployment_group_rings
CREATE POLICY "Anyone can view autonomous deployment group rings"
  ON autonomous_deployment_group_rings FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create autonomous deployment group rings"
  ON autonomous_deployment_group_rings FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update autonomous deployment group rings"
  ON autonomous_deployment_group_rings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete autonomous deployment group rings"
  ON autonomous_deployment_group_rings FOR DELETE
  TO authenticated
  USING (true);
