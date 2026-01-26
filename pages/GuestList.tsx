
import React, { useState, useEffect } from 'react';
import BohoButton from '../components/BohoButton';

const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbxOlGVk7obyKiKckGMsN5mXBnYAag6QlZeAIh0I0cQW6zCZjH5JEyiwNl0Gwd0vUnyfhg/exec";

type TabType = 'convidados' | 'presentes';

const GuestList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('convidados');
  const [isLoading, setIsLoading] = useState(true);
  const [rsvps, setRsvps] = useState<any[]>([]);
  const [gifts, setGifts] = useState<any[]>([]);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(GOOGLE_SHEET_URL);
      if (!response.ok) throw new Error('Falha ao buscar dados');
      const data = await response.json();
      
      setRsvps(data.rsvps ? data.rsvps.reverse() : []);
      setGifts(data.gifts ? data.gifts.reverse() : []);
    } catch (e) {
      console.error("Erro ao carregar lista:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const totalGuests = rsvps.reduce((sum, conf) => sum + 1 + (Number(conf.Qtd_Extras) || 0), 0);

  return (
    <div className="animate-fade-in pb-20">
      <header className="text-center mb-8">
        <div className="mb-4 text-primary">
          <span className="material-symbols-outlined text-6xl">
            {activeTab === 'convidados' ? 'group' : 'redeem'}
          </span>
        </div>
        <h2 className="text-3xl font-serif font-bold text-[#2c1810] mb-2">
          {activeTab === 'convidados' ? 'Lista de Convidados' : 'Presentes Reservados'}
        </h2>
        <p className="text-stone-500 text-sm italic">
          {activeTab === 'convidados' 
            ? `Já temos ${totalGuests} confirmados!` 
            : `Já foram reservados ${gifts.length} itens.`}
        </p>
      </header>

      {/* Seletor de Abas */}
      <div className="flex bg-[#f2efe9] p-1.5 rounded-2xl mb-8 shadow-inner">
        <button 
          onClick={() => setActiveTab('convidados')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'convidados' ? 'bg-white text-primary shadow-sm' : 'text-stone-400'}`}
        >
          <span className="material-symbols-outlined text-lg">group</span>
          Convidados
        </button>
        <button 
          onClick={() => setActiveTab('presentes')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'presentes' ? 'bg-white text-primary shadow-sm' : 'text-stone-400'}`}
        >
          <span className="material-symbols-outlined text-lg">redeem</span>
          Presentes
        </button>
      </div>

      <section className="w-full space-y-6 mb-12 min-h-[300px]">
        {isLoading ? (
          <div className="flex flex-col items-center py-20 gap-4">
            <svg className="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-stone-400 italic text-sm">Sincronizando com a nuvem...</p>
          </div>
        ) : activeTab === 'convidados' ? (
          /* LISTA DE CONVIDADOS (RSVPs) */
          rsvps.length === 0 ? (
            <div className="text-center py-16 bg-white/20 rounded-3xl border border-dashed border-stone-300">
              <p className="text-stone-400 italic">Aguardando as primeiras confirmações.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {rsvps.map((conf, index) => (
                <div key={index} className="bg-white/70 backdrop-blur-sm p-5 rounded-2xl border border-white shadow-sm flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-[#2c1810] text-lg">{conf.Nome_Completo}</h4>
                      {Number(conf.Qtd_Extras) > 0 && (
                        <p className="text-[10px] text-stone-500 font-medium">
                          Acompanhantes: <span className="text-primary">{conf.Nomes_Extras}</span>
                        </p>
                      )}
                    </div>
                    {/* Badge de acompanhantes condicional - só aparece se > 0 */}
                    {Number(conf.Qtd_Extras) > 0 && (
                      <div className="bg-primary/10 text-primary px-2 py-0.5 rounded-lg font-black text-[10px]">
                        +{conf.Qtd_Extras}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 pt-1 border-t border-stone-100/50">
                    <span className="material-symbols-outlined text-olive text-[14px]">nutrition</span>
                    <p className="text-[10px] text-stone-500 italic">
                      {conf.Tipo_Dieta === 'Outros' ? conf.Dieta_Especial : conf.Tipo_Dieta}
                    </p>
                  </div>

                  {conf.Recado_Amor && (
                    <p className="text-[11px] text-stone-400 bg-stone-50/80 p-2 rounded-lg italic mt-1 leading-relaxed">
                      "{conf.Recado_Amor}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          )
        ) : (
          /* LISTA DE PRESENTES RESERVADOS */
          gifts.length === 0 ? (
            <div className="text-center py-16 bg-white/20 rounded-3xl border border-dashed border-stone-300">
              <p className="text-stone-400 italic">Nenhum presente reservado ainda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {gifts.map((gift, index) => (
                <div key={index} className="bg-white/70 backdrop-blur-sm p-5 rounded-2xl border border-white shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary">redeem</span>
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold text-[#2c1810] text-base leading-tight">{gift.Presente_Nome}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] bg-stone-100 text-stone-500 px-2 py-0.5 rounded uppercase font-bold tracking-tighter">
                        {gift.Presente_Comodo}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400 mt-2">
                      Reservado por: <span className="text-[#2c1810] font-bold">{gift.Quem_Presenteou}</span>
                    </p>
                  </div>
                  <div className="text-[9px] text-stone-300 font-mono text-right">
                    {gift.Horario_Registro?.split(' ')[0]}
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </section>

      <div className="flex flex-col gap-4 max-w-[320px] mx-auto">
        <BohoButton label="Voltar ao Início" icon="arrow_back" variant="secondary" to="/" />
      </div>
    </div>
  );
};

export default GuestList;
