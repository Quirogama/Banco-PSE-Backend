-- Base de datos para Sistema Bancario PSE
-- Fecha de creación: 23 de noviembre de 2025
-- Estructura simplificada: Usuario, Pago, Correo

CREATE DATABASE IF NOT EXISTS banco_pse CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE banco_pse;
DROP TABLE IF EXISTS correo;
DROP TABLE IF EXISTS pago;
DROP TABLE IF EXISTS usuario;

-- Tabla de Usuario
CREATE TABLE IF NOT EXISTS usuario (
    id BIGINT PRIMARY KEY,
    tipoDocumento VARCHAR(20),
    nombre VARCHAR(100),
    apellido VARCHAR(100),
    email VARCHAR(100),
    contrasena VARCHAR(255),
    telefono VARCHAR(20),
    ocupacion VARCHAR(100),
    rol VARCHAR(50),
    balance DECIMAL(15, 2) DEFAULT 0.00,
    CHECK (balance >= 0)
) ENGINE=InnoDB;

-- Tabla de Pago
CREATE TABLE IF NOT EXISTS pago (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario BIGINT NOT NULL,
    fecha DATE,
    monto DECIMAL(15, 2),
    estado VARCHAR(50),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id) ON DELETE CASCADE,
    INDEX idx_usuario (id_usuario),
    CHECK (monto > 0)
) ENGINE=InnoDB;

-- Tabla de Correo
CREATE TABLE IF NOT EXISTS correo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_pago INT NOT NULL,
    asunto VARCHAR(255),
    cuerpo TEXT,
    FOREIGN KEY (id_pago) REFERENCES pago(id) ON DELETE CASCADE,
    INDEX idx_pago (id_pago)
) ENGINE=InnoDB;
