const main = document.getElementById('main');

export const createGrid = (id, nb) => {
  const grid = document.createElement('div');
  grid.id = id;
  grid.classList.add('grid');

  for (let i = 0; i < nb; i++) {
    const cell = document.createElement('article');
    cell.id = `grid-${id}-${i}`;
    grid.appendChild(cell);
  }

  main.appendChild(grid);

  return grid.children;
};

export const createCanvas = (id, titleContent) => {
  const article = document.createElement('article');
  const canvas = getCanvas(id);
  const title = getTitle(titleContent);

  if (titleContent) main.appendChild(title);
  article.appendChild(canvas);
  main.appendChild(article);

  return canvas;
};

export const createMainCanvas = (id, titleContent, height) => {
  const div = document.createElement('div');
  div.style.height = `${height}vh`;
  const canvas = getCanvas(id);
  const title = getTitle(titleContent);

  if (titleContent) main.appendChild(title);
  div.appendChild(canvas);
  main.appendChild(div);

  return canvas;
};

const getCanvas = (id) => {
  const canvas = document.createElement('canvas');
  canvas.id = id;
  return canvas;
};

const getTitle = (titleContent) => {
  const title = document.createElement('h2');
  title.textContent = titleContent;
  return title;
};
