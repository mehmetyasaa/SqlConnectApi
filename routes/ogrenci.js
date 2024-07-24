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

        const result = await pool.request().query('SELECT * FROM ogrenci');
        res.json(result.recordset);
    } catch (err) {
        console.error('Error in GET /ogrenci:', err);
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
            .query('SELECT * FROM ogrenci WHERE Id = @Id');
        res.json(result.recordset[0]);
    } catch (err) {
        console.error('Error in GET /ogrenci/:id:', err);
        res.status(500).send(err.message);
    }
});

// Create new student
router.post('/', async (req, res) => {
    try {
        const { Name, Weight } = req.body;
        const pool = await poolPromise;
        if (!pool) throw new Error('Database connection failed');

        const result = await pool.request()
            .input('Name', sql.VarChar, Name)
            .input('Weight', sql.Float, Weight)
            .query('INSERT INTO ogrenci (Name, Weight) VALUES (@Name, @Weight)');
        res.status(201).json({ message: 'Student created' });
    } catch (err) {
        console.error('Error in POST /ogrenci:', err);
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
            .query('UPDATE ogrenci SET Name = @Name, Weight = @Weight WHERE Id = @Id');
        res.json({ message: 'Student updated' });
    } catch (err) {
        console.error('Error in PUT /ogrenci/:id:', err);
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
            .query('DELETE FROM ogrenci WHERE Id = @Id');
        res.json({ message: 'Student deleted' });
    } catch (err) {
        console.error('Error in DELETE /ogrenci/:id:', err);
        res.status(500).send(err.message);
    }
});

module.exports = router;
