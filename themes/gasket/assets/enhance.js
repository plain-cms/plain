// enhance.js — progressive enhancement only; every page is complete without it.

// A number plate has a gap between its groups, not a dash. The phone number is
// written with hyphens, which keep the tel: link dialable, so each hyphen is
// wrapped in a span that theme.css blanks: still in the text for copying and
// for screen readers, still a place to break a long number, no longer drawn.
for (const el of document.querySelectorAll('.plate-full[href^="tel:"] strong, a[href^="tel:"]:not(.plate)')) {
  const groups = el.textContent.trim().split('-');
  if (groups.length < 2 || !/^\+?\d+$/.test(groups.join(''))) continue;
  el.replaceChildren(...groups.flatMap((group, i) => {
    if (!i) return [group];
    const gap = document.createElement('span');
    gap.className = 'gap';
    gap.textContent = '-';
    return [gap, group];
  }));
}

// An e-mail address on the big plate breaks before "@" or a dot when it has to
// break, not in the middle of a word.
for (const el of document.querySelectorAll('.plate-mail strong')) {
  const parts = el.textContent.trim().split(/(?=[@.])/);
  el.replaceChildren(...parts.flatMap((part, i) => (i ? [document.createElement('wbr'), part] : [part])));
}

// A bare address in page text is already its own link text: mark it so the
// print stylesheet does not print the address a second time after it.
for (const a of document.querySelectorAll('.prose a[href^="http"]')) {
  if (a.textContent.trim() === a.getAttribute('href')) a.classList.add('bare');
}
