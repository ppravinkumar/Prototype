/*
  # Update Seed Data with Patch Information

  ## Overview
  This migration updates the existing autonomous deployment seed data to include patch tracking information.
  It adds realistic patch data to groups and rings to demonstrate the patch tracking functionality.

  ## Patch Information Added

  ### dep_001 Group g0 (Current - In Progress)
  - Patches: KB5032189, KB5032190, KB5032191
  - 3 patches total across the deployment
  - Ring-level patch progress varies with target progress
  - Internal users: All patches installed
  - Early adopters: Patches partially installed
  - All Users: Patches mostly yet to apply

  ### dep_002 Group g0 (Current - Early Progress)
  - Patches: KB5032200, KB5032201
  - 2 patches in early deployment stages
  - Most patches yet to apply across rings
  - Matches the overall early progress state

  ### dep_003 Group g1 (Current - Just Starting)
  - Patches: KB5032210, KB5032211, KB5032212, KB5032213
  - 4 patches in very early stages
  - Reflects the minimal progress characteristic
  - Most patches waiting for deployment

  ### dep_004 Group g1 (Current - Completed)
  - Patches: KB5032220, KB5032221
  - 2 patches fully installed
  - 100% completion across all rings
  - Demonstrates successful patch rollout

  ## Notes
  - Patch counts and progress align with existing target progress
  - Patch IDs follow KB article number conventions
  - Progress breakdown matches deployment status
  - Future groups have no patch data (not yet started)
*/

-- ========================================
-- Update dep_001 Group g0 with patch data
-- ========================================

-- Update group with patches
UPDATE autonomous_deployment_groups
SET
  patches = '["KB5032189", "KB5032190", "KB5032191"]'::jsonb,
  patch_yet_to_apply = 180,
  patch_in_progress = 120,
  patch_installed = 1080,
  patch_failed = 0,
  patch_installed_pct = 72
WHERE id = 'a1111111-1111-1111-0000-111111111111';

-- Update rings with patch data
UPDATE autonomous_deployment_group_rings
SET
  patches = '["KB5032189", "KB5032190", "KB5032191"]'::jsonb,
  patch_yet_to_apply = 0,
  patch_in_progress = 0,
  patch_installed = 450,
  patch_failed = 0,
  patch_installed_pct = 100
WHERE group_id = 'a1111111-1111-1111-0000-111111111111'
  AND ring_name = 'Internal users';

UPDATE autonomous_deployment_group_rings
SET
  patches = '["KB5032189", "KB5032190", "KB5032191"]'::jsonb,
  patch_yet_to_apply = 60,
  patch_in_progress = 180,
  patch_installed = 360,
  patch_failed = 0,
  patch_installed_pct = 60
WHERE group_id = 'a1111111-1111-1111-0000-111111111111'
  AND ring_name = 'Early adopters';

UPDATE autonomous_deployment_group_rings
SET
  patches = '["KB5032189", "KB5032190", "KB5032191"]'::jsonb,
  patch_yet_to_apply = 120,
  patch_in_progress = 60,
  patch_installed = 270,
  patch_failed = 0,
  patch_installed_pct = 60
WHERE group_id = 'a1111111-1111-1111-0000-111111111111'
  AND ring_name = 'All Users';

-- ========================================
-- Update dep_002 Group g0 with patch data
-- ========================================

-- Update group with patches
UPDATE autonomous_deployment_groups
SET
  patches = '["KB5032200", "KB5032201"]'::jsonb,
  patch_yet_to_apply = 560,
  patch_in_progress = 30,
  patch_installed = 10,
  patch_failed = 0,
  patch_installed_pct = 2
WHERE id = 'a2222222-2222-2222-0000-222222222222';

-- Update rings with patch data
UPDATE autonomous_deployment_group_rings
SET
  patches = '["KB5032200", "KB5032201"]'::jsonb,
  patch_yet_to_apply = 140,
  patch_in_progress = 10,
  patch_installed = 50,
  patch_failed = 0,
  patch_installed_pct = 25
WHERE group_id = 'a2222222-2222-2222-0000-222222222222'
  AND ring_name = 'Internal users';

