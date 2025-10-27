/*
  # Create deployment_ddm_customization table

  1. New Tables
    - `deployment_ddm_customization`
      - `id` (uuid, primary key) - Unique identifier for DDM customization
      - `deployment_id` (uuid, foreign key) - Reference to manual_deployments table
      - `ddm_force_install_date` (date) - Force install date for DDM patches
      - `ddm_force_install_time` (time) - Force install time for DDM patches
      - `created_at` (timestamptz) - Timestamp when record was created
      - `updated_at` (timestamptz) - Timestamp when record was last updated
  
  2. Security
    - Enable RLS on `deployment_ddm_customization` table
    - Add policy for authenticated users to read DDM customization data
    - Add policy for authenticated users to insert DDM customization data
    - Add policy for authenticated users to update DDM customization data
    - Add policy for authenticated users to delete DDM customization data
  
  3. Indexes
    - Add index on deployment_id for faster lookups
*/

CREATE TABLE IF NOT EXISTS deployment_ddm_customization (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deployment_id uuid NOT NULL REFERENCES manual_deployments(id) ON DELETE CASCADE,
  ddm_force_install_date date NOT NULL,
  ddm_force_install_time time NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE deployment_ddm_customization ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read DDM customization"
  ON deployment_ddm_customization FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert DDM customization"
  ON deployment_ddm_customization FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update DDM customization"
  ON deployment_ddm_customization FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete DDM customization"
  ON deployment_ddm_customization FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_deployment_ddm_customization_deployment_id 
  ON deployment_ddm_customization(deployment_id);