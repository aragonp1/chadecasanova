
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import BohoButton from '../components/BohoButton';
import { RSVPFormData } from '../types';

const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbxOlGVk7obyKiKckGMsN5mXBnYAag6QlZeAIh0I0cQW6zCZjH5JEyiwNl0Gwd0vUnyfhg/exec";

const RSVP: React.FC = () => {
  const [formData, setFormData] = useState<RSVPFormData>({ 
    name: '', 
    companionsCount: 0, 
    companionNames: '',
    dietary: 'Nenhuma',
    dietaryCustom: '',
    message: '' 
  });
  
  const [companionsArray, setCompanionsArray] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [aiGreeting, setAiGreeting] = useState('');

  const handleCompanionsChange = (count: number) => {
    const newArr = Array(count).fill('');
    setCompanionsArray(newArr);
    setFormData({ ...formData, companionsCount: count });
  };

  const updateCompanionName = (index: number, name: string) => {
    const updated = [...companionsArray];
    updated[index] = name;
    setCompanionsArray(updated);
    setFormData({ ...formData, companionNames: updated.filter(n => n.trim() !== '').join(', ') });
  };

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
    
    const payload = {
      Horario_Registro: new Date().toLocaleString('pt-BR'),
      Nome_Completo: formData.name,
      Qtd_Extras: formData.companionsCount,
      Nomes_Extras: formData.companionNames,
      Tipo_Dieta: formData.dietary,
      Dieta_Especial: formData.dietaryCustom || '',
      Recado_Amor: formData.message || '',
      Categoria_Info: 'rsvp'
    };

    try {
      await fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      await generateAIGreeting(formData.name);
      setIsSubmitting(false);
      setSubmitted(true);
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
        <div className="mb-6 text-primary">
          <span className="material-symbols-outlined text-7xl">check_circle</span>
        </div>
        <h2 className="text-3xl font-serif font-bold text-[#2c1810] mb-2">Confirmar Presença</h2>
        <p className="text-stone-500">Responder até Sábado 07/03, por pena 🙏</p>
      </header>

      <form onSubmit={handleSubmit} className="bg-white/40 backdrop-blur-sm p-8 rounded-3xl border border-stone-200 shadow-xl space-y-6">
        <div>
          <label className="block text-sm font-bold text-[#2c1810] mb-2">Seu Nome e Sobrenome</label>
          <input 
            type="text" 
            required
            className="w-full bg-[#f2efe9] border-stone-200 rounded-xl px-4 py-3 focus:ring-primary transition-all"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            placeholder="Seu nome"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-[#2c1810] mb-2">Possui acompanhante(s)?</label>
          <select 
            className="w-full bg-[#f2efe9] border-stone-200 rounded-xl px-4 py-3 focus:ring-primary transition-all"
            value={formData.companionsCount}
            onChange={e => handleCompanionsChange(parseInt(e.target.value))}
          >
            <option value="0">Não, apenas eu</option>
            <option value="1">Sim, mais 1</option>
            <option value="2">Sim, mais 2</option>
            <option value="3">Sim, mais 3</option>
            <option value="4">Sim, mais 4</option>
          </select>
        </div>

        {companionsArray.length > 0 && (
          <div className="space-y-4 p-4 bg-primary/5 rounded-2xl border border-primary/10 animate-fade-in">
            <p className="text-xs font-bold text-primary uppercase tracking-wider">Nomes dos Acompanhantes</p>
            {companionsArray.map((name, idx) => (
              <input 
                key={idx}
                type="text"
                required
                className="w-full bg-white border-stone-200 rounded-xl px-4 py-2 text-sm focus:ring-primary transition-all"
                placeholder={`Nome do ${idx + 1}º acompanhante`}
                value={name}
                onChange={e => updateCompanionName(idx, e.target.value)}
              />
            ))}
          </div>
        )}

        <div>
          <label className="block text-sm font-bold text-[#2c1810] mb-2">Restrição Alimentar</label>
          <select 
            className="w-full bg-[#f2efe9] border-stone-200 rounded-xl px-4 py-3 focus:ring-primary transition-all"
            value={formData.dietary}
            onChange={e => setFormData({...formData, dietary: e.target.value})}
          >
            <option value="Nenhuma">Nenhuma</option>
            <option value="Vegano">Vegano</option>
            <option value="Vegetariano">Vegetariano</option>
            <option value="Intolerante a lactose">Intolerante a lactose</option>
            <option value="Celíaco">Celíaco</option>
            <option value="Outros">Outros</option>
          </select>
        </div>

        {formData.dietary === 'Outros' && (
          <div className="animate-fade-in">
            <label className="block text-xs font-bold text-stone-500 mb-1">Descreva sua restrição</label>
            <input 
              type="text"
              required
              className="w-full bg-[#f2efe9] border-stone-200 rounded-xl px-4 py-2 text-sm focus:ring-primary transition-all"
              value={formData.dietaryCustom}
              onChange={e => setFormData({...formData, dietaryCustom: e.target.value})}
              placeholder="Ex: Alergia a amendoim"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-bold text-[#2c1810] mb-2">Mensagem (Opcional)</label>
          <textarea 
            className="w-full bg-[#f2efe9] border-stone-200 rounded-xl px-4 py-3 focus:ring-primary transition-all"
            rows={2}
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
