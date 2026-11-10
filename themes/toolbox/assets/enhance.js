// enhance.js — progressive enhancement only (cms-spec.md C5).
// The site is fully readable and navigable without this file.

// Before/after pairs: a paragraph in the page text that holds exactly two
// images and nothing else (in Markdown: two images on one line) becomes a
// side-by-side pair, each captioned with its own alt text, e.g.
// "Before: the corroded trap" and "After: new trap and isolating valve".
// Without JS the images simply stack. Nothing is lost.
for (const p of document.querySelectorAll('.prose p')) {
  const imgs = [...p.children];
  if (imgs.length !== 2 || p.textContent.trim() || !imgs.every((el) => el.tagName === 'IMG')) continue;
  p.classList.add('before-after');
  for (const img of imgs) {
    const figure = document.createElement('figure');
    img.replaceWith(figure);
    figure.append(img);
    if (!img.alt) continue;
    const caption = document.createElement('figcaption');
    caption.textContent = img.alt;
    figure.append(caption);
  }
}
