-- =====================================================
-- Add Admin User: n.laaziri@gmail.com
-- =====================================================
-- 
-- Run this SQL command in your MySQL database to create the admin user.
-- 
-- Option 1: If the user doesn't exist yet, INSERT a new admin user
-- Option 2: If the user already exists, UPDATE their role to admin
-- =====================================================

-- First, check if user exists and update to admin, or insert new admin
-- The password hash below is for: Admin123!
-- You should change this password after first login

-- Option A: Update existing user to admin
UPDATE users 
SET role = 'admin' 
WHERE email = 'n.laaziri@gmail.com';

-- Option B: If user doesn't exist, insert new admin user
-- Password: Admin123! (bcrypt hash with 12 rounds)
INSERT INTO users (name, email, password, phone, role, created_at) 
SELECT 'Admin Laaziri', 'n.laaziri@gmail.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X.VQtQHj5v0dq3jKG', '+212600000000', 'admin', NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'n.laaziri@gmail.com');

-- Verify the user was created/updated
SELECT id, name, email, role, created_at FROM users WHERE email = 'n.laaziri@gmail.com';
