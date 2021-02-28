const cool = require('cool-ascii-faces');
const express = require('express')
var bodyParser = require('body-parser')
const path = require('path')
const PORT = process.env.PORT || 5000

// create application/json parser
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/db', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM test_table');
      const results = { 'results': (result) ? result.rows : null};
      //res.render('pages/db', results );
      res.json(results);
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
  .get('/workers', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM rep_workers');
      const results = { 'results': (result) ? result.rows : null};
      //res.render('pages/db', results );
      res.json(results);
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
  .get('/worker/:id', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query("SELECT * FROM rep_workers WHERE id = '" + req.params.id +"'");
      const results = { 'results': (result) ? result.rows : null};
      //res.render('pages/db', results );
      res.json(results);
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
  .get('/workers-by-cat/:cat', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query("SELECT * FROM rep_workers WHERE category = '" + req.params.cat +"'");
      const results = { 'results': (result) ? result.rows : null};
      //res.render('pages/db', results );
      res.json(results);
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
  .post('/create-worker', jsonParser, async (req, res) => {
    try {
      // console.info(req.body);
      // console.info(req);
      const client = await pool.connect();
      const result = await client.query(`INSERT INTO rep_workers values ('${req.body.id}', '${req.body.name}', '${req.body.address}', '${req.body.category}', ${req.body.score}, '${req.body.cover_image}', ${req.body.lat}, ${req.body.long}, '${req.body.description}'`);
      const results = { 'results': (result) ? result.rows : null};

      res.json(results);
      //res.json({"reqBody": req.body});
      client.release();
    } catch (err) {
      // console.error(err);
      res.send("Error " + err);
      //res.json({"Error ": err, "reqBody": req.body, "req": req});
    }
  })
  .get('/cool', (req, res) => res.send(cool()))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
