/*
  # Create Manual Deployments Schema

  ## Overview
  This migration creates the schema for managing manual patch deployments in the system.

  ## 1. New Tables
  
  ### `manual_deployments`
  Main table for storing manual deployment configurations
  - `id` (uuid, primary key) - Unique deployment identifier
  - `deployment_name` (text, not null) - User-provided deployment name
  - `force_install_date` (date, nullable) - Optional date for forced installation
  - `force_install_time` (time, nullable) - Optional time for forced installation
  - `pre_reboot_option` (text, not null) - Pre-reboot behavior: 'no_reboot', 'if_required', 'always'
  - `post_reboot_option` (text, not null) - Post-reboot behavior: 'no_reboot', 'if_required', 'always'
  - `status` (text, not null) - Deployment status: 'pending', 'in_progress', 'completed', 'failed'
  - `created_at` (timestamptz, not null) - Creation timestamp
  - `updated_at` (timestamptz, not null) - Last update timestamp

  ### `deployment_patches`
  Junction table linking deployments to selected patches
  - `id` (uuid, primary key) - Unique record identifier
  - `deployment_id` (uuid, foreign key) - Reference to manual_deployments
  - `patch_id` (text, not null) - Patch identifier (e.g., "600201")
  - `patch_name` (text, not null) - Patch description for display
  - `created_at` (timestamptz, not null) - Creation timestamp

  ### `deployment_targets`
  Junction table linking deployments to target groups
  - `id` (uuid, primary key) - Unique record identifier
  - `deployment_id` (uuid, foreign key) - Reference to manual_deployments
  - `target_group` (text, not null) - Target group name (e.g., "Finance", "Engineering")
  - `created_at` (timestamptz, not null) - Creation timestamp

  ## 2. Security
  - Enable RLS on all tables
  - Add policies for authenticated users to manage their deployments
  - Restrict access to authenticated users only

  ## 3. Important Notes
  - Pre/post reboot options use consistent enum-like values
  - All timestamps default to current time
  - Foreign key relationships ensure data integrity with CASCADE delete
  - Indexes added for common query patterns
*/

-- Create manual_deployments table
CREATE TABLE IF NOT EXISTS manual_deployments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deployment_name text NOT NULL,
  force_install_date date,
  force_install_time time,
  pre_reboot_option text NOT NULL DEFAULT 'no_reboot',
  post_reboot_option text NOT NULL DEFAULT 'no_reboot',
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create deployment_patches junction table
CREATE TABLE IF NOT EXISTS deployment_patches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deployment_id uuid NOT NULL REFERENCES manual_deployments(id) ON DELETE CASCADE,
  patch_id text NOT NULL,
  patch_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create deployment_targets junction table
CREATE TABLE IF NOT EXISTS deployment_targets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deployment_id uuid NOT NULL REFERENCES manual_deployments(id) ON DELETE CASCADE,
  target_group text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_deployment_patches_deployment_id ON deployment_patches(deployment_id);
CREATE INDEX IF NOT EXISTS idx_deployment_targets_deployment_id ON deployment_targets(deployment_id);
CREATE INDEX IF NOT EXISTS idx_manual_deployments_status ON manual_deployments(status);
CREATE INDEX IF NOT EXISTS idx_manual_deployments_created_at ON manual_deployments(created_at DESC);

-- Enable RLS
ALTER TABLE manual_deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE deployment_patches ENABLE ROW LEVEL SECURITY;
ALTER TABLE deployment_targets ENABLE ROW LEVEL SECURITY;

-- Policies for manual_deployments
CREATE POLICY "Authenticated users can view all deployments"
  ON manual_deployments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create deployments"
  ON manual_deployments FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update deployments"
  ON manual_deployments FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete deployments"
  ON manual_deployments FOR DELETE
  TO authenticated
  USING (true);

-- Policies for deployment_patches
CREATE POLICY "Authenticated users can view deployment patches"
  ON deployment_patches FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create deployment patches"
  ON deployment_patches FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete deployment patches"
  ON deployment_patches FOR DELETE
  TO authenticated
  USING (true);

-- Policies for deployment_targets
CREATE POLICY "Authenticated users can view deployment targets"
  ON deployment_targets FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create deployment targets"
  ON deployment_targets FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete deployment targets"
  ON deployment_targets FOR DELETE
  TO authenticated
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_manual_deployments_updated_at
  BEFORE UPDATE ON manual_deployments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
