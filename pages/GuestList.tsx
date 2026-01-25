
import React, { useState, useEffect } from 'react';
import BohoButton from '../components/BohoButton';
import { RSVPConfirmation } from '../types';

const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbxOlGVk7obyKiKckGMsN5mXBnYAag6QlZeAIh0I0cQW6zCZjH5JEyiwNl0Gwd0vUnyfhg/exec";

const GuestList: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [confirmations, setConfirmations] = useState<RSVPConfirmation[]>([]);

  const fetchConfirmations = async () => {
    try {
      const response = await fetch(GOOGLE_SHEET_URL);
      if (!response.ok) throw new Error('Falha ao buscar dados');
      const data = await response.json();
      
      if (Array.isArray(data)) {
        const validData = data.filter((item: any) => item.name).reverse();
        setConfirmations(validData);
      }
    } catch (e) {
      console.error("Erro ao carregar lista:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConfirmations();
  }, []);

  const totalGuests = confirmations.reduce((sum, conf) => sum + (Number(conf.guests) || 0), 0);

  return (
    <div className="animate-fade-in pb-20">
      <header className="text-center mb-10">
        <div className="mb-4 text-primary">
          <span className="material-symbols-outlined text-6xl">group</span>
        </div>
        <h2 className="text-3xl font-serif font-bold text-[#2c1810] mb-2">Convidados Confirmados</h2>
        <div className="inline-block bg-primary/10 px-4 py-1 rounded-full text-primary font-bold text-sm">
          {totalGuests} {totalGuests === 1 ? 'pessoa confirmada' : 'pessoas confirmadas'}
        </div>
      </header>

      <section className="w-full space-y-4 mb-12">
        {isLoading ? (
          <div className="flex flex-col items-center py-20 gap-4">
            <svg className="animate-spin h-10 w-10 text-primary" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-stone-400 italic">Carregando lista carinhosamente...</p>
          </div>
        ) : confirmations.length === 0 ? (
          <div className="text-center py-16 bg-white/20 rounded-3xl border border-dashed border-stone-300">
            <p className="text-stone-400 italic">Ainda não temos confirmações. Que tal ser o primeiro?</p>
            <div className="mt-6 max-w-[200px] mx-auto">
              <BohoButton label="Confirmar Agora" icon="check" to="/rsvp" variant="primary" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {confirmations.map((conf) => (
              <div key={conf.id} className="bg-white/50 backdrop-blur-sm p-5 rounded-2xl border border-stone-100 shadow-sm flex flex-col gap-2 transition-all hover:shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-[#2c1810] text-lg">{conf.name}</h4>
                    <span className="text-xs text-primary font-bold uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded-full">
                      +{conf.guests - 1} {conf.guests === 1 ? 'acompanhante' : 'acompanhantes'}
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-400 italic">
                    {conf.timestamp?.split(',')[0]}
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

      <BohoButton label="Voltar ao Início" icon="arrow_back" variant="secondary" to="/" />
    </div>
  );
};

export default GuestList;
