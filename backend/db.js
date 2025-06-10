import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'horas_postgres',
  database: 'horas',
  password: 'postgres',
  port: 5432,
});

pool.connect()
  .then(client => {
    client.release();
  })
  .catch(err => console.error("❌ Error de conexión a PostgreSQL:", err));

export default pool;
