/*
  # Populate Autonomous Status Seed Data

  ## Overview
  This migration populates the autonomous_status field for existing seed data in the autonomous deployment tables based on their current progress and completion states.

  ## Status Assignment Strategy

  ### dep_001: macOS All Applications (72% complete)
  - Overall: In Progress
  - g1 (future): Yet to apply
  - g0 (current, 72%): In Progress
  - g-1 (past, 100%): Installed

  ### dep_002: Linux All Application Except Server Application (35% complete)
  - Overall: In Progress
  - g1 (future): Yet to apply
  - g0 (current, 3%): In Progress
  - g-1 (past, 100%): Installed

  ### dep_003: Windows OS Applications (5% complete)
  - Overall: In Progress
  - g1 (current, 1%): In Progress
  - g0 (past, 99%): Installed

  ### dep_004: Windows All Applications Except SQL Server (100% complete)
  - Overall: Completed
  - g1 (current, 100%): Installed
  - g0 (past, 100%): Installed
  - g-1 (past, 100%): Installed

  ## Ring Status Logic
  - Based on installed_pct:
    - 0%: Yet to apply
    - 1-99%: In Progress
    - 100%: Installed
*/

-- ========================================
-- dep_001: macOS All Applications
-- ========================================

-- Update deployment overall status
UPDATE autonomous_deployments
SET autonomous_status = 'In Progress'
WHERE id = '11111111-1111-1111-1111-111111111111';

-- Update group statuses
UPDATE autonomous_deployment_groups
SET autonomous_status = 'Yet to apply'
WHERE id = 'a1111111-1111-1111-0001-111111111111'; -- g1

UPDATE autonomous_deployment_groups
SET autonomous_status = 'In Progress'
WHERE id = 'a1111111-1111-1111-0000-111111111111'; -- g0

UPDATE autonomous_deployment_groups
SET autonomous_status = 'Installed'
WHERE id = 'a1111111-1111-1111-ff01-111111111111'; -- g-1

-- Update ring statuses for g0 (current active group)
UPDATE autonomous_deployment_group_rings
SET autonomous_status = 'Installed'
WHERE group_id = 'a1111111-1111-1111-0000-111111111111'
AND ring_name = 'Internal users';

UPDATE autonomous_deployment_group_rings
SET autonomous_status = 'In Progress'
WHERE group_id = 'a1111111-1111-1111-0000-111111111111'
AND ring_name = 'Early adopters';

UPDATE autonomous_deployment_group_rings
SET autonomous_status = 'In Progress'
WHERE group_id = 'a1111111-1111-1111-0000-111111111111'
AND ring_name = 'All Users';

-- ========================================
-- dep_002: Linux All Application Except Server Application
-- ========================================

-- Update deployment overall status
UPDATE autonomous_deployments
SET autonomous_status = 'In Progress'
WHERE id = '22222222-2222-2222-2222-222222222222';

-- Update group statuses
UPDATE autonomous_deployment_groups
SET autonomous_status = 'Yet to apply'
WHERE id = 'a2222222-2222-2222-0001-222222222222'; -- g1

UPDATE autonomous_deployment_groups
SET autonomous_status = 'In Progress'
WHERE id = 'a2222222-2222-2222-0000-222222222222'; -- g0

UPDATE autonomous_deployment_groups
SET autonomous_status = 'Installed'
WHERE id = 'a2222222-2222-2222-ff01-222222222222'; -- g-1

-- Update ring statuses for g0 (current active group)
UPDATE autonomous_deployment_group_rings
SET autonomous_status = 'In Progress'
WHERE group_id = 'a2222222-2222-2222-0000-222222222222'
AND ring_name = 'Internal users';

UPDATE autonomous_deployment_group_rings
SET autonomous_status = 'Yet to apply'
WHERE group_id = 'a2222222-2222-2222-0000-222222222222'
AND ring_name = 'Early adopters';

UPDATE autonomous_deployment_group_rings
SET autonomous_status = 'Yet to apply'
WHERE group_id = 'a2222222-2222-2222-0000-222222222222'
AND ring_name = 'All Users';

-- ========================================
-- dep_003: Windows OS Applications
-- ========================================

-- Update deployment overall status
UPDATE autonomous_deployments
SET autonomous_status = 'In Progress'
WHERE id = '33333333-3333-3333-3333-333333333333';

-- Update group statuses
UPDATE autonomous_deployment_groups
SET autonomous_status = 'In Progress'
WHERE id = 'a3333333-3333-3333-0001-333333333333'; -- g1

UPDATE autonomous_deployment_groups
SET autonomous_status = 'Installed'
WHERE id = 'a3333333-3333-3333-0000-333333333333'; -- g0

-- Update ring statuses for g1 (current active group)
UPDATE autonomous_deployment_group_rings
SET autonomous_status = 'Yet to apply'
WHERE group_id = 'a3333333-3333-3333-0001-333333333333'
AND ring_name = 'Internal users';

UPDATE autonomous_deployment_group_rings
SET autonomous_status = 'Yet to apply'
WHERE group_id = 'a3333333-3333-3333-0001-333333333333'
AND ring_name = 'Early adopters';

UPDATE autonomous_deployment_group_rings
SET autonomous_status = 'In Progress'
WHERE group_id = 'a3333333-3333-3333-0001-333333333333'
AND ring_name = 'All Users';

-- ========================================
-- dep_004: Windows All Applications Except SQL Server
-- ========================================

-- Update deployment overall status
UPDATE autonomous_deployments
SET autonomous_status = 'Completed'
WHERE id = '44444444-4444-4444-4444-444444444444';

-- Update group statuses
UPDATE autonomous_deployment_groups
SET autonomous_status = 'Installed'
WHERE id = 'a4444444-4444-4444-0001-444444444444'; -- g1

UPDATE autonomous_deployment_groups
SET autonomous_status = 'Installed'
WHERE id = 'a4444444-4444-4444-0000-444444444444'; -- g0

UPDATE autonomous_deployment_groups
SET autonomous_status = 'Installed'
WHERE id = 'a4444444-4444-4444-ff01-444444444444'; -- g-1

-- Update ring statuses for g1 (current active group - all completed)
UPDATE autonomous_deployment_group_rings
SET autonomous_status = 'Installed'
WHERE group_id = 'a4444444-4444-4444-0001-444444444444'
AND ring_name = 'Internal users';

UPDATE autonomous_deployment_group_rings
SET autonomous_status = 'Installed'
WHERE group_id = 'a4444444-4444-4444-0001-444444444444'
AND ring_name = 'Early adopters';

UPDATE autonomous_deployment_group_rings
SET autonomous_status = 'Installed'
WHERE group_id = 'a4444444-4444-4444-0001-444444444444'
AND ring_name = 'All Users';
