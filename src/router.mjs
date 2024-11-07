import express from 'express';
import path from 'path';
import fetch from 'node-fetch'; // Importa node-fetch
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

dotenv.config();

global.fetch = fetch; // Define fetch globalmente
global.Headers = fetch.Headers; // Define Headers globalmente
const genAI = new GoogleGenerativeAI(process.env.API_KEY);  // API_KEY é a chave de ambiente
const model = genAI.getGenerativeModel({ model: "gemini-pro" });


const router = express.Router();
router.use(bodyParser.json());

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

router.post('/api/chat', async (req, res) => {
    console.log('Requisição recebida:', req.body);
    let msgUser = req.body.inputUser
    console.log('Mensagem do usuario: ', msgUser)

    if (!req.body.inputUser) {
        console.error('inputUser  não encontrado');
        return res.status(400).json({ message: 'inputUser  é obrigatório' });
    }
 
    try {
        const chat = model.startChat({
            history: [],
            generationConfig: {
                maxOutputTokens: 500,
            },
        });
        const result = await chat.sendMessage(msgUser)
        const response = result.response;
        res.json({ message: response });
    } catch (error) {
        console.error('Erro ao chamar a API do Google Gemini:', error);
        res.status(500).json({ message: 'Erro no servidor' });
    }
});

module.exports = router;