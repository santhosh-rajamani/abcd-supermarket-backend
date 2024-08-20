const express = require('express');
const path = require('path');
// const cors = require('cors');
const { Pool } = require('pg');
const aws = require('aws-sdk');

const app = express();
const port = process.env.PORT || 8080;

// Configure AWS
aws.config.update({
  region: 'ap-southeast-2',
});

const s3 = new aws.S3();

// Use CORS middleware
// app.use(cors());

// Database connection configuration
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false // Use true or configure SSL settings if needed
  }
});

// const pool = new Pool({
//   user: 'postgres',
//   // host: 'santhosh-db-pg-02.cvwis0a4o4np.ap-southeast-2.rds.amazonaws.com',
//   host: 'localhost',
//   database: 'supermarket',
//   password: 'postgres',
//   port: '5432',
//   // ssl: {
//   //   rejectUnauthorized: false // Use true or configure SSL settings if needed
//   // }
// });

// pool.connect((err) => {
//   if (err) {
//     console.error('Error connecting to the database', err.stack);
//   } else {
//     console.log('Connected to the database');
//   }
// });

// Function to transform cost from string to number
const transformCostToNumber = (rows) => {
  return rows.map(row => ({
    ...row,
    cost: parseFloat(row.cost)
  }));
};

// Serve static files from the Angular app
app.use(express.static(path.join(__dirname, 'dist')));


app.get('/images/:category/:product', (req, res) => {
  const params = {
    // Bucket: 'santhosh-assignment-bucket-01',
    Bucket: process.env.S3_BUCKETNAME,
    Key: req.params.category + '/' + req.params.product
  };

  s3.getObject(params, (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching image' + err.message });
    }
    res.setHeader('Content-Type', data.ContentType);
    res.send(data.Body);
  });
});

// API to get vegetables
app.get('/api/products/vegetables', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.id, p.name, p.image, p.cost
       FROM products p
       JOIN category c ON p.category_id = c.id
       WHERE c.name = 'Vegetables'`
    );
    res.json(transformCostToNumber(result.rows));
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).send('Internal Server Error');
  }
});

// API to get fruits
app.get('/api/products/fruits', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.id, p.name, p.image, p.cost
       FROM products p
       JOIN category c ON p.category_id = c.id
       WHERE c.name = 'Fruits'`
    );
    res.json(transformCostToNumber(result.rows));
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).send('Internal Server Error');
  }
});

// Send all requests to the Angular app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
