/*
  # Seed Autonomous Deployments Data

  ## Overview
  This migration populates the autonomous_deployments schema with 4 distinct deployments (dep_001 through dep_004), each with unique configurations, applications, ring setups, and progress states.

  ## 1. Deployments Created

  ### dep_001: macOS All Applications
  - **Progress**: 72% complete
  - **Status**: In Progress
  - **Applications**: Chrome, Firefox, Zoom, Slack
  - **Start Option**: 0 days after release
  - **Characteristics**: High progress deployment with Internal users ring completed, Early adopters actively deploying
  - **Created By**: Mac Admin

  ### dep_002: Linux All Application Except Server Application
  - **Progress**: 35% complete
  - **Status**: In Progress
  - **Applications**: Chrome, Firefox, VS Code
  - **Start Option**: Week 2 Monday after release
  - **Characteristics**: Medium progress deployment with first ring partially complete, other rings waiting
  - **Created By**: Admin

  ### dep_003: Windows OS Applications
  - **Progress**: 5% complete
  - **Status**: Yet to apply
  - **Applications**: Edge, Chrome, Acrobat
  - **Start Option**: 7 days after release
  - **Characteristics**: Low progress deployment with all rings in early stages
  - **Created By**: Admin

  ### dep_004: Windows All Applications Except SQL Server
  - **Progress**: 100% complete
  - **Status**: Installed
  - **Applications**: Chrome, Slack, VS Code, Zoom, Firefox
  - **Start Option**: Calendar day 15 after release
  - **Characteristics**: Fully completed deployment with all rings showing 100% installation
  - **Created By**: Admin

  ## 2. Ring Configurations
  Each deployment has 3 rings with distinct target groups:
  - **Ring 1 (Internal users)**: Pass criteria 60%, wait days 2
  - **Ring 2 (Early adopters)**: Pass criteria 80%, wait days 3
  - **Ring 3 (All Users)**: No pass criteria (final ring)

  ## 3. Deployment Groups
  Each deployment has multiple groups representing different time periods:
  - **Current group (g1)**: Future/current deployment window
  - **Previous group (g0)**: Recent deployment showing progress
  - **Historical groups (g-1, g-2)**: Past deployments with completion data

  ## 4. Progress Tracking
  Each group has ring-level progress data with:
  - Status indicators (Yet to apply, In Progress, Installed, Failed)
  - Device counts (targets, yet_to_apply, in_progress, installed, failed)
  - Installation percentages
  - Hints for blocked or waiting rings

  ## 5. Data Characteristics
  - Realistic date ranges spanning past, present, and future
  - Progress calculations that aggregate correctly from rings to groups to deployment
  - Varied target group assignments across rings
  - Different deployment strategies reflected in start options
  - Status hints that guide understanding of ring dependencies
*/

-- Insert dep_001: macOS All Applications (72% complete)
INSERT INTO autonomous_deployments (id, deployment_name, applications, start_option, start_config, overall_status, installed_pct, created_by, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'macOS All Applications',
  '["chrome", "firefox", "zoom", "slack"]'::jsonb,
  'days',
  '{"days": 0}'::jsonb,
  'In Progress',
  72,
  'Mac Admin',
  '2024-08-15 10:00:00+00',
  '2025-10-27 10:00:00+00'
);

-- Insert dep_002: Linux All Application Except Server Application (35% complete)
INSERT INTO autonomous_deployments (id, deployment_name, applications, start_option, start_config, overall_status, installed_pct, created_by, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  'Linux All Application Except Server Application',
  '["chrome", "firefox", "vscode"]'::jsonb,
  'weekDay',
  '{"entries": [{"week": "2", "day": "Mon"}]}'::jsonb,
  'In Progress',
  35,
  'Admin',
  '2024-09-01 14:30:00+00',
  '2025-10-27 10:00:00+00'
);

-- Insert dep_003: Windows OS Applications (5% complete)
INSERT INTO autonomous_deployments (id, deployment_name, applications, start_option, start_config, overall_status, installed_pct, created_by, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-333333333333',
  'Windows OS Applications',
  '["chrome", "acrobat"]'::jsonb,
  'days',
  '{"days": 7}'::jsonb,
  'Yet to apply',
  5,
  'Admin',
  '2025-10-01 08:00:00+00',
  '2025-10-27 10:00:00+00'
);

