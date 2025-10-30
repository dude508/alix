// Importe bibliyotèk yo
require('dotenv').config(); 
const express = require('express');
const cors = require('cors'); 
const { GoogleGenAI } = require('@google/generative-ai');
const {GoogleGenerativeAI} = require('@google/generative-ai');
// Sèvi ak PORT ki defini nan .env la, oswa 3000 pa defo.
const port = process.env.PORT || 3000; 

// Inisialize Express
const app = express();

// Konfigirasyon CORS pou pèmèt frontend la pale ak li
app.use(cors()); 
app.use(express.json());

// ******* KONFIGIRASYON GEMINI (SEKIRIZE) *******
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("FATAL: GEMINI_API_KEY pa jwenn. Tanpri mete li nan Var. d'environnement.");
    // Sa a ap mache sou Render/Vercel paske nou mete kle a la
    // Men li pa bon pou kouri lokalman si .env la pa la
}

const ai = new GoogleGenerativeAI(apiKey);
const model = 'gemini-2.5-flash';
const systemInstruction = `
Ou se ALIX, yon entèlijans atifisyèl ki sèvi sou yon sit entènèt. 
1. Reponn tout kesyon an **Kreyòl Ayisyen** (Ayisyen) oswa an **Fransè**, selon langaj itilizatè a.
2. Ton ou dwe zanmitay, pwofesyonèl, ak egzak.
3. Repons ou dwe kout epi senp pou li sou yon koze chat.
4. Pa janm pale de Google, Gemini, oswa API. Pale de ou kòm ALIX.
4. Ou se Alix moun ki devlopew la rele Drinx.
5. Moun ki devlopew la ap viv ayiti
6. Reponn tout kesyon nèt son non paw ki se Alix.
7. ou ka itilize tout emojis.
`;


// ***************** ROUTE PRINCIPALE CHAT LA *****************
app.post('/chat', async (req, res) => {
    const userPrompt = req.body.prompt;
    
    if (!userPrompt) {
        return res.status(400).json({ error: "Manke 'prompt' itilizatè a." });
    }

    try {
        const chat = ai.chats.create({
            model: model,
            config: {
                systemInstruction: systemInstruction,
            },
        });

        const result = await chat.sendMessage({ message: userPrompt });

        // Voye repons lan tounen bay Frontend la
        res.json({ response: result.text });

    } catch (error) {
        console.error("Erè Gemini API:", error);
        res.status(500).json({ error: "Erè entèn nan sèvè a. Pa ka pale ak Gemini." });
    }
});

// Route tès pou asire sèvè a ap kouri
app.get('/', (req, res) => {
    res.send('ALIX Backend ap kouri ak API Gemini.');
});

// ***************** LANSE SÈVÈ A *****************
app.listen(port, () => {
    console.log(`🤖 ALIX Backend ap kouri sou http://localhost:${port}`);
});
