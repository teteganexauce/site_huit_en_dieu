const { JSDOM } = require("jsdom");

const html = `<h4>Notre Mission</h4><p>Accompagner chaque individu dans son cheminement spirituel en offrant des ressources accessibles, des formations enrichissantes et un soutien fraternel au quotidien, afin de bâtir une foi solide et éclairée.</p><h4>Notre Vision</h4><p>Devenir la communauté spirituelle de référence où chacun peut trouver la lumière, la guérison intérieure et les outils nécessaires pour vivre pleinement sa vocation divine dans le monde d'aujourd'hui.</p>`;

const dom = new JSDOM(`<!DOCTYPE html><div>${html}</div>`);
const div = dom.window.document.querySelector("div");

const cards = [];
let currentCard = null;

Array.from(div.children).forEach(el => {
    const text = el.textContent.trim();
    const isHeading = text.length > 0 && (
      el.tagName.match(/^H[1-6]$/) || 
      (el.tagName === 'P' && el.querySelector('strong') && text === el.querySelector('strong').textContent.trim())
    );
                     
    if (isHeading) {
      if (currentCard) cards.push(currentCard);
      currentCard = { title: text, html: '' };
    } else {
      if (!currentCard) {
        currentCard = { title: 'Objectif', html: '' };
      }
      currentCard.html += el.outerHTML;
    }
});
if (currentCard) cards.push(currentCard);

console.log("Mission cards:", JSON.stringify(cards, null, 2));

const htmlValeurs = `<p>Foi & Charité : L'amour du divin et du prochain est au cœur de toutes nos actions et enseignements.</p>
<p>Fraternité : Créer un environnement de soutien où chacun se sent écouté, compris et membre de la famille.</p>
<p>Intégrité : Transmettre les enseignements avec authenticité, fidélité et transparence totale.</p>
<p>Éveil : Guider vers une compréhension profonde de soi et de sa relation avec le Créateur.</p>`;

const dom2 = new JSDOM(`<!DOCTYPE html><div>${htmlValeurs}</div>`);
const div2 = dom2.window.document.querySelector("div");
const blocks = Array.from(div2.querySelectorAll('p, li'))
                      .map(el => el.textContent.trim())
                      .filter(text => text.length > 3);
console.log("Valeurs blocks length:", blocks.length);
