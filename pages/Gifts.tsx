
import React, { useState } from 'react';
import BohoButton from '../components/BohoButton';
import { GiftItem } from '../types';

const GIFT_IDEAS: Partial<GiftItem>[] = [
  { id: '1', name: 'Air Fryer AFON-12L-BI', imageUrl: 'https://m.media-amazon.com/images/I/51G4AxVAJxL._AC_SX679_.jpg' },
  { id: '2', name: 'Cooktop por Indução', imageUrl: 'https://m.media-amazon.com/images/I/61YqJJSdbKL._AC_SX679_.jpg' },
  { id: '3', name: 'Jogo com 8 Panelas Antiaderentes', imageUrl: 'https://m.media-amazon.com/images/I/51lEScBIRDL._AC_SX679_.jpg' },
];

const Gifts: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const pixKey = "4074dd6d-9faa-4e8d-b944-bfb6a47277ba"; 
  const amazonWishlistUrl = "https://www.amazon.com.br/hz/wishlist/ls";

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in">
      <header className="text-center mb-10">
        <div className="mb-4 text-primary">
          <span className="material-symbols-outlined text-6xl">redeem</span>
        </div>
        <h2 className="text-3xl font-serif font-bold text-[#2c1810] mb-2">Mimos e Desejos</h2>
        <p className="text-stone-500">Sua presença é o nosso maior presente, mas se quiser me mimar, aqui estão algumas formas:</p>
      </header>

      {/* PIX Section */}
      <section className="mb-10 bg-white/40 backdrop-blur-sm p-8 rounded-3xl border border-primary/20 shadow-xl text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <span className="material-symbols-outlined text-primary text-3xl">payments</span>
          </div>
        </div>
        <h3 className="font-serif text-2xl font-bold text-[#2c1810] mb-2">Presente via PIX</h3>
        <p className="text-sm text-stone-600 mb-6">Se preferir me presentear com qualquer valor, você pode usar a chave PIX abaixo:</p>
        
        <div className="relative group">
          <div className="bg-[#f2efe9] p-4 rounded-xl border-2 border-dashed border-primary/30 font-mono text-sm break-all text-stone-700 mb-4 select-all">
            {pixKey}
          </div>
          <button 
            onClick={handleCopyPix}
            className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold transition-all ${
              copied ? 'bg-olive text-white' : 'bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/20'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {copied ? 'check_circle' : 'content_copy'}
            </span>
            {copied ? 'Chave Copiada!' : 'Copiar Chave PIX'}
          </button>
        </div>
      </section>

      {/* Amazon Wishlist Link */}
      <section className="mb-10">
        <a 
          href={amazonWishlistUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center justify-center w-full p-8 bg-[#232f3e] text-white rounded-3xl shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          <div className="flex items-center gap-3 mb-2">
            <svg className="w-8 h-8 fill-current text-[#ff9900]" viewBox="0 0 24 24">
              <path d="M15.012 4.255c-.134-.148-.328-.242-.544-.242H9.532c-.216 0-.41.094-.544.242L5.432 8.167c-.085.093-.133.215-.133.342v11.236c0 .273.222.495.495.495h12.412c.273 0 .495-.222.495-.495V8.509c0-.127-.048-.249-.133-.342l-3.556-3.912zM9.532 5.013h4.936l2.715 2.986H6.817l2.715-2.986zM6.299 19.25V9h11.402v10.25H6.299z"/>
            </svg>
            <span className="text-xl font-bold">Lista de Desejos Amazon</span>
          </div>
          <p className="text-stone-300 text-sm italic group-hover:text-white transition-colors">Clique aqui para ver nossa lista completa</p>
        </a>
      </section>

      {/* Gift Ideas List */}
      <section className="mb-10">
        <h3 className="font-serif text-2xl font-bold text-[#2c1810] mb-6 text-center">Sugestões e Ideias</h3>
        <div className="grid grid-cols-1 gap-4">
          {GIFT_IDEAS.map(gift => (
            <div key={gift.id} className="bg-white/40 rounded-2xl p-4 border border-stone-200 flex items-center gap-4 transition-all hover:shadow-md">
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                <img src={gift.imageUrl} alt={gift.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow">
                <h4 className="text-[#2c1810] font-bold text-base leading-tight">{gift.name}</h4>
                
              </div>
            </div>
          ))}
        </div>
      </section>

      

      <BohoButton label="Voltar ao Início" icon="arrow_back" variant="secondary" to="/" />
    </div>
  );
};

export default Gifts;
