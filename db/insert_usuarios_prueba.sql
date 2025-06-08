-- Administrador
INSERT INTO usuarios (nombre, email, contraseña, rol, fecha)
VALUES (
  'Admin',
  'admin@example.com',
  '$2b$12$Jcr.wo6M3e08u3QbOshv4u8BYy69tWpQz5kvEJL0HMQY5Hq6K17cy',
  'administrador',
  CURRENT_DATE
);

-- Empleado
INSERT INTO usuarios (nombre, email, contraseña, rol, fecha)
VALUES (
  'Empleado',
  'empleado@example.com',
  '$2b$12$lWx3RtTsO1MfSHaE.Ses9uG0n6feg9iUA83WIuMgHOIVAUI1MqtIi',
  'empleado',
  CURRENT_DATE
);