-- Insert dep_004: Windows All Applications Except SQL Server (100% complete)
INSERT INTO autonomous_deployments (id, deployment_name, applications, start_option, start_config, overall_status, installed_pct, created_by, created_at, updated_at)
VALUES (
  '44444444-4444-4444-4444-444444444444',
  'Windows All Applications Excepet SQL Server',
  '["chrome", "slack", "vscode", "zoom", "firefox"]'::jsonb,
  'calendarDay',
  '{"day": "15"}'::jsonb,
  'Installed',
  100,
  'Admin',
  '2024-06-10 12:00:00+00',
  '2025-08-20 16:00:00+00'
);

-- ========================================
-- dep_001 Rings
-- ========================================
INSERT INTO autonomous_deployment_rings (deployment_id, ring_number, ring_name, targets, pass_criteria_pct, wait_days)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 1, 'Internal users', '["it-lab-macos", "it-admins"]'::jsonb, 60, 2),
  ('11111111-1111-1111-1111-111111111111', 2, 'Early adopters', '["engineering-macbooks", "qa-pool"]'::jsonb, 80, 3),
  ('11111111-1111-1111-1111-111111111111', 3, 'All Users', '["marketing", "sales", "remote"]'::jsonb, NULL, NULL);

-- ========================================
-- dep_001 Groups
-- ========================================

-- dep_001 Group g1 (Future - Yet to apply)
INSERT INTO autonomous_deployment_groups (id, deployment_id, group_id, start_date, end_date, status, targets, yet_to_apply, in_progress, installed, failed, installed_pct)
VALUES (
  'a1111111-1111-1111-0001-111111111111',
  '11111111-1111-1111-1111-111111111111',
  'g1',
  '2025-11-15 10:00:00+00',
  '2025-12-14 09:59:00+00',
  'Yet to apply',
  500,
  500,
  0,
  0,
  0,
  0
);

-- dep_001 Group g0 (Current - In Progress with high completion)
INSERT INTO autonomous_deployment_groups (id, deployment_id, group_id, start_date, end_date, status, targets, yet_to_apply, in_progress, installed, failed, installed_pct)
VALUES (
  'a1111111-1111-1111-0000-111111111111',
  '11111111-1111-1111-1111-111111111111',
  'g0',
  '2025-10-16 10:00:00+00',
  '2025-11-14 09:59:00+00',
  'In Progress',
  500,
  40,
  100,
  360,
  0,
  72
);

-- dep_001 Group g-1 (Past - Installed)
INSERT INTO autonomous_deployment_groups (id, deployment_id, group_id, start_date, end_date, status, targets, yet_to_apply, in_progress, installed, failed, installed_pct)
VALUES (
  'a1111111-1111-1111-ff01-111111111111',
  '11111111-1111-1111-1111-111111111111',
  'g-1',
  '2025-09-16 10:00:00+00',
  '2025-10-15 09:59:00+00',
  'Installed',
  485,
  0,
  0,
  485,
  0,
  100
);

-- ========================================
-- dep_001 Group Rings (for g0 - current active group)
-- ========================================
INSERT INTO autonomous_deployment_group_rings (group_id, ring_name, status, targets, yet_to_apply, in_progress, installed, failed, installed_pct, hint)
VALUES 
  ('a1111111-1111-1111-0000-111111111111', 'Internal users', 'Installed', 150, 0, 0, 150, 0, 100, ''),
  ('a1111111-1111-1111-0000-111111111111', 'Early adopters', 'In Progress', 200, 20, 60, 120, 0, 60, ''),
  ('a1111111-1111-1111-0000-111111111111', 'All Users', 'Yet to apply', 150, 20, 40, 90, 0, 60, 'Waiting for Early adopters ≥ 80%');

-- ========================================
-- dep_002 Rings
-- ========================================
INSERT INTO autonomous_deployment_rings (deployment_id, ring_number, ring_name, targets, pass_criteria_pct, wait_days)
VALUES 
  ('22222222-2222-2222-2222-222222222222', 1, 'Internal users', '["it-admins", "pilot"]'::jsonb, 60, 2),
  ('22222222-2222-2222-2222-222222222222', 2, 'Early adopters', '["qa-lab", "engineering"]'::jsonb, 80, 3),
  ('22222222-2222-2222-2222-222222222222', 3, 'All Users', '["all-devices"]'::jsonb, NULL, NULL);

