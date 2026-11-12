// Roughs: on a project page, go over the spread you are reading in the small
// dummy sheet below it. The sheet is complete without this.
const here = location.pathname.replace(/index\.html$/, '');
for (const link of document.querySelectorAll('.sheet-mini a')) {
  if (link.pathname.replace(/index\.html$/, '') === here) link.setAttribute('aria-current', 'page');
}
