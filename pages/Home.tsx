
import React from 'react';
import BohoButton from '../components/BohoButton';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center animate-fade-in">
      <header className="w-full text-center flex flex-col items-center mb-8">
        <div className="mb-4" style={{ backgroundImage: `url('https://i.ibb.co/LzGdb9Hp/b9067b33984ae88ed69cdb4b04bbb614.jpg')` }}>
          {/* <span className="material-symbols-outlined text-5xl">favorite_sharp</span> text-primary animate-bounce */}
        </div>
        <h1 className="text-[#2c1810] font-serif text-[40px] md:text-[48px] font-bold leading-[1.1] mb-2 tracking-tight">
          Aniversário e 
          <span className="block">Chá de Casa Nova</span>
          <span className="text-primary italic font-normal block mt-1">da Day</span>
        </h1>
        <p className="text-olive text-base md:text-lg font-normal leading-relaxed max-w-[350px] mx-auto opacity-80">
          Com o tempo eu aprendi a amar o meu aniversário e todas as pequenas vitórias da vida, mas não passsei por essa transformação sozinha. Por isso que, com muita felicidade, abro as portas da minha nova casa para receber quem marcou minha história nesses 27 anos.
        </p>
      </header>

      <div className="w-full mb-10 px-2">
        <div className="relative w-full aspect-[4/5] rounded-t-[10rem] rounded-b-2xl overflow-hidden shadow-2xl ring-4 ring-white">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105" 
            style={{ backgroundImage: `url('https://i.ibb.co/sJ9mB4wk/apartamento1.png')` }}
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
