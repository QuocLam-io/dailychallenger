-- Clean up unused test tables (drop in correct order due to foreign keys)
DROP TABLE IF EXISTS test_challenge_logs;
DROP TABLE IF EXISTS test_challenges;
DROP TABLE IF EXISTS tes_challenge;
DROP TABLE IF EXISTS user_connections;
