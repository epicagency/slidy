export function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

export function siblings(el) {
  return Array.prototype.filter.call(el.parentNode.children, (child) => {
    return child !== el;
  });
}

export function nextSiblings(el) {
  let siblings = [];
  el = el.nextElementSibling;
  while (el) {
    siblings.push(el);
    el = el.nextElementSibling;
  }
  return siblings;
}

export function parents(el, className) {
  for (; el && el !== document; el = el.parentNode) {
    if (el.classList.contains(className)) {
      return el;
    }
  }
  return null;
}

export function offset(el) {
  return {
    left: el.getBoundingClientRect().left + document.body.scrollLeft,
    top: el.getBoundingClientRect().top + document.body.scrollTop,
  };
}
