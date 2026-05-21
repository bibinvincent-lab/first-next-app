-- Migration 001: Enhance Security Schema
-- This migration adds security enhancements to the database

-- Create rate limiting logs table
CREATE TABLE IF NOT EXISTS rate_limit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id VARCHAR(255) NOT NULL,
  endpoint VARCHAR(50) NOT NULL,
  ip_address VARCHAR(45) NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_client_endpoint (client_id, endpoint),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Enhance user_sessions table with additional security fields
ALTER TABLE user_sessions 
ADD COLUMN IF NOT EXISTS ip_address VARCHAR(45) AFTER session_token,
ADD COLUMN IF NOT EXISTS user_agent TEXT AFTER ip_address,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER last_activity;

ALTER TABLE user_sessions
ADD INDEX IF NOT EXISTS idx_ip_address (ip_address),
ADD INDEX IF NOT EXISTS idx_created_at (created_at);

-- Add failed login attempts tracking
CREATE TABLE IF NOT EXISTS failed_login_attempts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  ip_address VARCHAR(45) NOT NULL,
  user_agent TEXT,
  attempt_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reason ENUM('invalid_email', 'invalid_password', 'rate_limit', 'other') NOT NULL,
  INDEX idx_email_ip (email, ip_address),
  INDEX idx_attempt_time (attempt_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add security audit log table
CREATE TABLE IF NOT EXISTS security_audit_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  action VARCHAR(100) NOT NULL,
  resource VARCHAR(255),
  ip_address VARCHAR(45) NOT NULL,
  user_agent TEXT,
  success BOOLEAN NOT NULL,
  details JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user_action (user_id, action),
  INDEX idx_created_at (created_at),
  INDEX idx_ip_address (ip_address)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Enhance users table with security fields
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP NULL AFTER role,
ADD COLUMN IF NOT EXISTS login_attempts INT DEFAULT 0 AFTER last_login,
ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP NULL AFTER login_attempts,
ADD COLUMN IF NOT EXISTS password_changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER locked_until,
ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT FALSE AFTER password_changed_at,
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE AFTER two_factor_enabled,
ADD COLUMN IF NOT EXISTS email_verification_token VARCHAR(255) NULL AFTER email_verified,
ADD COLUMN IF NOT EXISTS password_reset_token VARCHAR(255) NULL AFTER email_verification_token,
ADD COLUMN IF NOT EXISTS password_reset_expires TIMESTAMP NULL AFTER password_reset_token;

ALTER TABLE users
ADD INDEX IF NOT EXISTS idx_locked_until (locked_until),
ADD INDEX IF NOT EXISTS idx_email_verification_token (email_verification_token),
ADD INDEX IF NOT EXISTS idx_password_reset_token (password_reset_token);

-- Add session management improvements
ALTER TABLE user_sessions 
ADD COLUMN IF NOT EXISTS device_fingerprint VARCHAR(255) AFTER user_agent,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE AFTER device_fingerprint,
ADD COLUMN IF NOT EXISTS logout_reason ENUM('manual', 'expired', 'forced', 'security_breach') NULL AFTER is_active;

ALTER TABLE user_sessions
ADD INDEX IF NOT EXISTS idx_device_fingerprint (device_fingerprint),
ADD INDEX IF NOT EXISTS idx_is_active (is_active);

-- Create user_devices table for device management
CREATE TABLE IF NOT EXISTS user_devices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  device_fingerprint VARCHAR(255) NOT NULL,
  device_name VARCHAR(255),
  device_type VARCHAR(50),
  browser VARCHAR(100),
  platform VARCHAR(100),
  ip_address VARCHAR(45),
  user_agent TEXT,
  is_trusted BOOLEAN DEFAULT FALSE,
  last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_device (user_id, device_fingerprint),
  INDEX idx_user_id (user_id),
  INDEX idx_device_fingerprint (device_fingerprint)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add password policy enforcement
ALTER TABLE users 
ADD CONSTRAINT chk_password_length CHECK (
  CHAR_LENGTH(password_hash) >= 60  -- bcrypt hashes are always 60 chars
);

-- Create security events table for real-time monitoring
CREATE TABLE IF NOT EXISTS security_events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_type VARCHAR(50) NOT NULL,
  severity ENUM('low', 'medium', 'high', 'critical') NOT NULL,
  user_id INT,
  ip_address VARCHAR(45) NOT NULL,
  user_agent TEXT,
  description TEXT NOT NULL,
  metadata JSON,
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMP NULL,
  resolved_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (resolved_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_event_type_severity (event_type, severity),
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at),
  INDEX idx_resolved (resolved)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
