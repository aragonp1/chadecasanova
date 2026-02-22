
import React from 'react';
import BohoButton from '../components/BohoButton';

const Location: React.FC = () => {
  const address = "Rua Ceará, 604 - Pan-Americano";
  const address2 = "Fortaleza - CE, 60441-570"
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <div className="animate-fade-in flex flex-col items-center text-center">
      <header className="mb-8">
        <div className="mb-4 text-primary">
          <span className="material-symbols-outlined text-6xl">location_on</span>
        </div>
        <h2 className="text-3xl font-serif font-bold text-[#2c1810] mb-2">Informações do Evento</h2>
        <p className="text-olive font-medium">Juro que não é em Itaitinga 😁</p>
      </header>

      <div className="w-full bg-white/40 backdrop-blur-sm p-8 rounded-3xl border border-stone-200 shadow-xl mb-10 text-left">
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <span className="material-symbols-outlined text-primary mt-1">home</span>
            <div>
              <h4 className="font-bold text-[#2c1810]">Endereço</h4>
              <p className="text-stone-600">{address}</p>
              <p className="text-stone-600">{address2}</p>
            
            </div>
          </div>

          <div className="flex items-start gap-4">
            <span className="material-symbols-outlined text-primary mt-1">calendar_month</span>
            <div>
              <h4 className="font-bold text-[#2c1810]">Data</h4>
              <p className="text-stone-600">Sábado, 14 de Março às 15:00h</p>
            </div>
          </div>

        </div>

        

        <div className="mt-8 h-48 rounded-xl bg-stone-100 overflow-hidden relative group">
           <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3981.2277448372893!2d-38.5630126!3d-3.7605394999999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7c749515a4f901b%3A0x69d16970196cb052!2sR.%20Ceará%2C%20604%20-%20Pan-Americano%2C%20Fortaleza%20-%20CE%2C%2060441-570!5e0!3m2!1spt-BR!2sbr!4v1771720960924!5m2!1spt-BR!2sbr" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            loading="lazy"
          ></iframe>
          <div className="absolute inset-0 bg-black/5 pointer-events-none transition-opacity group-hover:opacity-0"></div>
        </div>
      </div>

      <div className="w-full max-w-[320px] space-y-4">
        <a 
          href={mapsUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center justify-center w-full h-14 bg-primary text-white rounded-xl shadow-lg hover:shadow-primary/40 transition-all font-bold"
        >
          <span className="material-symbols-outlined mr-3">directions</span>
          Ver no Google Maps
        </a>
        <BohoButton label="Voltar" icon="arrow_back" variant="secondary" to="/" />
      </div>
    </div>
  );
};

export default Location;
