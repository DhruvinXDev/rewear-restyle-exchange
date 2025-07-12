-- ReWear Complete Database Schema
-- Run this in phpMyAdmin or MySQL CLI to set up your database

-- Create database (if not exists)
CREATE DATABASE IF NOT EXISTS rewear_db;
USE rewear_db;

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS points_history;
DROP TABLE IF EXISTS swap_history;
DROP TABLE IF EXISTS listings;
DROP TABLE IF EXISTS user_profiles;

-- Create user_profiles table
CREATE TABLE user_profiles (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  bio TEXT,
  avatar_url TEXT,
  points INT DEFAULT 0,
  role ENUM('user', 'admin') DEFAULT 'user',
  referral_code VARCHAR(20) UNIQUE NOT NULL,
  is_banned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_referral_code (referral_code)
);

-- Create listings table
CREATE TABLE listings (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  category VARCHAR(100),
  `condition` VARCHAR(50),
  points INT DEFAULT 0,
  status ENUM('pending', 'approved', 'rejected', 'spam') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_category (category)
);

-- Create swap_history table
CREATE TABLE swap_history (
  id VARCHAR(36) PRIMARY KEY,
  sender_id VARCHAR(36) NOT NULL,
  receiver_id VARCHAR(36) NOT NULL,
  listing_id VARCHAR(36) NOT NULL,
  status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES user_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES user_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE,
  INDEX idx_sender_id (sender_id),
  INDEX idx_receiver_id (receiver_id),
  INDEX idx_listing_id (listing_id),
  INDEX idx_status (status)
);

-- Create points_history table
CREATE TABLE points_history (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  points INT NOT NULL,
  action VARCHAR(50) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_action (action),
  INDEX idx_created_at (created_at)
);

-- Insert sample admin user (password: admin123)
INSERT INTO user_profiles (id, email, name, password, role, referral_code, points) VALUES
(
  'admin-001',
  'admin@rewear.com',
  'Admin User',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK8i',
  'admin',
  'ADMIN001',
  1000
);

-- Insert sample regular users (password: admin123)
INSERT INTO user_profiles (id, email, name, password, role, referral_code, points, bio) VALUES
(
  'user-001',
  'user1@example.com',
  'John Doe',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK8i',
  'user',
  'USER001',
  250,
  'Fashion enthusiast who loves sustainable clothing swaps!'
),
(
  'user-002',
  'user2@example.com',
  'Jane Smith',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK8i',
  'user',
  'USER002',
  150,
  'Passionate about reducing fashion waste through clothing exchange.'
),
(
  'user-003',
  'user3@example.com',
  'Mike Johnson',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK8i',
  'user',
  'USER003',
  75,
  'New to sustainable fashion, excited to join the community!'
);

-- Insert sample listings
INSERT INTO listings (id, user_id, title, description, category, `condition`, points, status) VALUES
(
  'listing-001',
  'user-001',
  'Vintage Denim Jacket',
  'Classic vintage denim jacket in excellent condition. Perfect for any casual outfit. Size M, authentic vintage piece from the 90s.',
  'Jackets',
  'Excellent',
  25,
  'approved'
),
(
  'listing-002',
  'user-002',
  'Floral Summer Dress',
  'Beautiful floral pattern dress perfect for summer. Light and comfortable fabric, perfect for outdoor events. Size S.',
  'Dresses',
  'Good',
  20,
  'approved'
),
(
  'listing-003',
  'admin-001',
  'Cozy Knit Sweater',
  'Warm and comfortable knit sweater. Perfect for cold weather. Made from soft wool blend, size L.',
  'Sweaters',
  'Fair',
  15,
  'pending'
),
(
  'listing-004',
  'user-001',
  'Leather Crossbody Bag',
  'Stylish leather crossbody bag in brown. Perfect for everyday use, has multiple compartments. Great condition.',
  'Bags',
  'Like New',
  30,
  'approved'
),
(
  'listing-005',
  'user-003',
  'White Sneakers',
  'Clean white sneakers, barely worn. Comfortable and versatile for any outfit. Size 9.',
  'Shoes',
  'Like New',
  18,
  'approved'
),
(
  'listing-006',
  'user-002',
  'Silk Blouse',
  'Elegant silk blouse in navy blue. Perfect for professional settings. Size M, excellent condition.',
  'Tops',
  'Excellent',
  22,
  'pending'
);

-- Insert sample swap history
INSERT INTO swap_history (id, sender_id, receiver_id, listing_id, status) VALUES
(
  'swap-001',
  'user-001',
  'user-002',
  'listing-001',
  'completed'
),
(
  'swap-002',
  'user-002',
  'admin-001',
  'listing-002',
  'pending'
),
(
  'swap-003',
  'user-003',
  'user-001',
  'listing-005',
  'completed'
);

-- Insert sample points history
INSERT INTO points_history (id, user_id, points, action, description) VALUES
(
  'points-001',
  'user-001',
  50,
  'swap_completed',
  'Completed clothing swap: Vintage Denim Jacket'
),
(
  'points-002',
  'user-001',
  25,
  'listing_created',
  'Created new listing: Vintage Denim Jacket'
),
(
  'points-003',
  'user-001',
  30,
  'listing_created',
  'Created new listing: Leather Crossbody Bag'
),
(
  'points-004',
  'user-002',
  50,
  'swap_completed',
  'Completed clothing swap: Floral Summer Dress'
),
(
  'points-005',
  'user-002',
  20,
  'listing_created',
  'Created new listing: Floral Summer Dress'
),
(
  'points-006',
  'user-002',
  22,
  'listing_created',
  'Created new listing: Silk Blouse'
),
(
  'points-007',
  'user-003',
  50,
  'swap_completed',
  'Completed clothing swap: White Sneakers'
),
(
  'points-008',
  'user-003',
  18,
  'listing_created',
  'Created new listing: White Sneakers'
),
(
  'points-009',
  'admin-001',
  15,
  'listing_created',
  'Created new listing: Cozy Knit Sweater'
);

-- Show tables
SHOW TABLES;

-- Show sample data
SELECT 'User Profiles:' as info;
SELECT id, email, name, role, points, created_at FROM user_profiles;

SELECT 'Listings:' as info;
SELECT id, title, category, status, points, created_at FROM listings;

SELECT 'Swap History:' as info;
SELECT id, status, created_at FROM swap_history;

SELECT 'Points History:' as info;
SELECT user_id, points, action, created_at FROM points_history;

-- Show table structure
DESCRIBE user_profiles;
DESCRIBE listings;
DESCRIBE swap_history;
DESCRIBE points_history; 