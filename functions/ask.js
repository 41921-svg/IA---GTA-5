// server.js
require('dotenv').config(); // Carrega as variáveis do arquivo .env
const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const port = 3000;

// Configuração do Gemini
// A chave é lida da variável de ambiente GEMINI_API_KEY
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("ERRO: A variável de ambiente GEMINI_API_KEY não foi definida.");
    process.exit(1);
}
const ai = new GoogleGenAI(apiKey);
const model = "gemini-2.5-flash"; // Um modelo rápido e eficiente

// Middlewares
app.use(cors()); // Permite requisições do frontend
app.use(express.json()); // Permite processar JSON no corpo da requisição

// Rota principal para o chatbot
app.post('/ask', async (req, res) => {
    const { question } = req.body;

    if (!question) {
        return res.status(400).json({ error: 'Pergunta é obrigatória.' });
    }

    // O prompt de sistema é crucial para focar a IA no tópico (GTA V)
    const systemInstruction = `Você é um assistente de IA focado 100% em responder perguntas e curiosidades sobre o jogo Grand Theft Auto V (GTA V) e GTA Online. Seja prestativo, preciso e conciso, usando a terminologia correta do jogo. Se a pergunta não for sobre GTA V, responda educadamente que você é especializado apenas em GTA V.`;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: [
                { role: "user", parts: [{ text: question }] }
            ],
            config: {
                systemInstruction: systemInstruction,
            }
        });

        // Envia a resposta do Gemini de volta para o frontend
        res.json({ answer: response.text });

    } catch (error) {
        console.error('Erro ao chamar a API Gemini:', error);
        res.status(500).json({ error: 'Erro interno ao processar a requisição.' });
    }
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
    console.log(`Pronto para receber perguntas sobre GTA V.`);
});