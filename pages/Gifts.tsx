
import React, { useState, useEffect } from 'react';
import BohoButton from '../components/BohoButton';

const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbxOlGVk7obyKiKckGMsN5mXBnYAag6QlZeAIh0I0cQW6zCZjH5JEyiwNl0Gwd0vUnyfhg/exec";
const PIX_KEY = "seu-email-ou-cpf-aqui@exemplo.com"; // Substitua pela sua chave real

const ROOMS_DATA = {
  cozinha: [
    { id: 'c1', name: 'Air Fryer', taken: false },
    { id: 'c2', name: 'Batedeira de Bolo', taken: false },
    { id: 'c3', name: 'Jogo de Panelas Antiaderentes', taken: false },
    { id: 'c4', name: 'Micro-ondas Espelhado', taken: false },
    { id: 'c5', name: 'Mesa de Jantar 4 Lugares', taken: false },
    { id: 'c6', name: 'Jogo de Utensílios de Silicone', taken: false },
  ],
  sala: [
    { id: 's1', name: 'Tapete Boho Off-White', taken: false },
    { id: 's2', name: 'Luminária de Chão', taken: false },
    { id: 's3', name: 'Almofadas de Macramê', taken: false },
    { id: 's4', name: 'Quadro Decorativo Minimalista', taken: false },
    { id: 's5', name: 'Aparador de Livros', taken: false },
  ],
  quarto: [
    { id: 'q1', name: 'Jogo de Lençol Solteiro', taken: false },
    { id: 'q2', name: 'Organizadores de Closet', taken: false },
    { id: 'q3', name: 'Cortinas do Quarto', taken: false },
    { id: 'q4', name: 'Cesto de Roupa Suja (Vime)', taken: false },
  ],
  suite: [
    { id: 'st1', name: 'Jogo de Cama King (Linho)', taken: false },
    { id: 'st2', name: 'Abajur de Cabeceira', taken: false },
    { id: 'st3', name: 'Manta de Tricot', taken: false },
    { id: 'st4', name: 'Espelho de Chão Médio', taken: false },
  ],
  bwc: [
    { id: 'b1', name: 'Kit Lavabo de Cerâmica', taken: false },
    { id: 'b2', name: 'Jogo de Toalhas de Banho (6 peças)', taken: false },
    { id: 'b3', name: 'Prateleira de Bambu para Banheiro', taken: false },
    { id: 'b4', name: 'Tapete Antiderrapante Luxo', taken: false },
  ]
};