-- ========================================
-- dep_002 Groups
-- ========================================

-- dep_002 Group g1 (Future)
INSERT INTO autonomous_deployment_groups (id, deployment_id, group_id, start_date, end_date, status, targets, yet_to_apply, in_progress, installed, failed, installed_pct)
VALUES (
  'a2222222-2222-2222-0001-222222222222',
  '22222222-2222-2222-2222-222222222222',
  'g1',
  '2025-11-12 19:00:00+00',
  '2025-12-11 18:59:00+00',
  'Yet to apply',
  300,
  300,
  0,
  0,
  0,
  0
);

-- dep_002 Group g0 (Current - Early progress)
INSERT INTO autonomous_deployment_groups (id, deployment_id, group_id, start_date, end_date, status, targets, yet_to_apply, in_progress, installed, failed, installed_pct)
VALUES (
  'a2222222-2222-2222-0000-222222222222',
  '22222222-2222-2222-2222-222222222222',
  'g0',
  '2025-10-16 20:00:00+00',
  '2025-11-12 18:59:00+00',
  'In Progress',
  300,
  240,
  45,
  10,
  5,
  3
);

-- dep_002 Group g-1 (Past - Completed)
INSERT INTO autonomous_deployment_groups (id, deployment_id, group_id, start_date, end_date, status, targets, yet_to_apply, in_progress, installed, failed, installed_pct)
VALUES (
  'a2222222-2222-2222-ff01-222222222222',
  '22222222-2222-2222-2222-222222222222',
  'g-1',
  '2025-09-12 19:00:00+00',
  '2025-10-16 19:59:00+00',
  'Installed',
  292,
  0,
  0,
  292,
  0,
  100
);

-- ========================================
-- dep_002 Group Rings (for g0)
-- ========================================
INSERT INTO autonomous_deployment_group_rings (group_id, ring_name, status, targets, yet_to_apply, in_progress, installed, failed, installed_pct, hint)
VALUES 
  ('a2222222-2222-2222-0000-222222222222', 'Internal users', 'In Progress', 100, 30, 8, 62, 0, 62, ''),
  ('a2222222-2222-2222-0000-222222222222', 'Early adopters', 'Yet to apply', 120, 120, 0, 0, 0, 0, 'Waiting for Internal users ≥ 60%'),
  ('a2222222-2222-2222-0000-222222222222', 'All Users', 'Yet to apply', 80, 80, 0, 0, 0, 0, 'Waiting for Early adopters ≥ 80%');

-- ========================================
-- dep_003 Rings
-- ========================================
INSERT INTO autonomous_deployment_rings (deployment_id, ring_number, ring_name, targets, pass_criteria_pct, wait_days)
VALUES 
  ('33333333-3333-3333-3333-333333333333', 1, 'Internal users', '["it-admins"]'::jsonb, 60, 2),
  ('33333333-3333-3333-3333-333333333333', 2, 'Early adopters', '["pilot", "qa-lab"]'::jsonb, 80, 3),
  ('33333333-3333-3333-3333-333333333333', 3, 'All Users', '["finance", "engineering", "all-devices"]'::jsonb, NULL, NULL);

-- ========================================
-- dep_003 Groups
-- ========================================

-- dep_003 Group g1 (Current - Just starting)
INSERT INTO autonomous_deployment_groups (id, deployment_id, group_id, start_date, end_date, status, targets, yet_to_apply, in_progress, installed, failed, installed_pct)
VALUES (
  'a3333333-3333-3333-0001-333333333333',
  '33333333-3333-3333-3333-333333333333',
  'g1',
  '2025-10-25 08:00:00+00',
  '2025-11-24 07:59:00+00',
  'Yet to apply',
  400,
  380,
  15,
  5,
  0,
  1
);

