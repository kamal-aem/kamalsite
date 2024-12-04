import { createOptimizedPicture } from '../../scripts/aem.js'

async function createCard(data) {
  const card = document.createElement('div');
  card.classList.add('card');

  const div = document.createElement('div');
  div.classList.add('card-image');

  const img = document.createElement('img');
  img.src = `${data.image}`;
  img.alt = data.type || 'Image';
  img.replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]))

  const title = document.createElement('p');
  title.textContent = data.title;

  const description = document.createElement('p');
  description.textContent = data.description || 'No description available';

  div.append(img);
  card.append(div, title, description);
  return card;
}

async function createCardsContainer(jsonURL, limit, offset) {
  const pathname =  `${jsonURL}?limit=${limit}&offset=${offset}`;

  const resp = await fetch(pathname);
  const json = await resp.json();

  const container = document.createElement('div');
  container.classList.add('queryIndex-cards-container');

  for (const item of json.data) {
    const card = await createCard(item);
    container.appendChild(card);
  }

  return container;
}

export default async function decorate(block) {
  const queryIndex = block.querySelector('a[href$=".json"]');
  const parentDiv = document.createElement('div');
  parentDiv.classList.add('queryIndex-block');

  if (queryIndex) {
    const jsonURL = queryIndex.href;
    const cardsContainer = await createCardsContainer(jsonURL, 20, 0);

    parentDiv.append(cardsContainer);
    queryIndex.replaceWith(parentDiv);
  }
}
