-- ============================================================================
-- IPA Question Tool - Demo User Sample Data
-- Generated: 2026-02-18
-- ============================================================================
--
-- INSTRUCTIONS:
-- Run this SQL in the Supabase SQL Editor to create sample apprentices
-- and question assignments for the demo user (demo@ipa.wid.li).
--
-- Demo user UUID: 08f2521f-9d60-4b15-bd7b-2708ea99bd66
-- ============================================================================

-- ============================================================================
-- PART 1: Insert sample apprentices for the demo user
-- ============================================================================

INSERT INTO apprentice (belongs_to, first_name, last_name, address_link, project_title, project_short_description, expert_role, topics, is_active)
VALUES
  (
    '08f2521f-9d60-4b15-bd7b-2708ea99bd66',
    'Luca',
    'Meier',
    'Zürich, Schweiz',
    'Webshop Modernisierung',
    'Migration eines bestehenden Webshops auf eine moderne Microservice-Architektur mit .NET 8 und React.',
    'Hauptexperte',
    ARRAY['C#', '.NET', 'React', 'SQL', 'Docker'],
    true
  ),
  (
    '08f2521f-9d60-4b15-bd7b-2708ea99bd66',
    'Sara',
    'Keller',
    'Bern, Schweiz',
    'Inventarverwaltung Mobile App',
    'Entwicklung einer plattformübergreifenden Mobile App zur Inventarverwaltung mit .NET MAUI und SQLite.',
    'Nebenexperte',
    ARRAY['C#', '.NET MAUI', 'SQLite', 'REST API'],
    true
  ),
  (
    '08f2521f-9d60-4b15-bd7b-2708ea99bd66',
    'Niklas',
    'Brunner',
    'Basel, Schweiz',
    'Monitoring Dashboard',
    'Aufbau eines Echtzeit-Monitoring-Dashboards für Serverinfrastruktur mit Blazor und SignalR.',
    'Hauptexperte',
    ARRAY['C#', 'Blazor', 'SignalR', 'Azure', 'Git'],
    false
  );

-- ============================================================================
-- PART 2: Assign questions to the apprentices
-- ============================================================================
-- This uses subqueries to find real question IDs from the database.
-- It picks a sample of questions from different topic complexes.
--
-- NOTE: If you get duplicate key errors, the questions may already be assigned.
-- You can safely ignore those errors or run with ON CONFLICT DO NOTHING.
-- ============================================================================

-- Assign ~10 questions to Luca Meier (first active apprentice)
-- We pick questions across different Fachbereiche
INSERT INTO apprentice_question (apprentice_id, question_id, comment, score, is_asked)
SELECT
  (SELECT id FROM apprentice WHERE first_name = 'Luca' AND last_name = 'Meier' AND belongs_to = '08f2521f-9d60-4b15-bd7b-2708ea99bd66' LIMIT 1),
  q.id,
  CASE
    WHEN ROW_NUMBER() OVER (ORDER BY q.id) = 1 THEN 'Gute Erklärung der Konzepte, aber Details fehlten.'
    WHEN ROW_NUMBER() OVER (ORDER BY q.id) = 3 THEN 'Konnte die Frage nicht vollständig beantworten.'
    ELSE NULL
  END,
  CASE
    WHEN ROW_NUMBER() OVER (ORDER BY q.id) = 1 THEN 2
    WHEN ROW_NUMBER() OVER (ORDER BY q.id) = 2 THEN 1
    WHEN ROW_NUMBER() OVER (ORDER BY q.id) = 3 THEN 0
    ELSE NULL
  END,
  CASE
    WHEN ROW_NUMBER() OVER (ORDER BY q.id) <= 3 THEN true
    ELSE false
  END
FROM question q
ORDER BY RANDOM()
LIMIT 10
ON CONFLICT DO NOTHING;

-- Assign ~8 questions to Sara Keller (second active apprentice)
INSERT INTO apprentice_question (apprentice_id, question_id, comment, score, is_asked)
SELECT
  (SELECT id FROM apprentice WHERE first_name = 'Sara' AND last_name = 'Keller' AND belongs_to = '08f2521f-9d60-4b15-bd7b-2708ea99bd66' LIMIT 1),
  q.id,
  CASE
    WHEN ROW_NUMBER() OVER (ORDER BY q.id) = 1 THEN 'Sehr detaillierte und korrekte Antwort.'
    WHEN ROW_NUMBER() OVER (ORDER BY q.id) = 2 THEN 'Teilweise richtig, Verbesserungspotential vorhanden.'
    ELSE NULL
  END,
  CASE
    WHEN ROW_NUMBER() OVER (ORDER BY q.id) = 1 THEN 2
    WHEN ROW_NUMBER() OVER (ORDER BY q.id) = 2 THEN 1
    ELSE NULL
  END,
  CASE
    WHEN ROW_NUMBER() OVER (ORDER BY q.id) <= 2 THEN true
    ELSE false
  END
FROM question q
ORDER BY RANDOM()
LIMIT 8
ON CONFLICT DO NOTHING;

-- Assign ~5 questions to Niklas Brunner (inactive apprentice - past exam)
INSERT INTO apprentice_question (apprentice_id, question_id, comment, score, is_asked)
SELECT
  (SELECT id FROM apprentice WHERE first_name = 'Niklas' AND last_name = 'Brunner' AND belongs_to = '08f2521f-9d60-4b15-bd7b-2708ea99bd66' LIMIT 1),
  q.id,
  'Prüfung abgeschlossen.',
  2,
  true
FROM question q
ORDER BY RANDOM()
LIMIT 5
ON CONFLICT DO NOTHING;
