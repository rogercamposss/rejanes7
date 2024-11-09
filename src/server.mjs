
import app from './App.mjs';
import express from 'express';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});


const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "(Roger100)",
    database: 'restaurante'
  });
  
  app.get('/api/reservations', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM reservas');
      res.json(rows);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      res.status(500).json({ message: 'Error fetching reservations' });
    }
  });
  
  app.post('/api/reservations', async (req, res) => {
    const { name, date, time, guests, table_num } = req.body;
  
    if (isNaN(guests) || isNaN(table_num)) {
      return res.status(400).json({ message: 'Invalid guests or table number' });
    }
  
    const reservationDateTime = new Date(`${date} ${time}`);
  
    try {
      const [result] = await pool.query(
        'INSERT INTO reservas (name, date, guests, table_num) VALUES (?, ?, ?, ?)',
        [name, reservationDateTime, guests, table_num]
      );
      res.status(201).json({ id: result.insertId, name, date, time, guests, table_num });
    } catch (error) {
      console.error('Error creating reservation:', error);
      res.status(500).json({ message: 'Error creating reservation' });
    }
  });
  
  app.put('/api/reservations/:id', async (req, res) => {
    const { id } = req.params;
    const { name, date, guests, table_num } = req.body;
    try {
      await pool.query(
        'UPDATE reservas SET name = ?, date = ?, guests = ?, table_num = ? WHERE id = ?',
        [name, date, guests, table_num, id]
      );
      res.json({ id, name, date, guests, table_num });
    } catch (error) {
      console.error('Error updating reservation:', error);
      res.status(500).json({ message: 'Error updating reservation' });
    }
  });
  
  app.delete('/api/reservations/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query('DELETE FROM reservas WHERE id = ?', [id]);
      res.json({ message: 'Reservation deleted' });
    } catch (error) {
      console.error('Error deleting reservation:', error);
      res.status(500).json({ message: 'Error deleting reservation' });
    }
  });
  
