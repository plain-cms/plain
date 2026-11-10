// enhance.js — progressive enhancement only (cms-spec.md C5).
// The template engine has no comparisons, so the amber "you are here" marker
// on the contents list (and on the main-menu entry a page sits under) is set
// here by matching pathnames. Without JavaScript the title block — breadcrumb
// plus section number — keeps the reader oriented.

const normalize = (path) => (path.endsWith('/') ? path : path + '/');
const pathOf = (link) => normalize(new URL(link.href).pathname);
const here = normalize(location.pathname);
const root = pathOf(document.querySelector('.site-title'));

for (const link of document.querySelectorAll('.doc-contents a, .masthead nav a')) {
  const path = pathOf(link);
  if (path === here) link.setAttribute('aria-current', 'page');
  else if (path !== root && here.startsWith(path) && link.closest('.masthead')) link.setAttribute('aria-current', 'true');
}
