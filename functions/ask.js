// functions/ask.js (CORRIGIDO PARA NETLIFY FUNCTIONS)
const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');

const app = express();

// Configuração do Gemini - A chave é lida da variável de ambiente injetada pelo Netlify
const apiKey = process.env.GEMINI_API_KEY; 

// A instância da IA
const ai = new GoogleGenAI(apiKey);
const model = "gemini-2.5-flash"; 

// Middlewares
app.use(cors()); 
app.use(express.json()); 

// Rota principal para o chatbot
app.post('/ask', async (req, res) => {
    const { question } = req.body;

    if (!question) {
        return res.status(400).json({ error: 'Pergunta é obrigatória.' });
    }

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

        res.json({ answer: response.text });

    } catch (error) {
        console.error('Erro ao chamar a API Gemini:', error);
        res.status(500).json({ error: 'Erro interno ao processar a requisição.' });
    }
});

// CRUCIAL: Exporta o aplicativo Express para ser usado como função pelo Netlify
module.exports = app;
