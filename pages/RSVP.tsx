
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import BohoButton from '../components/BohoButton';
import { RSVPFormData, RSVPConfirmation } from '../types';

const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbxOlGVk7obyKiKckGMsN5mXBnYAag6QlZeAIh0I0cQW6zCZjH5JEyiwNl0Gwd0vUnyfhg/exec";

const RSVP: React.FC = () => {
  const [formData, setFormData] = useState<RSVPFormData>({ name: '', guests: 1, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [aiGreeting, setAiGreeting] = useState('');

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
      await fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfirmation)
      });

      await generateAIGreeting(formData.name);
      
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', guests: 1, message: '' });
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Ocorreu um erro ao salvar. Verifique sua conexão.");
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
          <BohoButton label="Voltar ao Início" icon="arrow_back" variant="secondary" to="/" />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-20">
      <header className="text-center mb-10">
        <div className="mb-4 text-primary">
          <span className="material-symbols-outlined text-6xl">check_circle</span>
        </div>
        <h2 className="text-3xl font-serif font-bold text-[#2c1810] mb-2">Confirmar Presença</h2>
        <p className="text-stone-500">Responder até Sábado 07/03, por pena 🙏</p>
      </header>

      <form onSubmit={handleSubmit} className="bg-white/40 backdrop-blur-sm p-8 rounded-3xl border border-stone-200 shadow-xl space-y-6">
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
            placeholder="Deixe um recado..."
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full h-14 bg-primary text-white rounded-xl shadow-lg hover:shadow-primary/40 transition-all disabled:opacity-50 font-bold"
        >
          {isSubmitting ? "Confirmando..." : "Confirmar Agora"}
        </button>

        <BohoButton label="Voltar" icon="arrow_back" variant="secondary" to="/" />
      </form>
    </div>
  );
};

export default RSVP;
