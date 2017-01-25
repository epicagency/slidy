"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.insertAfter = insertAfter;
exports.siblings = siblings;
exports.nextSiblings = nextSiblings;
exports.parents = parents;
exports.offset = offset;
function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function siblings(el) {
  return Array.prototype.filter.call(el.parentNode.children, function (child) {
    return child !== el;
  });
}

function nextSiblings(el) {
  var siblings = [];
  el = el.nextElementSibling;
  while (el) {
    siblings.push(el);
    el = el.nextElementSibling;
  }
  return siblings;
}

function parents(el, className) {
  for (; el && el !== document; el = el.parentNode) {
    if (el.classList.contains(className)) {
      return el;
    }
  }
  return null;
}

function offset(el) {
  return {
    left: el.getBoundingClientRect().left + document.body.scrollLeft,
    top: el.getBoundingClientRect().top + document.body.scrollTop
  };
}