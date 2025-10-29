import { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './index.css'; // FIX: Mengganti ke import CSS asli (styles.css)

// Ambil API key dari environment variable
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
if (!API_KEY) {
  throw new Error("VITE_GEMINI_API_KEY is not defined in .env file");
}

// Inisialisasi Generative AI
const genAI = new GoogleGenerativeAI(API_KEY);

// --- FIX: Memperbaiki nama model. 'gemini-2.5-flash' sepertinya typo. ---
// Menggunakan 'gemini-1.5-flash-latest' yang mendukung streaming.
// Ganti ke 'gemini-pro' jika ini masih gagal.
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

function App() {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Ini hanya untuk loading awal
  const [error, setError] = useState(null);

  const chatSessionRef = useRef(null);
  const chatWindowRef = useRef(null);

  useEffect(() => {
    chatSessionRef.current = model.startChat({
      history: [], // Mulai dengan history kosong
    });
  }, []);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  // --- INI ADALAH FUNGSI YANG HARUS DIUBAH UNTUK STREAMING ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentMessage.trim()) return; // Jangan kirim jika isLoading

    const userMessage = currentMessage;
    // Tambahkan pesan pengguna ke state
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: userMessage },
    ]);
    setCurrentMessage('');
    setIsLoading(true); // Tampilkan "Gemini sedang berpikir..."
    setError(null);

    try {
      // 1. Gunakan .sendMessageStream()
      const result = await chatSessionRef.current.sendMessageStream(userMessage);
      
      // 2. Sembunyikan "berpikir..." karena stream akan dimulai
      setIsLoading(false);

      // 3. Tambahkan pesan model KOSONG sebagai placeholder
      setMessages((prev) => [
        ...prev,
        { role: 'model', content: '' },
      ]);

      let fullResponseText = '';
      // 4. Loop melalui setiap potongan (chunk) dari stream
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullResponseText += chunkText;

        // 5. Update pesan model (yang terakhir) dengan teks baru
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = fullResponseText;
          return newMessages;
        });
      }

    } catch (err) {
      console.error(err);
      setError('Gagal mengirim pesan. Pastikan nama model benar dan API key valid.');
      setIsLoading(false); // Hentikan loading jika error
    }
    // 'finally' tidak diperlukan lagi di sini
  };

  return (
    <div className="chat-container">
      <div className="chat-window" ref={chatWindowRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            {msg.content}
            {/* Tambahkan 'cursor' berkedip jika itu pesan model terakhir yang sedang 'mengetik' */}
            {msg.role === 'model' && index === messages.length - 1 && messages[messages.length - 1].content === '' && (
              <span className="typing-cursor">|</span>
            )}
          </div>
        ))}
        {/* "Berpikir" hanya muncul SESAAT sebelum stream dimulai */}
        {isLoading && <div className="loading">Gemini sedang berpikir...</div>}
        {error && <div className="error">{error}</div>}
      </div>

      <form className="chat-input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          placeholder="Ketik pesan Anda..."
          // Nonaktifkan input HANYA saat loading awal
          disabled={isLoading} 
        />
        <button type="submit" disabled={isLoading}>
          Kirim
        </button>
      </form>
    </div>
  );
}

export default App;

