
import React, { useState, useEffect } from 'react';
import BohoButton from '../components/BohoButton';

const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbxOlGVk7obyKiKckGMsN5mXBnYAag6QlZeAIh0I0cQW6zCZjH5JEyiwNl0Gwd0vUnyfhg/exec";

const GuestList: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [confirmations, setConfirmations] = useState<any[]>([]);
  const [giftsByGiver, setGiftsByGiver] = useState<Record<string, string[]>>({});

  const fetchAllData = async () => {
    try {
      const response = await fetch(GOOGLE_SHEET_URL);
      if (!response.ok) throw new Error('Falha ao buscar dados');
      const data = await response.json();
      
      let rsvps: any[] = data.rsvps || [];
      let gifts: any[] = data.gifts || [];

      // Mapeia presentes por nome de quem deu (usando o novo campo Quem_Presenteou)
      const giftMap: Record<string, string[]> = {};
      gifts.forEach(g => {
        if (g.Quem_Presenteou) {
          const nameKey = g.Quem_Presenteou.toLowerCase().trim();
          if (!giftMap[nameKey]) giftMap[nameKey] = [];
          giftMap[nameKey].push(g.Presente_Nome);
        }
      });

      setConfirmations(rsvps.reverse());
      setGiftsByGiver(giftMap);
    } catch (e) {
      console.error("Erro ao carregar lista:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const totalGuests = confirmations.reduce((sum, conf) => sum + 1 + (Number(conf.Qtd_Extras) || 0), 0);

  return (
    <div className="animate-fade-in pb-20">
      <header className="text-center mb-10">
        <div className="mb-4 text-primary">
          <span className="material-symbols-outlined text-6xl">group</span>
        </div>
        <h2 className="text-3xl font-serif font-bold text-[#2c1810] mb-2">Quem já confirmou</h2>
        <div className="inline-block bg-primary/10 px-4 py-1 rounded-full text-primary font-bold text-sm">
          {totalGuests} {totalGuests === 1 ? 'pessoa' : 'pessoas'} no total
        </div>
      </header>

      <section className="w-full space-y-6 mb-12">
        {isLoading ? (
          <div className="flex flex-col items-center py-20 gap-4">
            <svg className="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-stone-400 italic text-sm">Sincronizando com a nuvem...</p>
          </div>
        ) : confirmations.length === 0 ? (
          <div className="text-center py-16 bg-white/20 rounded-3xl border border-dashed border-stone-300">
            <p className="text-stone-400 italic">Aguardando as primeiras confirmações.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {confirmations.map((conf, index) => {
              const nameKey = (conf.Nome_Completo || "").toLowerCase().trim();
              const itemsChosen = giftsByGiver[nameKey] || [];
              
              return (
                <div key={index} className="bg-white/70 backdrop-blur-sm p-6 rounded-3xl border border-white shadow-sm flex flex-col gap-3 transition-all hover:shadow-md">
                  <div className="flex justify-between items-start">
                    <div className="flex-grow">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-[#2c1810] text-xl leading-tight">{conf.Nome_Completo}</h4>
                        {itemsChosen.length > 0 && (
                          <span className="material-symbols-outlined text-primary text-xl animate-pulse">redeem</span>
                        )}
                      </div>
                      
                      {Number(conf.Qtd_Extras) > 0 && conf.Nomes_Extras && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {conf.Nomes_Extras.split(', ').map((cName: string, i: number) => (
                            <span key={i} className="text-[10px] bg-stone-100 text-stone-500 px-2 py-0.5 rounded-lg font-bold border border-stone-200/50">
                              {cName}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-right flex flex-col items-end shrink-0">
                      <span className="text-[9px] text-stone-400 font-mono mb-1 uppercase tracking-tighter">
                        {conf.Horario_Registro?.split(' ')[0]}
                      </span>
                      <span className="text-[11px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-black">
                        +{conf.Qtd_Extras}
                      </span>
                    </div>
                  </div>

                  {/* Detalhe do Presente Escolhido */}
                  {itemsChosen.length > 0 && (
                    <div className="bg-primary/5 p-3 rounded-2xl border border-primary/10 flex flex-col gap-1">
                      <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Presente Escolhido:</p>
                      <div className="flex flex-wrap gap-1">
                        {itemsChosen.map((item, i) => (
                          <span key={i} className="text-xs font-bold text-[#2c1810] flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">check_small</span>
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-2 border-t border-stone-100/50">
                    <span className="material-symbols-outlined text-olive text-sm">nutrition</span>
                    <p className="text-[11px] text-stone-500">
                      <span className="font-bold">Dieta:</span> {conf.Tipo_Dieta === 'Outros' ? conf.Dieta_Especial : conf.Tipo_Dieta}
                    </p>
                  </div>

                  {conf.Recado_Amor && (
                    <p className="text-xs text-stone-400 italic leading-relaxed pl-3 border-l-2 border-primary/10 bg-stone-50/50 py-1 rounded-r-lg">
                      "{conf.Recado_Amor}"
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <div className="flex flex-col gap-4 max-w-[320px] mx-auto">
        <BohoButton label="Voltar ao Início" icon="arrow_back" variant="secondary" to="/" />
      </div>
    </div>
  );
};

export default GuestList;
