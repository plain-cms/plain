// enhance.js — progressive enhancement only (cms-spec.md C5).
// Without this file every page is complete: code frames have their amber
// edge, language tab, title bar and scrollbar; headings have anchor ids;
// every link works. This adds:
//   1. a copy button in each code frame's bar (space the CSS already reserves)
//   2. keyboard scrolling for code that overflows its frame
//   3. a table of contents on posts with more than three headings
// Its words come from the template (data-* on <body>), so they translate.

const words = document.body.dataset;
const el = (tag, className, text) => {
  const node = document.createElement(tag);
  node.className = className;
  if (text) node.textContent = text;
  return node;
};

// --- 1 + 2. code frames -------------------------------------------------------
for (const code of document.querySelectorAll('.prose pre > code')) {
  const pre = code.parentElement;
  if (code.scrollWidth > code.clientWidth) code.tabIndex = 0;
  if (pre.classList.contains('static') || !navigator.clipboard) continue; // the 404 transcript
  const copy = words.copy || 'copy';
  const button = el('button', 'copy-code', copy);
  button.type = 'button';
  button.setAttribute('aria-live', 'polite');
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(code.textContent);
      button.textContent = words.copied || 'copied';
      setTimeout(() => { button.textContent = copy; }, 1500);
    } catch { /* clipboard refused — the label stays as it was */ }
  });
  pre.append(button);
}

// --- 3. table of contents on longer posts -------------------------------------
const header = document.querySelector('.post .post-header');
const headings = [...document.querySelectorAll('.post .prose :is(h2, h3)[id]')];
if (header && headings.length > 3) {
  const toc = el('nav', 'toc');
  toc.setAttribute('aria-label', words.contents || 'Contents');
  toc.append(el('p', 'toc-title', words.contents || 'Contents'));
  const list = document.createElement('ol');
  for (const heading of headings) {
    const item = el('li', `toc-${heading.tagName.toLowerCase()}`);
    const link = el('a', '', heading.textContent);
    link.href = `#${heading.id}`;
    item.append(link);
    list.append(item);
  }
  toc.append(list);
  header.after(toc);
}
