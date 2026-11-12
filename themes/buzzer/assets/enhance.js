// enhance.js: progressive enhancement only; every page works without it.
// On a listing's page, the Email push opens a message whose subject is the
// listing's title, so the landlord knows which room it is about.

const title = document.querySelector('.listing h1');
if (title) {
  const subject = encodeURIComponent(title.textContent.trim());
  for (const link of document.querySelectorAll('.door a[href^="mailto:"]')) {
    if (!link.href.includes('?')) link.href += `?subject=${subject}`;
  }
}
