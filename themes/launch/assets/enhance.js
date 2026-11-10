// enhance.js — progressive enhancement only (cms-spec.md C5).
// Adds a quiet "#" beside each release on the changelog so a teammate can
// paste "the release where we fixed that" into chat. The links work without
// it; this just puts them on the clipboard. Its label comes from the
// template (data-copy-label), so it translates with the rest of the theme.

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
      } catch {
        // Clipboard refused (permissions, insecure origin): the link still works.
      }
    });
    release.closest('.release-item').querySelector('.release-meta').append(button);
  }
}