-- dep_003 Group g0 (Past - Completed)
INSERT INTO autonomous_deployment_groups (id, deployment_id, group_id, start_date, end_date, status, targets, yet_to_apply, in_progress, installed, failed, installed_pct)
VALUES (
  'a3333333-3333-3333-0000-333333333333',
  '33333333-3333-3333-3333-333333333333',
  'g0',
  '2025-09-25 08:00:00+00',
  '2025-10-24 07:59:00+00',
  'Installed',
  395,
  0,
  0,
  390,
  5,
  99
);

-- ========================================
-- dep_003 Group Rings (for g1)
-- ========================================
INSERT INTO autonomous_deployment_group_rings (group_id, ring_name, status, targets, yet_to_apply, in_progress, installed, failed, installed_pct, hint)
VALUES 
  ('a3333333-3333-3333-0001-333333333333', 'Internal users', 'Yet to apply', 50, 45, 5, 0, 0, 0, 'Waiting for boundary'),
  ('a3333333-3333-3333-0001-333333333333', 'Early adopters', 'Yet to apply', 150, 150, 0, 0, 0, 0, 'Waiting for Internal users ≥ 60%'),
  ('a3333333-3333-3333-0001-333333333333', 'All Users', 'Yet to apply', 200, 185, 10, 5, 0, 3, 'Waiting for Early adopters ≥ 80%');

-- ========================================
-- dep_004 Rings
-- ========================================
INSERT INTO autonomous_deployment_rings (deployment_id, ring_number, ring_name, targets, pass_criteria_pct, wait_days)
VALUES 
  ('44444444-4444-4444-4444-444444444444', 1, 'Internal users', '["it-admins", "pilot"]'::jsonb, 60, 2),
  ('44444444-4444-4444-4444-444444444444', 2, 'Early adopters', '["qa-lab", "engineering", "finance"]'::jsonb, 80, 3),
  ('44444444-4444-4444-4444-444444444444', 3, 'All Users', '["remote", "all-devices"]'::jsonb, NULL, NULL);

-- ========================================
-- dep_004 Groups
-- ========================================

-- dep_004 Group g1 (Current - Completed)
INSERT INTO autonomous_deployment_groups (id, deployment_id, group_id, start_date, end_date, status, targets, yet_to_apply, in_progress, installed, failed, installed_pct)
VALUES (
  'a4444444-4444-4444-0001-444444444444',
  '44444444-4444-4444-4444-444444444444',
  'g1',
  '2025-10-15 12:00:00+00',
  '2025-11-14 11:59:00+00',
  'Installed',
  600,
  0,
  0,
  600,
  0,
  100
);

-- dep_004 Group g0 (Past - Completed)
INSERT INTO autonomous_deployment_groups (id, deployment_id, group_id, start_date, end_date, status, targets, yet_to_apply, in_progress, installed, failed, installed_pct)
VALUES (
  'a4444444-4444-4444-0000-444444444444',
  '44444444-4444-4444-4444-444444444444',
  'g0',
  '2025-09-15 12:00:00+00',
  '2025-10-14 11:59:00+00',
  'Installed',
  595,
  0,
  0,
  595,
  0,
  100
);

-- dep_004 Group g-1 (Past - Completed)
INSERT INTO autonomous_deployment_groups (id, deployment_id, group_id, start_date, end_date, status, targets, yet_to_apply, in_progress, installed, failed, installed_pct)
VALUES (
  'a4444444-4444-4444-ff01-444444444444',
  '44444444-4444-4444-4444-444444444444',
  'g-1',
  '2025-08-15 12:00:00+00',
  '2025-09-14 11:59:00+00',
  'Installed',
  590,
  0,
  0,
  590,
  0,
  100
);

-- ========================================
-- dep_004 Group Rings (for g1 - all completed)
-- ========================================
INSERT INTO autonomous_deployment_group_rings (group_id, ring_name, status, targets, yet_to_apply, in_progress, installed, failed, installed_pct, hint)
VALUES 
  ('a4444444-4444-4444-0001-444444444444', 'Internal users', 'Installed', 100, 0, 0, 100, 0, 100, ''),
  ('a4444444-4444-4444-0001-444444444444', 'Early adopters', 'Installed', 250, 0, 0, 250, 0, 100, ''),
  ('a4444444-4444-4444-0001-444444444444', 'All Users', 'Installed', 250, 0, 0, 250, 0, 100, '');
