/*
  # Update Seed Data with Ring Start and End Times

  ## Overview
  This migration updates existing ring records to include start and end times.
  Ring times represent when each ring begins and ends its deployment phase within a group.

  ## Ring Time Logic
  - Ring 1 (Internal users): Starts at group start time
  - Ring 2 (Early adopters): Starts after Ring 1 meets criteria + wait days
  - Ring 3 (All Users): Starts after Ring 2 meets criteria + wait days
  - End times are calculated based on expected completion or group end time

  ## Time Assignments

  ### dep_001 Group g0 (In Progress - High completion)
  - Internal users: Started, Completed
  - Early adopters: Started, In progress
  - All Users: Started, In progress

  ### dep_002 Group g0 (Early Progress)
  - Internal users: Started, In progress
  - Early adopters: Not started yet (waiting for criteria)
  - All Users: Not started yet (waiting for criteria)

  ### dep_003 Group g1 (Just Starting)
  - Internal users: Started, Early stage
  - Early adopters: Not started (waiting)
  - All Users: Not started (waiting)

  ### dep_004 Group g1 (Completed)
  - All rings: Started and Completed
*/

-- ========================================
-- Update dep_001 Group g0 ring times
-- ========================================

-- Internal users: Started at group start, completed early
UPDATE autonomous_deployment_group_rings
SET
  start_time = '2025-10-16 10:00:00+00',
  end_time = '2025-10-20 15:30:00+00'
WHERE group_id = 'a1111111-1111-1111-0000-111111111111'
  AND ring_name = 'Internal users';

-- Early adopters: Started after wait period, currently in progress
UPDATE autonomous_deployment_group_rings
SET
  start_time = '2025-10-18 10:00:00+00',
  end_time = NULL
WHERE group_id = 'a1111111-1111-1111-0000-111111111111'
  AND ring_name = 'Early adopters';

-- All Users: Started after Ring 2 progress, in progress
UPDATE autonomous_deployment_group_rings
SET
  start_time = '2025-10-22 10:00:00+00',
  end_time = NULL
WHERE group_id = 'a1111111-1111-1111-0000-111111111111'
  AND ring_name = 'All Users';

-- ========================================
-- Update dep_002 Group g0 ring times
-- ========================================

-- Internal users: Started at group start, still in progress
UPDATE autonomous_deployment_group_rings
SET
  start_time = '2025-10-16 20:00:00+00',
  end_time = NULL
WHERE group_id = 'a2222222-2222-2222-0000-222222222222'
  AND ring_name = 'Internal users';

-- Early adopters: Not started (waiting for Ring 1 to reach 60%)
UPDATE autonomous_deployment_group_rings
SET
  start_time = NULL,
  end_time = NULL
WHERE group_id = 'a2222222-2222-2222-0000-222222222222'
  AND ring_name = 'Early adopters';

-- All Users: Not started (waiting for Ring 2)
UPDATE autonomous_deployment_group_rings
SET
  start_time = NULL,
  end_time = NULL
WHERE group_id = 'a2222222-2222-2222-0000-222222222222'
  AND ring_name = 'All Users';

-- ========================================
-- Update dep_003 Group g1 ring times
-- ========================================

-- Internal users: Just started
UPDATE autonomous_deployment_group_rings
SET
  start_time = '2025-10-25 08:00:00+00',
  end_time = NULL
WHERE group_id = 'a3333333-3333-3333-0001-333333333333'
  AND ring_name = 'Internal users';

-- Early adopters: Not started (waiting)
UPDATE autonomous_deployment_group_rings
SET
  start_time = NULL,
  end_time = NULL
WHERE group_id = 'a3333333-3333-3333-0001-333333333333'
  AND ring_name = 'Early adopters';

-- All Users: Not started (waiting)
UPDATE autonomous_deployment_group_rings
SET
  start_time = NULL,
  end_time = NULL
WHERE group_id = 'a3333333-3333-3333-0001-333333333333'
  AND ring_name = 'All Users';

-- ========================================
-- Update dep_004 Group g1 ring times
-- ========================================

-- Internal users: Completed
UPDATE autonomous_deployment_group_rings
SET
  start_time = '2025-10-15 12:00:00+00',
  end_time = '2025-10-18 14:30:00+00'
WHERE group_id = 'a4444444-4444-4444-0001-444444444444'
  AND ring_name = 'Internal users';

-- Early adopters: Completed
UPDATE autonomous_deployment_group_rings
SET
  start_time = '2025-10-17 12:00:00+00',
  end_time = '2025-10-24 16:45:00+00'
WHERE group_id = 'a4444444-4444-4444-0001-444444444444'
  AND ring_name = 'Early adopters';

-- All Users: Completed
UPDATE autonomous_deployment_group_rings
SET
  start_time = '2025-10-27 12:00:00+00',
  end_time = '2025-11-05 10:20:00+00'
WHERE group_id = 'a4444444-4444-4444-0001-444444444444'
  AND ring_name = 'All Users';
