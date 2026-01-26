
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
    title: "Começando a Sonhar",
    text: "Eu sempre odiei morar afastada de tudo, ter que levar 2 horas e 30 reais para estudar, trabalhar e sair com os amigos. Durante a pandemia, fiz uma promessa para mim mesma de que quando (na época era um SE) tudo voltasse eu iria morar em Fortaleza. Dito e feito, em 2021 passei como Jovem Aprendiz em uma grande empresa e com menos de um salário mínimo e um sonho aluguei um kitnet no Benfica. Eu amava minha Marechal, mas com o tempo ela não era mais suficiente e, com uma regra de 3 básica, percebi que conseguia sim comprar meu próprio apartamento.",
    imageUrl: "https://i.ibb.co/PJLsLw1/Whats-App-Image-2026-01-25-at-20-39-02.jpg"
  },
  {
    title: "Cada Detalhe Importa",
    text: "Em 2025 eu já ganhava bem mais do que quando me mudei mas ainda não o suficiente para morar em uma cobertura na Beira-Mar. Então vocês podem imaginar que não foi uma busca rápida, fiquei entre a distância do trabalho e a distância da minha família, o que cabia no meu bolso e o que eu não podia abrir mão, a preguiça de subir escada e o quão mais caro era um elevador, conciliar aluguel e parcela ou voltar para o Jabuti. Então, depois de pensar muito, chorar e sonhar, contei com uma corretora incrível para encontrar o lugar perfeito.",
    imageUrl: "https://i.ibb.co/MDCwCFfr/img-story2.jpg"
  },
  {
    title: "Finalmente, Lar",
    text: "A MINHA casa está quase pronta mas eu já me apaixonei por cada cantinho dela, cada atualização que saía, saber que tem uma academia bem em frente para acabar com as minhas desculpas, vários mercadinhos com Coca geladinha, um espetinho de dar água na boca e que vai me poupar muito tempo e dinheiro. Voltar para a minha família nessa espera foi essencial, mas não vejo a hora de ter o meu cantinho de novo. Fico tranquila de estar apenas uma BR de distância do colo da Ena e bem mais próxima de dar voos ainda maiores.",
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
          "E, o próximo capítulo, escreveremos juntos no meu novo lar!"
        </p>
        <BohoButton label="Voltar ao Início" icon="arrow_back" variant="secondary" to="/" className="max-w-[320px] mx-auto" />
      </div>
    </div>
  );
};

export default Trajectory;
