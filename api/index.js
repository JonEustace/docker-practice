const fastify = require('fastify')({logger: true});
const { Pool } = require('pg');
const keys = require('./keys');
const fastifyCors = require('fastify-cors');
fastify.register(fastifyCors);

const pool = new Pool({
    user: keys.PG_USER,
    host: keys.PG_HOST,
    port: keys.PG_PORT,
    database: keys.PG_DATABASE,
    password: keys.PG_PASSWORD,
});

fastify.get('/values', async (req, res) => {
  try {
    const response = await pool.query('SELECT id, name FROM nametable');
    res.type('application/json').code(200);
    return { data: response.rows };
  } catch (err){
    return fastify.log.error(err);
  }
});

fastify.get('/value/:index', async (req, res) => {
    try {
      const response = await pool.query('SELECT name FROM nametable where id = $1', [req.params.index]);
      res.type('application/json').code(200);
      return { data: response.rows };
    } catch (err){
      return fastify.log.error(err);
    }
});

fastify.post('/value/:name', async (req, res) => {
  try {
    const result = await pool.query('INSERT INTO nametable (name) VALUES($1) RETURNING *', [req.params.name]);
    res.type('application/json').code(200);
    return { data: result.rows }
  } catch (err){
    return fastify.log.error(err);
  }
});

fastify.listen(5000, '0.0.0.0', async (err, address) => {
  try {
    await pool.query('CREATE TABLE IF NOT EXISTS nametable (id serial, name varchar(255))');
    if (err) {
      return fastify.log.error('Error starting: ', err);
    }
    return fastify.log.info('Listening on: ', address);
  } catch (err){
    return fastify.log.error(err);
  }

});