UPDATE autonomous_deployment_group_rings
SET
  patches = '["KB5032200", "KB5032201"]'::jsonb,
  patch_yet_to_apply = 240,
  patch_in_progress = 0,
  patch_installed = 0,
  patch_failed = 0,
  patch_installed_pct = 0
WHERE group_id = 'a2222222-2222-2222-0000-222222222222'
  AND ring_name = 'Early adopters';

UPDATE autonomous_deployment_group_rings
SET
  patches = '["KB5032200", "KB5032201"]'::jsonb,
  patch_yet_to_apply = 160,
  patch_in_progress = 0,
  patch_installed = 0,
  patch_failed = 0,
  patch_installed_pct = 0
WHERE group_id = 'a2222222-2222-2222-0000-222222222222'
  AND ring_name = 'All Users';

-- ========================================
-- Update dep_003 Group g1 with patch data
-- ========================================

-- Update group with patches
UPDATE autonomous_deployment_groups
SET
  patches = '["KB5032210", "KB5032211", "KB5032212", "KB5032213"]'::jsonb,
  patch_yet_to_apply = 1560,
  patch_in_progress = 20,
  patch_installed = 20,
  patch_failed = 0,
  patch_installed_pct = 1
WHERE id = 'a3333333-3333-3333-0001-333333333333';

-- Update rings with patch data
UPDATE autonomous_deployment_group_rings
SET
  patches = '["KB5032210", "KB5032211", "KB5032212", "KB5032213"]'::jsonb,
  patch_yet_to_apply = 180,
  patch_in_progress = 20,
  patch_installed = 0,
  patch_failed = 0,
  patch_installed_pct = 0
WHERE group_id = 'a3333333-3333-3333-0001-333333333333'
  AND ring_name = 'Internal users';

UPDATE autonomous_deployment_group_rings
SET
  patches = '["KB5032210", "KB5032211", "KB5032212", "KB5032213"]'::jsonb,
  patch_yet_to_apply = 600,
  patch_in_progress = 0,
  patch_installed = 0,
  patch_failed = 0,
  patch_installed_pct = 0
WHERE group_id = 'a3333333-3333-3333-0001-333333333333'
  AND ring_name = 'Early adopters';

UPDATE autonomous_deployment_group_rings
SET
  patches = '["KB5032210", "KB5032211", "KB5032212", "KB5032213"]'::jsonb,
  patch_yet_to_apply = 780,
  patch_in_progress = 0,
  patch_installed = 20,
  patch_failed = 0,
  patch_installed_pct = 3
WHERE group_id = 'a3333333-3333-3333-0001-333333333333'
  AND ring_name = 'All Users';

-- ========================================
-- Update dep_004 Group g1 with patch data
-- ========================================

-- Update group with patches
UPDATE autonomous_deployment_groups
SET
  patches = '["KB5032220", "KB5032221"]'::jsonb,
  patch_yet_to_apply = 0,
  patch_in_progress = 0,
  patch_installed = 1200,
  patch_failed = 0,
  patch_installed_pct = 100
WHERE id = 'a4444444-4444-4444-0001-444444444444';

-- Update rings with patch data
UPDATE autonomous_deployment_group_rings
SET
  patches = '["KB5032220", "KB5032221"]'::jsonb,
  patch_yet_to_apply = 0,
  patch_in_progress = 0,
  patch_installed = 200,
  patch_failed = 0,
  patch_installed_pct = 100
WHERE group_id = 'a4444444-4444-4444-0001-444444444444'
  AND ring_name = 'Internal users';

UPDATE autonomous_deployment_group_rings
SET
  patches = '["KB5032220", "KB5032221"]'::jsonb,
  patch_yet_to_apply = 0,
  patch_in_progress = 0,
  patch_installed = 500,
  patch_failed = 0,
  patch_installed_pct = 100
WHERE group_id = 'a4444444-4444-4444-0001-444444444444'
  AND ring_name = 'Early adopters';

UPDATE autonomous_deployment_group_rings
SET
  patches = '["KB5032220", "KB5032221"]'::jsonb,
  patch_yet_to_apply = 0,
  patch_in_progress = 0,
  patch_installed = 500,
  patch_failed = 0,
  patch_installed_pct = 100
WHERE group_id = 'a4444444-4444-4444-0001-444444444444'
  AND ring_name = 'All Users';