const Gifts: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [reservedGifts, setReservedGifts] = useState<string[]>([]);
  const [isReserving, setIsReserving] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchTakenGifts = async () => {
      try {
        const response = await fetch(GOOGLE_SHEET_URL);
        const data = await response.json();
        if (data.gifts) {
          setReservedGifts(data.gifts.map((g: any) => g.itemName));
        } else if (Array.isArray(data)) {
          const gifts = data.filter(item => item.type === 'gift').map(item => item.itemName);
          setReservedGifts(gifts);
        }
      } catch (e) {
        console.error("Erro ao carregar presentes:", e);
      }
    };
    fetchTakenGifts();
  }, []);

  const handleCopyPix = () => {
    navigator.clipboard.writeText(PIX_KEY);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleReserve = async (giftName: string, roomName: string) => {
    const name = prompt(`Você escolheu: ${giftName}\n\nPor favor, digite seu nome completo para confirmarmos:`);
    if (!name || name.trim() === "") {
      alert("Precisamos do seu nome para reservar o presente.");
      return;
    }

    setIsReserving(true);
    try {
      await fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'gift',
          id: crypto.randomUUID(),
          itemName: giftName,
          room: roomName,
          giverName: name.trim(),
          timestamp: new Date().toLocaleString('pt-BR')
        })
      });

      setReservedGifts([...reservedGifts, giftName]);
      alert(`Obrigada, ${name}! O presente "${giftName}" foi reservado.`);
    } catch (error) {
      console.error("Erro ao reservar:", error);
      alert("Houve um erro técnico. Tente novamente em instantes.");
    } finally {
      setIsReserving(false);
    }
  };

  return (
    <div className="animate-fade-in pb-20">
      <header className="text-center mb-8">
        <div className="mb-4 text-primary">
          <span className="material-symbols-outlined text-6xl">home_pin</span>
        </div>
        <h2 className="text-3xl font-serif font-bold text-[#2c1810] mb-2">Lista de Presentes</h2>
        <p className="text-stone-500 text-sm italic px-6">Escolha como deseja nos presentear</p>
      </header>

      {/* Seção PIX - DESTAQUE */}
      <div className="mb-10 bg-white/40 backdrop-blur-sm p-6 rounded-3xl border border-primary/20 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <span className="material-symbols-outlined text-7xl text-primary">payments</span>
        </div>
        
        <div className="relative z-10">
          <h3 className="text-xl font-serif font-bold text-[#2c1810] mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">volunteer_activism</span>
            Presente em Dinheiro (PIX)
          </h3>
          <p className="text-stone-600 text-sm mb-6 leading-relaxed">
            Se preferir nos ajudar com qualquer valor para a montagem do nosso lar, nossa chave PIX está abaixo:
          </p>
          
          <div className="bg-[#f2efe9] p-4 rounded-2xl border border-stone-200 flex flex-col items-center gap-4">
            <div className="text-center">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-1">Chave PIX</span>
              <code className="text-sm font-bold text-primary break-all">{PIX_KEY}</code>
            </div>
            
            <button 
              onClick={handleCopyPix}
              className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md ${copied ? 'bg-olive text-white' : 'bg-primary text-white hover:bg-primary-dark'}`}
            >
              <span className="material-symbols-outlined text-lg">
                {copied ? 'check_circle' : 'content_copy'}
              </span>
              {copied ? 'Chave Copiada!' : 'Copiar Chave PIX'}
            </button>
          </div>
          
          <p className="text-[10px] text-stone-400 text-center mt-4 italic">
            Titular: Dayane Oliveira
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="h-px bg-stone-200 flex-grow"></div>
        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em]">Ou escolha um item</span>
        <div className="h-px bg-stone-200 flex-grow"></div>
      </div>

      {/* Mapa de Presentes */}
      <div className="relative w-full aspect-[1.6/1] bg-[#f9f7f2] rounded-3xl border-2 border-stone-200 shadow-xl overflow-hidden mb-8 group">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500"
          style={{ 
            backgroundImage: "url('./planta.jpg')",
            backgroundColor: "#f3f3f3"
          }}
        ></div>

        <div className={`absolute inset-0 bg-black/5 transition-opacity duration-300 pointer-events-none ${selectedRoom ? 'opacity-100' : 'opacity-0'}`}></div>

        <svg viewBox="0 0 800 500" className="absolute inset-0 w-full h-full z-10">
          <rect x="0" y="0" width="315" height="325" className={`cursor-pointer transition-all duration-300 ${selectedRoom === 'quarto' ? 'fill-primary/30 stroke-primary stroke-[4px]' : 'fill-transparent hover:fill-primary/10'}`} onClick={() => setSelectedRoom('quarto')} />
          <rect x="320" y="0" width="230" height="500" className={`cursor-pointer transition-all duration-300 ${selectedRoom === 'sala' ? 'fill-primary/30 stroke-primary stroke-[4px]' : 'fill-transparent hover:fill-primary/10'}`} onClick={() => setSelectedRoom('sala')} />
          <rect x="555" y="0" width="245" height="325" className={`cursor-pointer transition-all duration-300 ${selectedRoom === 'suite' ? 'fill-primary/30 stroke-primary stroke-[4px]' : 'fill-transparent hover:fill-primary/10'}`} onClick={() => setSelectedRoom('suite')} />
          <rect x="0" y="330" width="315" height="170" className={`cursor-pointer transition-all duration-300 ${selectedRoom === 'cozinha' ? 'fill-primary/30 stroke-primary stroke-[4px]' : 'fill-transparent hover:fill-primary/10'}`} onClick={() => setSelectedRoom('cozinha')} />
          <rect x="555" y="330" width="245" height="170" className={`cursor-pointer transition-all duration-300 ${selectedRoom === 'bwc' ? 'fill-primary/30 stroke-primary stroke-[4px]' : 'fill-transparent hover:fill-primary/10'}`} onClick={() => setSelectedRoom('bwc')} />
        </svg>

        {!selectedRoom && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none z-20">
             <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full border border-primary/20 shadow-lg flex items-center gap-2 animate-bounce">
                <span className="material-symbols-outlined text-primary text-sm">touch_app</span>
                <span className="text-[10px] font-bold text-stone-600 uppercase tracking-widest">Toque nos cômodos</span>
             </div>
          </div>
        )}
      </div>

      {selectedRoom && (
        <div className="animate-fade-in space-y-4 mb-10 bg-white/60 p-6 rounded-3xl border border-stone-200 shadow-sm">
          <div className="flex justify-between items-center border-b border-stone-100 pb-3">
            <h3 className="font-serif text-2xl font-bold text-[#2c1810] capitalize flex items-center gap-2">
               <span className="material-symbols-outlined text-primary">
                 {selectedRoom === 'cozinha' ? 'kitchen' : selectedRoom === 'sala' ? 'weekend' : selectedRoom === 'quarto' ? 'bed' : selectedRoom === 'suite' ? 'king_bed' : 'clean_hands'}
               </span>
               {selectedRoom === 'bwc' ? 'Banheiro' : selectedRoom === 'cozinha' ? 'Cozinha / Serviço' : selectedRoom === 'suite' ? 'Suíte Revers.' : selectedRoom}
            </h3>
            <button onClick={() => setSelectedRoom(null)} className="text-stone-400 hover:text-primary">
               <span className="material-symbols-outlined">cancel</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-3 mt-4">
            {ROOMS_DATA[selectedRoom as keyof typeof ROOMS_DATA].map((item) => {
              const isTaken = reservedGifts.includes(item.name);
              return (
                <div key={item.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${isTaken ? 'bg-stone-100/50 border-stone-200 opacity-60' : 'bg-white border-primary/5 shadow-sm'}`}>
                  <div className="flex flex-col">
                    <span className={`font-bold ${isTaken ? 'line-through text-stone-400' : 'text-[#2c1810]'}`}>
                      {item.name}
                    </span>
                    <span className="text-[10px] text-stone-400 font-medium">Sugestão Dayane</span>
                  </div>
                  {!isTaken ? (
                    <button 
                      onClick={() => handleReserve(item.name, selectedRoom)}
                      className="bg-primary text-white px-4 py-2 rounded-xl text-[11px] font-bold shadow-md hover:scale-105 transition-all"
                    >
                      Reservar
                    </button>
                  ) : (
                    <div className="flex items-center gap-1 text-primary/60">
                       <span className="material-symbols-outlined text-sm">check_circle</span>
                       <span className="text-[10px] font-bold uppercase tracking-tight">Já escolhido</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <BohoButton label="Voltar ao Início" icon="arrow_back" variant="secondary" to="/" />
    </div>
  );
};

export default Gifts;
