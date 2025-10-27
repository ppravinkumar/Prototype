/*
  # Create policy and custom groups schema

  1. New Tables
    - `custom_groups`
      - `id` (uuid, primary key) - Unique custom group identifier
      - `name` (text) - Custom group name
      - `platform` (text) - Platform type (macOS, Windows, Linux)
      - `machine_count` (integer) - Number of machines in group
      - `notes` (text) - Description/notes about the group
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

    - `machine_policies`
      - `id` (uuid, primary key) - Unique policy identifier
      - `custom_group_id` (uuid, foreign key) - Reference to custom group
      - `enable_force` (boolean) - Enable force install after
      - `force_days` (integer) - Days after which to force install
      - `force_time` (time) - Time to force install
      - `retry_enabled` (boolean) - Enable retry mechanism
      - `retry_max` (integer) - Maximum retry attempts
      - `pre_reboot` (text) - Pre reboot setting (Yes/No)
      - `post_reboot` (text) - Post reboot setting (Yes/No)
      - `notify` (text) - Notification setting (Yes/No)
      - `ddm_force_days` (integer) - DDM force install days
      - `ddm_force_time` (time) - DDM force install time
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

    - `application_policies_agent`
      - `id` (uuid, primary key) - Unique identifier
      - `custom_group_id` (uuid, foreign key) - Reference to custom group
      - `application_name` (text) - Application name
      - `force_install` (text) - Force install configuration
      - `retry` (text) - Retry setting
      - `max_attempts` (text) - Maximum attempts
      - `pre_reboot` (text) - Pre reboot setting
      - `post_reboot` (text) - Post reboot setting
      - `notification` (text) - Notification setting
      - `pre_script` (text) - Pre-installation script
      - `post_script` (text) - Post-installation script
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

    - `application_policies_ddm`
      - `id` (uuid, primary key) - Unique identifier
      - `custom_group_id` (uuid, foreign key) - Reference to custom group
      - `channel` (text) - OS channel/version
      - `force_install` (text) - Force install configuration
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage policies
    - Public read access for all policy data

  3. Indexes
    - Add indexes for frequently queried columns
    - Foreign key indexes for join performance
*/

-- Create custom_groups table
CREATE TABLE IF NOT EXISTS custom_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  platform text NOT NULL DEFAULT 'macOS',
  machine_count integer NOT NULL DEFAULT 0,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create machine_policies table
CREATE TABLE IF NOT EXISTS machine_policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  custom_group_id uuid NOT NULL REFERENCES custom_groups(id) ON DELETE CASCADE,
  enable_force boolean NOT NULL DEFAULT false,
  force_days integer NOT NULL DEFAULT 0,
  force_time time NOT NULL DEFAULT '10:00',
  retry_enabled boolean NOT NULL DEFAULT false,
  retry_max integer NOT NULL DEFAULT 3,
  pre_reboot text NOT NULL DEFAULT 'No',
  post_reboot text NOT NULL DEFAULT 'No',
  notify text NOT NULL DEFAULT 'No',
  ddm_force_days integer NOT NULL DEFAULT 10,
  ddm_force_time time NOT NULL DEFAULT '10:00',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_custom_group_policy UNIQUE (custom_group_id)
);

-- Create application_policies_agent table
CREATE TABLE IF NOT EXISTS application_policies_agent (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  custom_group_id uuid NOT NULL REFERENCES custom_groups(id) ON DELETE CASCADE,
  application_name text NOT NULL,
  force_install text NOT NULL DEFAULT 'Inherit',
  retry text NOT NULL DEFAULT 'Inherit',
  max_attempts text NOT NULL DEFAULT 'Inherit',
  pre_reboot text NOT NULL DEFAULT 'Inherit',
  post_reboot text NOT NULL DEFAULT 'Inherit',
  notification text NOT NULL DEFAULT 'Inherit',
  pre_script text NOT NULL DEFAULT '[]',
  post_script text NOT NULL DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create application_policies_ddm table
CREATE TABLE IF NOT EXISTS application_policies_ddm (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  custom_group_id uuid NOT NULL REFERENCES custom_groups(id) ON DELETE CASCADE,
  channel text NOT NULL,
  force_install text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_custom_groups_name ON custom_groups(name);
CREATE INDEX IF NOT EXISTS idx_machine_policies_custom_group_id ON machine_policies(custom_group_id);
CREATE INDEX IF NOT EXISTS idx_application_policies_agent_custom_group_id ON application_policies_agent(custom_group_id);
CREATE INDEX IF NOT EXISTS idx_application_policies_ddm_custom_group_id ON application_policies_ddm(custom_group_id);

-- Enable Row Level Security
ALTER TABLE custom_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE machine_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_policies_agent ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_policies_ddm ENABLE ROW LEVEL SECURITY;

-- RLS Policies for custom_groups
CREATE POLICY "Anyone can view custom groups"
  ON custom_groups FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create custom groups"
  ON custom_groups FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update custom groups"
  ON custom_groups FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete custom groups"
  ON custom_groups FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for machine_policies
CREATE POLICY "Anyone can view machine policies"
  ON machine_policies FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create machine policies"
  ON machine_policies FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update machine policies"
  ON machine_policies FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete machine policies"
  ON machine_policies FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for application_policies_agent
CREATE POLICY "Anyone can view application policies agent"
  ON application_policies_agent FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create application policies agent"
  ON application_policies_agent FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update application policies agent"
  ON application_policies_agent FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete application policies agent"
  ON application_policies_agent FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for application_policies_ddm
CREATE POLICY "Anyone can view application policies ddm"
  ON application_policies_ddm FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create application policies ddm"
  ON application_policies_ddm FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update application policies ddm"
  ON application_policies_ddm FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete application policies ddm"
  ON application_policies_ddm FOR DELETE
  TO authenticated
  USING (true);
