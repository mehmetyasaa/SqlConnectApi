const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../config/db');

// Middleware to check database connection
const ensureDbConnection = async (req, res, next) => {
    if (!poolPromise) {
        return res.status(500).send('Database connection failed');
    }
    next();
};

router.use(ensureDbConnection);

// Get all students
router.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        if (!pool) throw new Error('Database connection failed');

        const result = await pool.request().query('SELECT * FROM products');
        res.json(result.recordset);
    } catch (err) {
        console.error('Error in GET /products:', err);
        res.status(500).send(err.message);
    }
});

// Get student by ID
router.get('/:id', async (req, res) => {
    try {
        const pool = await poolPromise;
        if (!pool) throw new Error('Database connection failed');

        const result = await pool.request()
            .input('Id', sql.Int, req.params.id)
            .query('SELECT * FROM products WHERE Id = @Id');
        res.json(result.recordset[0]);
    } catch (err) {
        console.error('Error in GET /products/:id:', err);
        res.status(500).send(err.message);
    }
});

// Create new student
// Create new student
router.post('/', async (req, res) => {
    try {
        const { name, count, createDate, description, id, image, status, unit } = req.body;
        const pool = await poolPromise;
        if (!pool) throw new Error('Database connection failed');

        const result = await pool.request()
            .input('name', sql.NVarChar, name)
            .input('count', sql.Int, count)
            .input('createDate', sql.NVarChar, createDate)
            .input('description', sql.NVarChar, description)
            .input('id', sql.NVarChar, id)
            .input('image', sql.NVarChar, image)
            .input('status', sql.Bit, status)
            .input('unit', sql.NVarChar, unit)
            .query('INSERT INTO products (name, count, createDate, description, id, image, status, unit) VALUES (@name, @count, @createDate, @description, @id, @image, @status, @unit)');
        res.status(201).json({ message: 'Student created server ' });
    } catch (err) {
        console.error('Error in POST /products:', err);
        res.status(500).send(err.message);
    }
});


// Update student
router.put('/:id', async (req, res) => {
    try {
        const { Name, Weight } = req.body;
        const pool = await poolPromise;
        if (!pool) throw new Error('Database connection failed');

        const result = await pool.request()
            .input('Id', sql.Int, req.params.id)
            .input('Name', sql.VarChar, Name)
            .input('Weight', sql.Float, Weight)
            .query('UPDATE products SET Name = @Name, Weight = @Weight WHERE Id = @Id');
        res.json({ message: 'products updated' });
    } catch (err) {
        console.error('Error in PUT /products/:id:', err);
        res.status(500).send(err.message);
    }
});

// Delete student
router.delete('/:id', async (req, res) => {
    try {
        const pool = await poolPromise;
        if (!pool) throw new Error('Database connection failed');

        const result = await pool.request()
            .input('Id', sql.Int, req.params.id)
            .query('DELETE FROM products WHERE Id = @Id');
        res.json({ message: 'Student deleted' });
    } catch (err) {
        console.error('Error in DELETE /products/:id:', err);
        res.status(500).send(err.message);
    }
});

module.exports = router;
