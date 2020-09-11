export const getAttribute = (el, attr) => el.getAttribute(attr);
export const getNodeText = (el, n) => el.childNodes[n || 0]?.nodeValue?.trim();
export const getInnerHTML = (el) => el.innerHTML;
