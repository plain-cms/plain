// Progressive enhancement only: every page is complete without it.
// On a listing's page, an e-mail link opens a message whose subject is the
// listing's title, so the agent knows at once which lot it is about.
const title = document.querySelector('.listing h1');
if (title) {
  const subject = encodeURIComponent(title.textContent.trim());
  for (const link of document.querySelectorAll('.inquiry a[href^="mailto:"]')) {
    if (!link.href.includes('?')) link.href += `?subject=${subject}`;
  }
}
