
import React from 'react';
import BohoButton from '../components/BohoButton';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center animate-fade-in">
      <header className="w-full text-center flex flex-col items-center mb-8">
        <div className="mb-4 text-primary animate-bounce">
          <span className="material-symbols-outlined text-5xl">potted_plant</span>
        </div>
        <h1 className="text-[#2c1810] font-serif text-[40px] md:text-[48px] font-bold leading-[1.1] mb-2 tracking-tight">
          Chá de Casa Nova<br/>
          <span className="text-primary italic font-normal block mt-1">da Dayane</span>
        </h1>
        <p className="text-olive text-base md:text-lg font-normal leading-relaxed max-w-[300px] mx-auto opacity-80">
          Celebrando o amor em cada detalhe do nosso novo lar.
        </p>
      </header>

      <div className="w-full mb-10 px-2">
        <div className="relative w-full aspect-[4/5] rounded-t-[10rem] rounded-b-2xl overflow-hidden shadow-2xl ring-4 ring-white">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105" 
            style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBgwV6o23u-HNvNqxux-gLYiB3surG5PTYPEsV9r2JHiJaTN3muSNQXSbjZlUpoeygnes6kr5jGjW3Np0pmHLIW-hv67Z2zbDFB1NsS6mpeR1qZZq_IGkecDlx9Q6J3uDoE24l_q9Nyp5rwzi1l_6U_2YMLN2KlpGks1hlc8UI9_31gq06Mi_W-eBKIzDl4JJowynQYZd5RDweGWsuCxCtIyuMyvGY5Zf-RQMk44icCnWjPAHOlAe8XeJg1r6XY8liLMnYryAxu1Yw')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        </div>
      </div>

      <div className="w-full flex flex-col gap-5 items-stretch max-w-[320px] mx-auto">
        <BohoButton 
          label="Minha Trajetória" 
          icon="auto_stories" 
          to="/trajetoria" 
        />
        <BohoButton 
          label="Confirmação de Presença" 
          icon="check_circle" 
          variant="primary" 
          to="/rsvp" 
        />
        <BohoButton 
          label="Local do Evento" 
          icon="location_on" 
          to="/local" 
        />
        <BohoButton 
          label="Lista de Presentes" 
          icon="redeem" 
          to="/presentes" 
        />
      </div>

      <div className="mt-14 text-center">
        <h3 className="font-serif text-3xl text-[#2c1810] font-medium italic">Com carinho, Dayane</h3>
        <div className="mt-5 flex justify-center gap-3">
          <span className="block w-2 h-2 rounded-full bg-primary/30 animate-pulse"></span>
          <span className="block w-2 h-2 rounded-full bg-primary animate-pulse [animation-delay:200ms]"></span>
          <span className="block w-2 h-2 rounded-full bg-primary/30 animate-pulse [animation-delay:400ms]"></span>
        </div>
      </div>
    </div>
  );
};

export default Home;
