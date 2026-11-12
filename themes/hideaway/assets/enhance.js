// Progressive enhancement only: every page is complete without this file.
// On a cottage's page, the e-mail link opens a message whose subject is the
// cottage's name, so the owner knows at once which place it is about.
const title = document.querySelector('.stay h1');
if (title) {
  const subject = encodeURIComponent(title.textContent.trim());
  for (const link of document.querySelectorAll('.inquiry a[href^="mailto:"]')) {
    if (!link.href.includes('?')) link.href += `?subject=${subject}`;
  }
}
