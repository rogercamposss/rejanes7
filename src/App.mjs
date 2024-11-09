
import express from 'express';
import path from 'path';
import fetch from 'node-fetch'; // Importa node-fetch
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

global.fetch = fetch; // Define fetch globalmente
global.Headers = fetch.Headers; // Define Headers globalmente
const genAI = new GoogleGenerativeAI(process.env.API_KEY);  // API_KEY é a chave de ambiente
const model = genAI.getGenerativeModel({ model: "gemini-pro" });
const app = express();
app.use(express.json());
// Configuração para servir arquivos estáticos
app.use(express.static(path.join(__dirname, '..', 'public')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'admin.html'));
});
const chat = model.startChat({
    history: [],
    generationConfig: {
        maxOutputTokens: 500,
    }
});

app.post('/api/chat', async (req, res) => {
    console.log('Requisição recebida:', req.body);
    let msgUser = req.body.inputUser
    let chatHistory = req.body.history
    console.log('Mensagem do usuario: chat history:', chatHistory)

    if (!req.body.inputUser) {
        console.error('inputUser  não encontrado');
        return res.status(400).json({ message: 'inputUser  é obrigatório' });
    }

    try {

        const result = await chat.sendMessage(msgUser)
        const response = result.response;
        const text = response.text();
        res.json({ message: text });

    } catch (error) {
        console.error('Erro ao chamar a API do Google Gemini:', error);
        res.status(500).json({ message: 'Erro no servidor' });
    }
});




const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "(Roger100)",
    database: 'restaurante'
});


app.post('/formPost', async (req, res) => {
    const { nome, data, mesas, tableNumber } = req.body;

    // Verificação dos dados
    if (isNaN(mesas) || isNaN(tableNumber)) {
        return res.status(400).json({ message: 'Invalid guests or table number' });
    }

    try {

        // Log dos dados a serem inseridos
        console.log('Dados a serem inseridos:', nome, data, mesas, tableNumber);

        const [result] = await pool.query(
            'INSERT INTO reservas (name, date, guests, table_num) VALUES (?, ?, ?, ?)',
            [nome, data, mesas, tableNumber]
        );

        const dateFormat = new Date(data); 
        const datePart = dateFormat.toISOString().split('T')[0]; 
        const hora = dateFormat.toISOString().split('T')[1]; 

        res.status(201).json({ id: result.insertId, nome, date: datePart, time: hora, mesas, tableNumber });
        console.log("Dados foram inseridos")
    } catch (error) {
        console.error('Erro ao criar reserva:', error);
        res.status(500).json({ message: 'Erro ao criar reserva' });
    }
});

app.get('/occupied-tables', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT table_num FROM reservas');
        const occupiedTables = rows.map(row => row.table_num); // Extrai apenas os números das mesas
        res.status(200).json(occupiedTables);
    } catch (error) {
        console.error('Erro ao buscar mesas ocupadas:', error);
        res.status(500).json({ message: 'Erro ao buscar mesas ocupadas' });
    }
});


export default app;




