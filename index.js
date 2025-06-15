const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'pet_clinic',
  password: process.env.DB_PASSWORD || 'test',
  port: process.env.DB_PORT || 5432,
});

pool.connect((err, client, done) => {
  if (err) {
    console.error('Error connecting to PostgreSQL database:', err);
  } else {
    console.log('Successfully connected to PostgreSQL database');
    done();
  }
});

app.get('/', (req, res) => {
  res.send('Pet Clinic API - Use /query endpoint to run SQL queries');
});

app.post('/query', async (req, res) => {
  try {
    const { query } = req.body;
    console.log('Query executed:', query);
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    
    const result = await pool.query(query);
    res.json({
      success: true,
      data: result.rows,
      rowCount: result.rowCount
    });
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});