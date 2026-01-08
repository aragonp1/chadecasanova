
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import BohoButton from '../components/BohoButton';
import { RSVPFormData } from '../types';

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
      setAiGreeting(response.text || 'Obrigada por confirmar sua presença! Mal posso esperar para te ver.');
    } catch (error) {
      console.error("AI Error:", error);
      setAiGreeting('Obrigada por confirmar sua presença! Mal posso esperar para te ver.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    await generateAIGreeting(formData.name);
    
    setIsSubmitting(false);
    setSubmitted(true);
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
        <BohoButton label="Voltar ao Início" icon="arrow_back" variant="secondary" to="/" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <header className="text-center mb-10">
        <h2 className="text-3xl font-serif font-bold text-[#2c1810] mb-2">Confirmar Presença</h2>
        <p className="text-stone-500">Por favor, confirme até o dia 10 de Outubro</p>
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

        <BohoButton label="Cancelar" icon="close" variant="secondary" to="/" />
      </form>
    </div>
  );
};

export default RSVP;
