
import React, { useState, useEffect } from 'react';
import BohoButton from '../components/BohoButton';

const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbxOlGVk7obyKiKckGMsN5mXBnYAag6QlZeAIh0I0cQW6zCZjH5JEyiwNl0Gwd0vUnyfhg/exec";
const PIX_KEY = "4074dd6d-9faa-4e8d-b944-bfb6a47277ba"; // Substitua pela sua chave real

const ROOMS_DATA = {
  cozinha: [
    { id: 'c1', name: 'Botijão de Gás' },
    { id: 'c2', name: 'Cafeteira' },
    { id: 'c3', name: 'Conjunto de pratos' },
    { id: 'c4', name: 'Cooktop' },
    { id: 'c5', name: 'Escorredor de louça' },
    { id: 'c6', name: 'Faqueiro' },
    { id: 'c7', name: 'Frigideira antiaderente' },
    { id: 'c8', name: 'Fritadeira Air Fryer forno' },
    { id: 'c9', name: 'Jogo americano' },
    { id: 'c10', name: 'Jogo de assadeiras' },
    { id: 'c11', name: 'Jogo de panela antiaderente' },
    { id: 'c12', name: 'Jogo de utensílios de silicone' },
    { id: 'c13', name: 'Kit de ferramentas' },
    { id: 'c14', name: 'Liquidificador' },
    { id: 'c15', name: 'Máquina de lavar' },
    { id: 'c16', name: 'Mesa de jantar 4 lugares' },
    { id: 'c17', name: 'Mop' },
    { id: 'c18', name: 'Panela de pressão' },
    { id: 'c19', name: 'Pano de prato' },
    { id: 'c20', name: 'Petisqueira' },
    { id: 'c21', name: 'Toalha de mesa' },
  ],
  sala: [
    { id: 's1', name: 'Alexa' },
    { id: 's2', name: 'Almofadas' },
    { id: 's3', name: 'Cortina blackout' },
    { id: 's4', name: 'Jarros de planta' },
    { id: 's5', name: 'Lâmpada inteligente' },
    { id: 's6', name: 'Mesa de centro' },
    { id: 's7', name: 'Painel para TV' },
    { id: 's8', name: 'Robô aspirador' },
    { id: 's9', name: 'Sofá cama' },
    { id: 's10', name: 'Tapete' },
    { id: 's11', name: 'Televisão' },
  ],
  quarto: [
    { id: 'q1', name: 'Caixas organizadoras' },
    { id: 'q2', name: 'Cortina blackout' },
    { id: 'q3', name: 'Estante' },
    { id: 'q4', name: 'Puff' },
    { id: 'q5', name: 'Rede' },
    { id: 'q6', name: 'Tapete' },
    { id: 'q7', name: 'Ventilador' },
  ],
  suite: [
    { id: 'st1', name: 'Ar condicionado' },
    { id: 'st2', name: 'Caixas organizadoras' },
    { id: 'st3', name: 'Cortina blackout' },
    { id: 'st4', name: 'Espelho de corpo inteiro' },
    { id: 'st5', name: 'Jogo de cama Queen 1' },
    { id: 'st6', name: 'Jogo de cama Queen 2' },
    { id: 'st7', name: 'Lençol elástico' },
    { id: 'st8', name: 'Porta jóias' },
    { id: 'st9', name: 'Tapete felpudo' },
    { id: 'st10', name: 'Televisão' },
    { id: 'st11', name: 'Travesseiros' },
  ],
  bwc: [
    { id: 'b1', name: 'Armário com espelho' },
    { id: 'b2', name: 'Cesto para roupa' },
    { id: 'b3', name: 'Chuveiro elétrico' },
    { id: 'b4', name: 'Jogo de toalhas' },
    { id: 'b5', name: 'Kit lavabo de cerâmicas' },
    { id: 'b6', name: 'Prateleira de bambu' },
    { id: 'b7', name: 'Tapete antiderrapante' },
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
          // Usando o novo nome do campo Presente_Nome
          setReservedGifts(data.gifts.map((g: any) => g.Presente_Nome));
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
    const name = prompt(`Você escolheu: ${giftName}\n\nPor favor, digite seu nome/grupo para confirmarmos:`);
    if (!name || name.trim() === "") {
      alert("Precisamos do seu nome/grupo para reservar o presente.");
      return;
    }

    setIsReserving(true);
    try {
      await fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Categoria_Info: 'presente',
          Horario_Registro: new Date().toLocaleString('pt-BR'),
          Presente_Nome: giftName,
          Presente_Comodo: roomName,
          Quem_Presenteou: name.trim()
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
        <p className="text-stone-500 px-6">Aqui vão algumas regras sobre os presentes 📋:</p>
        <ul className="text-stone-500 px-6 text-left list-disc">
        <li>Sua presença é o item mais importante que espero receber;</li>
        <li>Em cada cômodo da casa vai ter meus desejos para o local;</li>
        <li>Seu mimo pode ser tanto um presente como o valor PIX;</li>
        <li>Está liberado se juntar com alguém para presentear;</li>
        <li>A marcação é importante para evitar repetições;</li>
        <li>Itens fora da lista, principalmente de decoração, são bem-vindos;</li>
        <li>Cor prioritária: branco | Adaptar de acordo com o item, com prioridade para cores claras (ex: rosa bebê);</li>
        <li>Caso mude de ideia, entre em contato para que eu atualize a lista.</li>
        </ul>
       
      </header>

      {/* Seção PIX - DESTAQUE */}
      <div className="mb-10 bg-white/40 backdrop-blur-sm p-6 rounded-3xl border border-primary/20 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <span className="material-symbols-outlined text-7xl text-primary">payments</span>
        </div>
        
        <div className="relative z-10">
          <h3 className="text-xl font-serif font-bold text-[#2c1810] mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">volunteer_activism</span>
            Presente via PIX
          </h3>
          {/* <p className="text-stone-600 text-sm mb-6 leading-relaxed">
            Se preferir me presentear com qualquer valor, você pode usar a chave PIX abaixo:
          </p> */}
          
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
            backgroundImage: "url('https://i.ibb.co/TDfPLs27/img-story3-1.jpg')",
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
               {selectedRoom === 'bwc' ? 'Banheiro' : selectedRoom === 'cozinha' ? 'Cozinha/Serviço' : selectedRoom === 'suite' ? 'Suíte' : selectedRoom}
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
