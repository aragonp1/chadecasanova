
import React from 'react';
import BohoButton from '../components/BohoButton';

interface StorySection {
  title: string;
  text: string;
  imageUrl: string;
}

const STORY_SECTIONS: StorySection[] = [
  {
    title: "O Início do Sonho",
    text: "Tudo começou com um desejo guardado no coração. A vontade de ter um cantinho para chamar de meu, onde eu pudesse colocar minha personalidade em cada centímetro.",
    imageUrl: "https://picsum.photos/600/800?random=21"
  },
  {
    title: "A Escolha do Lugar",
    text: "Depois de muita procura e muitos 'quase', finalmente encontrei o lugar que me fez sentir em casa no primeiro passo. Sabia que ali construiria memórias inesquecíveis.",
    imageUrl: "https://picsum.photos/600/800?random=22"
  },
  {
    title: "Cada Detalhe Importa",
    text: "A fase das reformas e decoração foi intensa, mas gratificante. Escolher cada cor, cada móvel e cada planta foi como pintar um quadro que eu viveria dentro.",
    imageUrl: "https://picsum.photos/600/800?random=23"
  },
  {
    title: "Finalmente, Lar",
    text: "Hoje abro as portas para compartilhar essa alegria com vocês. Mais do que paredes, este é o lugar onde o amor e a amizade sempre terão assento à mesa.",
    imageUrl: "https://picsum.photos/600/800?random=24"
  }
];

const Trajectory: React.FC = () => {
  return (
    <div className="animate-fade-in pb-12">
      <header className="text-center mb-12">
        <div className="mb-4 text-primary">
          <span className="material-symbols-outlined text-6xl">auto_stories</span>
        </div>
        <h2 className="text-4xl font-serif font-bold text-[#2c1810] mb-2 tracking-tight">Minha Trajetória</h2>
        <p className="text-olive font-medium italic">Um sonho que se tornou realidade</p>
      </header>

      <div className="relative max-w-md mx-auto">
        {/* Vertical Timeline Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-primary/20 top-0"></div>

        <div className="space-y-16">
          {STORY_SECTIONS.map((section, index) => (
            <div key={index} className="relative flex flex-col items-center">
              {/* Dot on timeline */}
              <div className="absolute left-1/2 transform -translate-x-1/2 -top-4 w-4 h-4 rounded-full bg-primary shadow-lg border-4 border-white z-20"></div>

              {/* Text Card */}
              <div className="w-full bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-stone-200 shadow-sm mb-6 mt-4 relative z-10 transition-transform hover:-translate-y-1">
                <h3 className="font-serif text-2xl font-bold text-primary mb-3 text-center">{section.title}</h3>
                <p className="text-stone-700 text-sm leading-relaxed text-center italic">
                  "{section.text}"
                </p>
              </div>

              {/* Image with Arch Mask */}
              <div className="w-full px-4 mb-4">
                <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-xl ring-4 ring-white/50">
                  <img 
                    src={section.imageUrl} 
                    alt={section.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 text-center px-4">
        <p className="font-serif text-2xl text-[#2c1810] italic mb-8">
          "E o próximo capítulo escrevemos juntos, no meu novo lar!"
        </p>
        <BohoButton label="Voltar ao Início" icon="arrow_back" variant="secondary" to="/" className="max-w-[320px] mx-auto" />
      </div>
    </div>
  );
};

export default Trajectory;
