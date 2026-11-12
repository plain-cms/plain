// Progressive enhancement only: every page is complete without it.
// On a listing's page the e-mail link opens a message whose subject is
// already the listing's title, so the sales team knows which plot it is.

const title = document.querySelector('.plot h1');
if (title) {
  const subject = encodeURIComponent(title.textContent.trim());
  for (const link of document.querySelectorAll('.ask a[href^="mailto:"]')) {
    if (!link.href.includes('?')) link.href += `?subject=${subject}`;
  }
}
