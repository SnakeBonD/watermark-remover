import { removeWatermarkFromImageDataSync } from './vendor/gemini-watermark-remover/src/sdk/image-data.js';

const MAX = 25 * 1024 * 1024;
const $ = (selector) => document.querySelector(selector);
const e = {
  drop: $('#dropZone'), input: $('#fileInput'), editor: $('#editor'),
  original: $('#originalImage'), canvas: $('#resultCanvas'), name: $('#fileName'),
  meta: $('#fileMeta'), status: $('#status'), process: $('#processBtn'),
  download: $('#downloadBtn'), newFile: $('#newFile'), range: $('#compareRange'),
  layer: $('#resultLayer'), divider: $('#divider')
};
let file;
let url;

function msg(text, className = '') {
  e.status.textContent = text;
  e.status.className = className;
}

function reset() {
  if (url) URL.revokeObjectURL(url);
  file = url = null;
  e.input.value = '';
  e.editor.hidden = true;
  e.drop.hidden = false;
  e.download.disabled = true;
  msg('Image prête. Lancez l’analyse locale.');
}

async function load(nextFile) {
  if (!nextFile) return;
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(nextFile.type)) {
    alert('Choisissez un fichier PNG, JPG ou WebP.');
    return;
  }
  if (nextFile.size > MAX) {
    alert('Cette image dépasse 25 Mo.');
    return;
  }
  reset();
  file = nextFile;
  url = URL.createObjectURL(nextFile);
  e.original.src = url;
  await e.original.decode();
  e.canvas.width = e.original.naturalWidth;
  e.canvas.height = e.original.naturalHeight;
  e.canvas.getContext('2d').drawImage(e.original, 0, 0);
  e.name.textContent = nextFile.name;
  e.meta.textContent = `${e.canvas.width} × ${e.canvas.height} px · ${(nextFile.size / 1048576).toFixed(2)} Mo`;
  e.drop.hidden = true;
  e.editor.hidden = false;
}

function restore(ctx, width, height) {
  const input = ctx.getImageData(0, 0, width, height);
  const result = removeWatermarkFromImageDataSync(input);
  if (!result?.meta?.applied) return null;
  ctx.putImageData(result.imageData, 0, 0);
  return result.meta;
}

async function process() {
  e.process.disabled = true;
  e.download.disabled = true;
  msg('Analyse locale avec le moteur Gemini éprouvé…');
  await new Promise((resolve) => setTimeout(resolve, 50));
  const ctx = e.canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(e.original, 0, 0);
  const result = restore(ctx, e.canvas.width, e.canvas.height);
  if (!result) {
    msg('Aucune marque Gemini compatible reconnue. L’original reste intact.', 'error');
    ctx.drawImage(e.original, 0, 0);
  } else {
    const size = result.config?.logoSize;
    const detail = size ? ` · masque ${size} px` : '';
    msg(`Marque restaurée localement${detail}. Vérifiez le résultat.`, 'success');
    e.download.disabled = false;
  }
  e.process.disabled = false;
}

e.drop.onclick = () => e.input.click();
e.drop.onkeydown = (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    e.input.click();
  }
};
e.input.onchange = () => load(e.input.files[0]);
['dragenter', 'dragover'].forEach((type) => e.drop.addEventListener(type, (event) => {
  event.preventDefault();
  e.drop.classList.add('drag');
}));
['dragleave', 'drop'].forEach((type) => e.drop.addEventListener(type, (event) => {
  event.preventDefault();
  e.drop.classList.remove('drag');
}));
e.drop.ondrop = (event) => load(event.dataTransfer.files[0]);
e.newFile.onclick = reset;
e.process.onclick = process;
e.range.oninput = () => {
  e.layer.style.clipPath = `inset(0 0 0 ${e.range.value}%)`;
  e.divider.style.left = `${e.range.value}%`;
};
e.download.onclick = () => e.canvas.toBlob((blob) => {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = file.name.replace(/\.[^.]+$/, '') + '-clean.png';
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}, 'image/png');
