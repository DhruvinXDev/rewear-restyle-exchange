-- Create Admin User Script
-- Run this in your Supabase SQL Editor after setting up the schema

-- First, create the user in Supabase Auth (you'll need to do this manually in the Auth section)
-- Then run this script to create the admin profile

-- Replace 'YOUR_ADMIN_USER_ID' with the actual user ID from Supabase Auth
-- You can find this in the Supabase Dashboard > Authentication > Users

INSERT INTO user_profiles (
  id,
  email,
  name,
  points,
  role,
  referral_code,
  created_at,
  updated_at
) VALUES (
  'YOUR_ADMIN_USER_ID', -- Replace with actual user ID
  'admin@rewear.com',   -- Replace with your admin email
  'Admin User',         -- Replace with admin name
  1000,                 -- Starting points
  'admin',              -- Admin role
  'ADMIN001',           -- Referral code
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  updated_at = NOW();

-- Verify the admin was created
SELECT * FROM user_profiles WHERE role = 'admin';

-- Optional: Add some sample data for testing
INSERT INTO listings (user_id, title, description, category, condition, points, status) VALUES
  ('YOUR_ADMIN_USER_ID', 'Vintage Denim Jacket', 'Classic vintage denim jacket in excellent condition', 'Jackets', 'Excellent', 25, 'approved'),
  ('YOUR_ADMIN_USER_ID', 'Floral Summer Dress', 'Beautiful floral pattern dress perfect for summer', 'Dresses', 'Good', 20, 'approved')
ON CONFLICT DO NOTHING;

-- Add some sample swap history
INSERT INTO swap_history (sender_id, receiver_id, listing_id, status) VALUES
  ('YOUR_ADMIN_USER_ID', '00000000-0000-0000-0000-000000000002', (SELECT id FROM listings WHERE user_id = 'YOUR_ADMIN_USER_ID' LIMIT 1), 'completed')
ON CONFLICT DO NOTHING;

-- Add some points history
INSERT INTO points_history (user_id, points, action, description) VALUES
  ('YOUR_ADMIN_USER_ID', 50, 'swap_completed', 'Completed a clothing swap'),
  ('YOUR_ADMIN_USER_ID', 25, 'listing_created', 'Created a new listing')
ON CONFLICT DO NOTHING; 