
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
            {activeTab === 'convidados' ? 'family_restroom' : 'featured_seasonal_and_gifts'}
          </span>
        </div>
        <h2 className="text-3xl font-serif font-bold text-[#2c1810] mb-2">
          {activeTab === 'convidados' ? 'Lista de Confirmados' : 'Itens Presenteados'}
        </h2>
        <div className="flex flex-col items-center gap-1">
          <p className="text-stone-500 text-sm italic">
            {activeTab === 'convidados' 
              ? `No momento há ${totalGuests} confirmados!` 
              : `${gifts.length} presentes já foram reservados.`}
          </p>
          <div className="h-1 w-12 bg-primary/20 rounded-full mt-2"></div>
        </div>
      </header>

      {/* Seletor de Abas */}
      <div className="flex bg-[#f2efe9] p-1.5 rounded-2xl mb-8 shadow-inner border border-stone-200">
        <button 
          onClick={() => setActiveTab('convidados')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'convidados' ? 'bg-white text-primary shadow-md' : 'text-stone-400 hover:text-stone-600'}`}
        >
          <span className="material-symbols-outlined text-lg">group</span>
          Convidados
        </button>
        <button 
          onClick={() => setActiveTab('presentes')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'presentes' ? 'bg-white text-primary shadow-md' : 'text-stone-400 hover:text-stone-600'}`}
        >
          <span className="material-symbols-outlined text-lg">redeem</span>
          Presentes
        </button>
      </div>

      <section className="w-full space-y-6 mb-12 min-h-[300px]">
        {isLoading ? (
          <div className="flex flex-col items-center py-24 gap-4">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
            <p className="text-stone-400 font-medium italic text-sm animate-pulse">Buscando informações...</p>
          </div>
        ) : activeTab === 'convidados' ? (
          /* LISTA DE CONVIDADOS DETALHADA */
          rsvps.length === 0 ? (
            <div className="text-center py-16 bg-white/40 rounded-3xl border-2 border-dashed border-stone-200">
              <span className="material-symbols-outlined text-stone-300 text-5xl mb-2">person_off</span>
              <p className="text-stone-400 italic font-medium">Ninguém confirmou ainda. Seja o primeiro!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {rsvps.map((conf, index) => {
                const extrasCount = Number(conf.Qtd_Extras) || 0;
                return (
                  <div key={index} className="bg-white rounded-[2rem] border border-stone-100 shadow-xl overflow-hidden transition-all hover:shadow-primary/5">
                    {/* Header do Card */}
                    <div className="bg-[#fcfaf7] px-6 py-4 border-b border-stone-50 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary text-xl font-bold">person</span>
                        </div>
                        <h4 className="font-serif font-bold text-[#2c1810] text-xl">{conf.Nome_Completo}</h4>
                      </div>
                      {/* <span className="text-[10px] text-stone-300 font-mono tracking-wider">{conf.Horario_Registro?.split(' ')[0]}</span> */}
                    </div>

                    <div className="p-6 space-y-4">
                      {/* Seção Convidados */}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase text-stone-400 tracking-widest flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">diversity_3</span>
                            Acompanhantes
                          </span>
                          {extrasCount > 0 ? (
                            <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">+{extrasCount} pessoa(s)</span>
                          ) : (
                            <span className="bg-stone-100 text-stone-400 text-[10px] font-bold px-2 py-0.5 rounded-full">Virá sozinho(a)</span>
                          )}
                        </div>
                        {extrasCount > 0 && conf.Nomes_Extras && (
                          <div className="bg-primary/5 border border-primary/10 p-3 rounded-2xl">
                             <p className="text-xs text-[#2c1810] font-medium leading-relaxed italic">
                               {conf.Nomes_Extras}
                             </p>
                          </div>
                        )}
                      </div>

                      {/* Seção Restrição Alimentar - Exclusiva desta aba */}
                      <div className="pt-2 border-t border-stone-50">
                        <span className="text-[10px] font-black uppercase text-stone-400 tracking-widest flex items-center gap-1 mb-2">
                          <span className="material-symbols-outlined text-xs">restaurant</span>
                          Informação Alimentar
                        </span>
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border ${conf.Tipo_Dieta === 'Nenhuma' ? 'bg-stone-50 border-stone-100 text-stone-400' : 'bg-olive/10 border-olive/20 text-olive'}`}>
                           <span className="material-symbols-outlined text-sm">
                             {conf.Tipo_Dieta === 'Nenhuma' ? 'check_circle' : 'warning'}
                           </span>
                           <span className="text-xs font-bold">
                             {conf.Tipo_Dieta === 'Outros' ? `Outros: ${conf.Dieta_Especial}` : conf.Tipo_Dieta}
                           </span>
                        </div>
                      </div>

                      {/* Recado */}
                      {conf.Recado_Amor && (
                        <div className="pt-2 border-t border-stone-50">
                           <span className="text-[10px] font-black uppercase text-stone-400 tracking-widest flex items-center gap-1 mb-2">
                             <span className="material-symbols-outlined text-xs">chat_bubble</span>
                             Mensagem Carinhosa
                           </span>
                           <div className="relative">
                             <span className="absolute -left-2 -top-1 text-primary/20 text-4xl font-serif">“</span>
                             <p className="text-sm text-stone-600 italic leading-relaxed pl-4">
                               {conf.Recado_Amor}
                             </p>
                           </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          /* LISTA DE PRESENTES RESERVADOS DETALHADA */
          gifts.length === 0 ? (
            <div className="text-center py-16 bg-white/40 rounded-3xl border-2 border-dashed border-stone-200">
              <span className="material-symbols-outlined text-stone-300 text-5xl mb-2">inventory_2</span>
              <p className="text-stone-400 italic font-medium">Ainda não há presentes reservados.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {gifts.map((gift, index) => (
                <div key={index} className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-lg flex items-center gap-5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
                  
                  <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                    <span className="material-symbols-outlined text-2xl">redeem</span>
                  </div>
                  
                  <div className="flex-grow z-10">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] bg-[#f2efe9] text-primary px-2 py-0.5 rounded-full font-black uppercase tracking-widest">
                        {gift.Presente_Comodo}
                      </span>
                    </div>
                    <h4 className="font-serif font-bold text-[#2c1810] text-lg leading-tight mb-1">{gift.Presente_Nome}</h4>
                    <p className="text-xs text-stone-500">
                      Presenteado por <span className="text-primary font-bold">{gift.Quem_Presenteou}</span>
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    {/* <div className="text-[10px] font-mono text-stone-300">
                      {gift.Horario_Registro?.split(' ')[0]}
                    </div> */}
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


