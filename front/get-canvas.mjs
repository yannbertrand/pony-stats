const main = document.getElementById('main');

export const createCanvas = (id) => {
  const canvas = document.createElement('canvas');
  canvas.id = id;
  main.appendChild(canvas);
  return canvas;
};
