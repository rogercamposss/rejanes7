
import express from 'express';
import path from 'path';
import fetch from 'node-fetch'; // Importa node-fetch
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import mysql from 'mysql2';

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
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
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


app.post('/formPost', (req, res) => {
    console.log( req.body) ;
    console.log( req.mesa);

});


const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'roger100',
    database: 'rejanes7',
    
}).promise();

const result = await pool.query("SELECT * FROM reservas")

console.log(result)


export default app;




