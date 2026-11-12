// enhance.js — progressive enhancement only (cms-spec.md C5): sizes titles,
// the headline and prices by length. A step: [name, most characters, longest word].
const SLEEVE = [['short', 26, 8], ['mid', 40, 9]];
const HEADLINE = [['short', 24, 7], ['mid', 44, 8], ['easy', 60, 10]];
for (const title of document.querySelectorAll('.sleeve-title, .gatefold h1')) {
  const sleeve = title.classList.contains('sleeve-title');
  const text = title.textContent.trim();
  const longest = Math.max(...text.split(/[\s-]+/).map((word) => word.length));
  const step = (sleeve ? SLEEVE : HEADLINE).find(([, chars, word]) => text.length <= chars && longest <= word);
  if (step) title.dataset.len = step[0];
  else if (text.length > 52 || longest > 13) title.dataset.len = 'long';

  // "Kind of Blue, Miles Davis": the name after the comma is set light
  const holder = title.querySelector('a') || title;
  const comma = text.indexOf(', ');
  if (sleeve && comma > 0 && holder.childNodes.length === 1) {
    const by = document.createElement('span');
    by.className = 'by';
    by.textContent = text.slice(comma + 2);
    holder.textContent = text.slice(0, comma + 2);
    holder.append(by);
  }
}
for (const print of document.querySelectorAll('.price, .unit')) {
  const length = print.textContent.trim().length;
  const unit = print.classList.contains('unit');
  if (length > (unit ? 16 : 9)) print.dataset.len = 'long';
  else if (length <= 6 && !unit) print.dataset.len = 'short';
}
