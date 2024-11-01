// URL para o arquivo JSON com o cardápio
const cardapioUrl = 'Rejanes7/menu.json'; // Substitua pelo caminho real do arquivo JSON do cardápio

// Função para carregar o cardápio a partir de um arquivo JSON
async function loadMenu() {
    try {
        const response = await fetch(cardapioUrl);
        if (!response.ok) {
            throw new Error(`Erro ao carregar o cardápio: ${response.status} ${response.statusText}`);
        }
        const menu = await response.json();
        return menu;
    } catch (error) {
        console.error('Erro ao carregar o cardápio:', error);
        return null;
    }
}

// Função para fazer a chamada à API da OpenAI
async function getOpenAIRecommendation(message) {
    const apiKey = 'sk-WOOobpZtSyURgNo4rY1kJ6QYPF2SqzPkfH8bJI1oyQT3BlbkFJeKBOTR3mes9QLksPr3Q2AlmDtwhX9SxNvoyqBb5fgA';  // Insira sua API key da OpenAI aqui
    

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',  // ou qualquer outro modelo que você deseja usar
                messages: [{ role: 'user', content: message }],
            }),
        });

        if (!response.ok) {
            throw new Error(`Erro na API da OpenAI: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        // Verificar se o formato da resposta é o esperado
        if (data.choices && data.choices.length > 0) {
            return data.choices[0].message.content;
        } else {
            console.error('Resposta inesperada da API:', data);
            return "Desculpe, não consegui gerar uma resposta.";
        }
    } catch (error) {
        console.error('Erro ao obter recomendação da OpenAI:', error);
        return "Desculpe, houve um erro ao processar sua solicitação.";
    }
}

// Função para exibir as mensagens no chat
function appendMessage(sender, message) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Função para lidar com o envio da mensagem
async function handleSendMessage() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();
    
    if (message) {
        // Exibe a mensagem do usuário no chat
        appendMessage('user', `Você: ${message}`);
        
        // Carregar o cardápio
        const cardapio = await loadMenu();

        if (cardapio) {
            // Gera a mensagem baseada no cardápio
            let mensagemComCardapio = `Cardápio: ${JSON.stringify(cardapio)}. Com base nisso, sugira algo para alguém que quer ${message}.`;

            // Obter a resposta da OpenAI
            const reply = await getOpenAIRecommendation(mensagemComCardapio);
            
            // Exibe a resposta no chat
            appendMessage('bot', `Bot: ${reply}`);
        } else {
            appendMessage('bot', 'Desculpe, não consegui carregar o cardápio.');
        }
        
        // Limpar campo de entrada
        userInput.value = '';
    }
}

// Adicionar evento ao botão de enviar
document.getElementById('sendBtn').addEventListener('click', handleSendMessage);

// Permitir envio com "Enter"
document.getElementById('userInput').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        handleSendMessage();
    }
});
