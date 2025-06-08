-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    contraseña TEXT NOT NULL,
    rol VARCHAR(20) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de fichajes
CREATE TABLE IF NOT EXISTS fichajes (
    id SERIAL PRIMARY KEY,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla de vacaciones
CREATE TABLE IF NOT EXISTS vacaciones (
    id SERIAL PRIMARY KEY,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    estado VARCHAR(20) DEFAULT 'pendiente',
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_revision TIMESTAMP,
    comentario_admin TEXT,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    revisado_por INTEGER REFERENCES usuarios(id)
);

-- Tabla de notificaciones
CREATE TABLE IF NOT EXISTS notificaciones (
    id SERIAL PRIMARY KEY,
    mensaje TEXT NOT NULL,
    leída BOOLEAN DEFAULT FALSE,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Configuración de jornada global o por usuario
CREATE TABLE IF NOT EXISTS config_jornada (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    horas_anuales NUMERIC,
    horas_semanales NUMERIC
);

-- Jornada semanal por día
CREATE TABLE IF NOT EXISTS jornada_semanal (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    dia_semana VARCHAR(10) NOT NULL,
    horas_dia NUMERIC(4,2) NOT NULL
);

-- Festivos
CREATE TABLE IF NOT EXISTS festivos (
    id SERIAL PRIMARY KEY,
    fecha DATE NOT NULL,
    descripcion TEXT,
    ámbito VARCHAR(20)
);

-- Días no laborables específicos
CREATE TABLE IF NOT EXISTS dias_no_laborables (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    fecha DATE NOT NULL,
    motivo TEXT
);

-- Jornada semanal por defecto (si no existe)
INSERT INTO jornada_semanal (usuario_id, dia_semana, horas_dia)
VALUES
(NULL, 'lunes', 8.0),
(NULL, 'martes', 8.0),
(NULL, 'miércoles', 8.0),
(NULL, 'jueves', 8.0),
(NULL, 'viernes', 6.5)
ON CONFLICT DO NOTHING;

-- Festivos 2025 Madrid
INSERT INTO festivos (fecha, descripcion, ámbito) VALUES
('2025-01-01', 'Año Nuevo', 'nacional'),
('2025-01-06', 'Epifanía del Señor', 'nacional'),
('2025-04-17', 'Jueves Santo', 'nacional'),
('2025-04-18', 'Viernes Santo', 'nacional'),
('2025-05-01', 'Día del Trabajo', 'nacional'),
('2025-05-02', 'Comunidad de Madrid', 'autonómico'),
('2025-05-15', 'San Isidro', 'local'),
('2025-07-25', 'Santiago Apóstol', 'nacional'),
('2025-08-15', 'Asunción de la Virgen', 'nacional'),
('2025-11-01', 'Todos los Santos', 'nacional'),
('2025-11-10', 'Traslado por Todos los Santos', 'local'),
('2025-12-06', 'Día de la Constitución', 'nacional'),
('2025-12-08', 'Inmaculada Concepción', 'nacional'),
('2025-12-25', 'Navidad', 'nacional')
ON CONFLICT DO NOTHING;
