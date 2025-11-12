// script.js (Versão CORRIGIDA e Limpa)
document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    const sendBtn = document.getElementById('send-btn');

    // AQUI É O LUGAR CORRETO: A API_URL deve ser declarada no início do escopo principal.
    const API_URL = '/.netlify/functions/ask'; 
    // Fim da correção. Não precisa do bloco document.addEventListener aninhado.

    // Função para adicionar uma mensagem na tela
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
        messageDiv.textContent = text;
        chatBox.appendChild(messageDiv);
        // Rola para o final da conversa
        chatBox.scrollTop = chatBox.scrollHeight;
        return messageDiv;
    }

    // Gerencia o envio do formulário
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Impede o recarregamento da página

        const question = userInput.value.trim();
        if (!question) return;

        // 1. Adiciona a mensagem do usuário
        addMessage(question, 'user');
        userInput.value = ''; // Limpa o input

        // 2. Adiciona o indicador de carregamento
        const loadingMessage = addMessage('🤖 Bot digitando...', 'loading');
        sendBtn.disabled = true; // Desabilita o botão

        try {
            // 3. Chama o backend (agora usando a API_URL correta)
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question: question }),
            });

            const data = await response.json();

            // 4. Remove o indicador de carregamento
            chatBox.removeChild(loadingMessage);

            // 5. Adiciona a resposta da IA ou uma mensagem de erro
            if (response.ok) {
                addMessage(data.answer, 'bot');
            } else {
                addMessage(`Erro: ${data.error || 'Não foi possível obter a resposta da IA.'}`, 'bot');
            }

        } catch (error) {
            console.error('Erro de conexão:', error);
            chatBox.removeChild(loadingMessage);
            addMessage('Erro de conexão com o servidor. Verifique se o backend está rodando.', 'bot');
        } finally {
            sendBtn.disabled = false; // Habilita o botão novamente
            userInput.focus(); // Foca no campo de input
        }
    });
});
