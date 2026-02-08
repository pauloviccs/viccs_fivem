-- ============================================================================
-- SimLife Needs & Wants System - Database Schema
-- ============================================================================
-- Execute this SQL in your FiveM database before starting the server
-- ============================================================================

-- Tabela de Needs (necessidades persistentes)
CREATE TABLE IF NOT EXISTS `player_needs` (
    `citizenid` VARCHAR(50) PRIMARY KEY,
    `hunger` FLOAT DEFAULT 100.0,
    `thirst` FLOAT DEFAULT 100.0,
    `energy` FLOAT DEFAULT 100.0,
    `hygiene` FLOAT DEFAULT 100.0,
    `bladder` FLOAT DEFAULT 100.0,
    `social` FLOAT DEFAULT 100.0,
    `fun` FLOAT DEFAULT 100.0,
    `comfort` FLOAT DEFAULT 100.0,
    `last_update` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_needs_player` FOREIGN KEY (`citizenid`) REFERENCES `players`(`citizenid`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Wants ativos
CREATE TABLE IF NOT EXISTS `player_wants` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `citizenid` VARCHAR(50),
    `want_id` VARCHAR(50),
    `priority` ENUM('primary', 'secondary') DEFAULT 'secondary',
    `expires_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_wants_citizenid` (`citizenid`),
    CONSTRAINT `fk_wants_player` FOREIGN KEY (`citizenid`) REFERENCES `players`(`citizenid`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Wants completados (histórico)
CREATE TABLE IF NOT EXISTS `player_wants_history` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `citizenid` VARCHAR(50),
    `want_id` VARCHAR(50),
    `completed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_wants_history_citizenid` (`citizenid`),
    CONSTRAINT `fk_wants_history_player` FOREIGN KEY (`citizenid`) REFERENCES `players`(`citizenid`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Índices adicionais para performance
-- ============================================================================
CREATE INDEX IF NOT EXISTS `idx_needs_last_update` ON `player_needs` (`last_update`);
CREATE INDEX IF NOT EXISTS `idx_wants_expires` ON `player_wants` (`expires_at`);
