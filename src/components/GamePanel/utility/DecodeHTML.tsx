export const DecodeHTML = (str) =>{
  const parser = new DOMParser();
  const dom = parser.parseFromString(str, 'text/html');
  return dom.documentElement.textContent;
}