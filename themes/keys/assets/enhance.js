// enhance.js — progressive enhancement only; every page works without it.
// On a property page, the "Email us" button opens a message whose subject is
// already the property's name, so the agent knows which listing it is about.

const title = document.querySelector('.listing h1');
if (title) {
  const subject = encodeURIComponent(title.textContent.trim());
  for (const link of document.querySelectorAll('.inquiry a[href^="mailto:"]')) {
    if (!link.href.includes('?')) link.href += `?subject=${subject}`;
  }
}
