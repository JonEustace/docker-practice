const fastify = require('fastify')({logger: true});
const { Pool } = require('pg');
const keys = require('./keys');


const pool = new Pool({
    user: keys.PG_USER,
    host: keys.PG_HOST,
    port: keys.PG_PORT,
    database: keys.PG_DATABASE,
    password: keys.PG_PASSWORD,
});

fastify.get('/value/:index', async (req, res) => {
    try {
        const response = await pool.query('SELECT name FROM nametable where $1', [req.params.index]);
        console.log()
        return response;
    } catch (err){
        console.log(err)
        // return fastify.log.error(err);
    }
});

fastify.post('/value/:name', async (req, res) => {
   return await pool.query('INSERT INTO nametable (name) VALUES($1) RETURNING *', req.params.name);
});

fastify.listen(5000, (err, address) => {
    if (err) {
        return fastify.log.error('Error starting: ', err);
    }

    return fastify.log.info('Listening on: ', address);
})