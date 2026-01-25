
import React from 'react';
import BohoButton from '../components/BohoButton';

interface StorySection {
  title: string;
  text: string;
  imageUrl: string;
}

const STORY_SECTIONS: StorySection[] = [
  {
    title: "O Início de Tudo",
    text: "Em 1999, na cidade de Itaitinga, nascia Maria Dayane de Sousa Gomes. A mais velha dos 5 irmãos, criada pelos avós e pela madrinha desde os 4 anos, 2 anos adiantada na escola, nerd de carteirinha e igualmente tímida e exibida. Depois de muitas personalidades, vidas, amores, crises, aventuras, dívidas, mais experiências do que o esperado mas, definitivamente, menos do que eu ainda quero viver, hoje eu completo 27 anos. Além de celebrar todos os finais que não aconteceram, estou celebrando uma conquista que jamais imaginei ser capaz, o famoso sonho da casa própria. Vem comigo que vou te contar um pouquinho desse processo.",
    imageUrl: "https://i.ibb.co/7xCYVTL8/Whats-App-Image-2026-01-25-at-20-32-06.jpg"
  },
  {
    title: "O Início do Sonho",
    text: "Tudo começou quando eu deixei Itaitinga para encarar o desafio da faculdade em Fortaleza. Vivi o clichê de morar de aluguel no Benfica: uma fase de descobertas, mas também de muita saudade de casa. Foi ali, entre uma aula e outra, que nasceu uma promessa para mim mesma: um dia, eu teria um lugar que fosse inteiramente meu.",
    imageUrl: "https://i.ibb.co/PJLsLw1/Whats-App-Image-2026-01-25-at-20-39-02.jpg"
  },
  {
    title: "A Escolha do Lugar",
    text: "Não foi uma busca rápida. Eu queria o melhor dos dois mundos: estar perto da rotina do meu trabalho atual, mas sem ficar longe do colo da minha família em Itaitinga. Eu procurava um lugar que não fosse apenas um endereço, mas que fizesse sentido para a vida que eu queria construir.",
    imageUrl: "https://i.ibb.co/MDCwCFfr/img-story2.jpg"
  },
  {
    title: "Cada Detalhe Importa",
    text: "Quem me conhece sabe que eu presto atenção em tudo! Tinha que ter academia por perto para manter o ritmo e um mercadinho para facilitar o dia a dia. Mas confesso: o que me ganhou de verdade foi descobrir que tinha um restaurante com o meu espetinho favorito logo ali do lado. 😂 Afinal, a felicidade mora nos detalhes (e no espetinho bem feito!).",
    imageUrl: "https://i.ibb.co/sJ93Mhy7/img-story3.jpg"
  },
  {
    title: "Finalmente, Lar",
    text: "Hoje, eu não abro mais uma porta que é emprestada. Eu abro a porta da minha conquista. Olhar para esse apartamento e saber que cada pedacinho dele representa o meu esforço é a sensação mais gratificante do mundo.",
    imageUrl: "https://i.ibb.co/PGSgr7gf/img-story4.jpg"
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
                <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden shadow-xl ring-4 ring-white/50">
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
