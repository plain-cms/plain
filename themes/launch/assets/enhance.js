// Progressive enhancement only (cms-spec.md C5): a quiet "#" beside each
// release on the changelog copies its link. Its label comes from the template
// (data-copy-label), so it translates with the rest of the theme.

const timeline = document.querySelector('.timeline[data-copy-label]');

if (timeline && navigator.clipboard) {
  for (const release of timeline.querySelectorAll('.release-title a')) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'copy-link';
    button.textContent = '#';
    button.setAttribute('aria-label', `${timeline.dataset.copyLabel}: ${release.textContent}`);
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(release.href);
        button.textContent = '✓';
        setTimeout(() => { button.textContent = '#'; }, 1200);
      } catch { /* Clipboard refused: the link still works. */ }
    });
    release.closest('.release-item').querySelector('.release-meta').append(button);
  }
}
