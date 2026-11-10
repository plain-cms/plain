// enhance.js — progressive enhancement only (cms-spec.md C5).
// The site is fully readable and navigable without this file.

// Add a "Copy" button to every code block. Its two labels are theme strings,
// carried on <body> as data attributes so they translate with the page.
const { copy, copied } = document.body.dataset;
if (navigator.clipboard && copy) {
  for (const code of document.querySelectorAll('pre > code')) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'copy-code';
    button.textContent = copy;
    button.setAttribute('aria-live', 'polite');
    button.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(code.textContent); } catch { return; } // permission denied: say nothing false
      button.textContent = copied || copy;
      setTimeout(() => { button.textContent = copy; }, 1500);
    });
    code.parentElement.append(button);
  }
}
