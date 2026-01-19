
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import BohoButton from '../components/BohoButton';
import { RSVPFormData, RSVPConfirmation } from '../types';

// Sua URL configurada
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbxOlGVk7obyKiKckGMsN5mXBnYAag6QlZeAIh0I0cQW6zCZjH5JEyiwNl0Gwd0vUnyfhg/exec";

const RSVP: React.FC = () => {
  const [formData, setFormData] = useState<RSVPFormData>({ name: '', guests: 1, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [aiGreeting, setAiGreeting] = useState('');
  const [confirmations, setConfirmations] = useState<RSVPConfirmation[]>([]);

  // Carrega as confirmações da Planilha
  const fetchConfirmations = async () => {
    try {
      const response = await fetch(GOOGLE_SHEET_URL);
      if (!response.ok) throw new Error('Falha ao buscar dados');
      const data = await response.json();
      
      // Filtra entradas que tenham pelo menos um nome e inverte a ordem
      if (Array.isArray(data)) {
        const validData = data.filter((item: any) => item.name).reverse();
        setConfirmations(validData);
      }
    } catch (e) {
      console.error("Erro ao carregar lista da planilha:", e);
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    fetchConfirmations();
  }, []);

  const generateAIGreeting = async (name: string) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Escreva uma mensagem de agradecimento carinhosa e curta (máximo 2 frases) para ${name}, que confirmou presença no Chá de Casa Nova da Dayane. Use um tom caloroso e estilo boho.`,
      });
      setAiGreeting(response.text || 'Obrigada por confirmar! Mal posso esperar para te ver.');
    } catch (error) {
      setAiGreeting('Obrigada por confirmar sua presença! Mal posso esperar para te ver.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const newConfirmation: RSVPConfirmation = {
      ...formData,
      id: crypto.randomUUID(),
      timestamp: new Date().toLocaleString('pt-BR')
    };

    try {
      // 1. Enviar para a Planilha Google
      // Nota: Usamos no-cors para evitar problemas de redirecionamento do Google Apps Script
      await fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfirmation)
      });

      // 2. Gerar saudação com IA
      await generateAIGreeting(formData.name);

      // 3. Atualizar lista local para feedback imediato
      setConfirmations([newConfirmation, ...confirmations]);
      
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', guests: 1, message: '' });
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Ocorreu um erro ao salvar sua presença. Verifique sua conexão.");
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center text-center animate-fade-in py-12">
        <div className="mb-6 text-primary">
          <span className="material-symbols-outlined text-7xl">celebration</span>
        </div>
        <h2 className="text-3xl font-serif font-bold text-[#2c1810] mb-4">Presença Confirmada!</h2>
        <div className="bg-white/60 p-6 rounded-2xl shadow-sm border border-primary/20 mb-8 italic text-lg text-stone-700">
          "{aiGreeting}"
        </div>
        <div className="w-full flex flex-col gap-4 max-w-[320px]">
          <BohoButton label="Ver Lista de Confirmados" icon="list" onClick={() => setSubmitted(false)} />
          <BohoButton label="Voltar ao Início" icon="arrow_back" variant="secondary" to="/" />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-20">
      <header className="text-center mb-10">
        <h2 className="text-3xl font-serif font-bold text-[#2c1810] mb-2">Confirmar Presença</h2>
        <p className="text-stone-500">Por favor, confirme até o dia 10 de Outubro</p>
      </header>

      <form onSubmit={handleSubmit} className="bg-white/40 backdrop-blur-sm p-8 rounded-3xl border border-stone-200 shadow-xl space-y-6 mb-16">
        <div>
          <label className="block text-sm font-bold text-[#2c1810] mb-2">Seu Nome</label>
          <input 
            type="text" 
            required
            className="w-full bg-[#f2efe9] border-stone-200 rounded-xl px-4 py-3 focus:ring-primary focus:border-primary transition-all"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            placeholder="Ex: Maria Oliveira"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-[#2c1810] mb-2">Quantidade de Pessoas</label>
          <select 
            className="w-full bg-[#f2efe9] border-stone-200 rounded-xl px-4 py-3 focus:ring-primary focus:border-primary transition-all"
            value={formData.guests}
            onChange={e => setFormData({...formData, guests: parseInt(e.target.value)})}
          >
            {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} {n === 1 ? 'pessoa' : 'pessoas'}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-[#2c1810] mb-2">Mensagem (Opcional)</label>
          <textarea 
            className="w-full bg-[#f2efe9] border-stone-200 rounded-xl px-4 py-3 focus:ring-primary focus:border-primary transition-all"
            rows={3}
            value={formData.message}
            onChange={e => setFormData({...formData, message: e.target.value})}
            placeholder="Deixe um recado para a Dayane..."
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full h-14 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3 border-2 border-white border-t-transparent rounded-full" viewBox="0 0 24 24"></svg>
              Confirmando...
            </span>
          ) : "Confirmar Agora"}
        </button>

        <BohoButton label="Voltar" icon="arrow_back" variant="secondary" to="/" />
      </form>

      <section className="w-full">
        <div className="flex items-center gap-3 mb-6">
          <span className="h-px flex-grow bg-primary/20"></span>
          <h3 className="font-serif text-2xl font-bold text-[#2c1810] whitespace-nowrap">Quem já confirmou</h3>
          <span className="h-px flex-grow bg-primary/20"></span>
        </div>

        {isLoadingList ? (
          <div className="flex justify-center py-10">
            <svg className="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : confirmations.length === 0 ? (
          <div className="text-center py-10 bg-white/20 rounded-3xl border border-dashed border-stone-300">
            <p className="text-stone-400 italic">Nenhuma confirmação ainda. Seja a primeira!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {confirmations.map((conf) => (
              <div key={conf.id} className="bg-white/50 backdrop-blur-sm p-5 rounded-2xl border border-stone-100 shadow-sm flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-[#2c1810] text-lg">{conf.name}</h4>
                    <span className="text-xs text-primary font-bold uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded-full">
                      {conf.guests} {conf.guests === 1 ? 'Convidado' : 'Convidados'}
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-400">
                    {conf.timestamp}
                  </span>
                </div>
                {conf.message && (
                  <p className="text-sm text-stone-600 italic mt-1 leading-relaxed border-l-2 border-primary/20 pl-3">
                    "{conf.message}"
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default RSVP;
