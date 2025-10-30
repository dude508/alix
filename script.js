// ATANSYON: RANPLASE SA A LÈ OU FIN DEPLOYE BACKEND LA!
const API_BASE_URL = 'http://localhost:3000'; 
// Si w ap kouri l sou òdinatè w: 'http://localhost:3000'
// Lè w fin deplwaye backend la sou Render: 'https://non-ou-chwazi-a.onrender.com'


document.addEventListener("DOMContentLoaded", () => {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    // Funksyon pou ajoute yon mesaj
    function displayMessage(message, sender, isTemporary = false) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-msg`);
        if (isTemporary) {
            messageElement.id = 'loading-msg'; // Mete yon ID pou ka retire l
        }
        messageElement.innerHTML = message;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
        return messageElement;
    }

    async function getAlixResponseFromAPI(message) {
        let loadingMsgElement;
        
        try {
            // Montre mesaj loading
            loadingMsgElement = displayMessage("ALIX ap reflechi...", 'alix', true);
            
            const response = await fetch(`${API_BASE_URL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prompt: message })
            });

            if (!response.ok) {
                // Si sèvè a bay erè 500, li pa mache
                throw new Error(`Erè koneksyon ak sèvè a: ${response.status}`);
            }

            const data = await response.json();
            return data.response;

        } catch (error) {
            console.error("Erè pandan demann API a:", error);
            return `Mwen regrèt. Mwen pa ka konekte ak sèvè Alix  la. Erè: ${error.message}. Tanpri verifye si backend la ap kouri byen.`;
        } finally {
            // Retire mesaj loading la si li egziste
            const loading = document.getElementById('loading-msg');
            if(loading) {
                 chatBox.removeChild(loading);
            }
        }
    }

    async function handleSend() {
        const messageText = userInput.value.trim();

        if (messageText !== "") {
            displayMessage(messageText, 'user');
            userInput.value = "";
            userInput.disabled = true;

            const alixReply = await getAlixResponseFromAPI(messageText);
            
            displayMessage(alixReply, 'alix');
            
            userInput.disabled = false;
            userInput.focus();
        }
    }

    sendBtn.addEventListener('click', handleSend);
    userInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            handleSend();
        }
    });

    setTimeout(() => {
        displayMessage("Bonjou! Mwen se 𝐀𝐥𝐢𝐱.yon inteligence atificiel. Kisa m ka fè pou ou?", 'alix');
    }, 500);
});
