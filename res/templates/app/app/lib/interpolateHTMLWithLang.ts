// const lang = require("./../../res/lang/ger.json")
const lang = {}

const bracketOpen = "[";
const bracketClose = "]";

function interpolateHTMLWithLang(html: string) {
  let inter = "";

  let openIndex: number;
  let closeIndex: number;
  while (true) {
    openIndex = html.indexOf(bracketOpen);
    closeIndex = html.indexOf(bracketClose);
    if (openIndex !== -1) {
      inter += html.substring(0, openIndex);
      //@ts-ignore
      inter += resolveLang(html.substring(openIndex + 1, closeIndex));
      html = html.substr(closeIndex + 1);
    } else break;
  }

  inter += html;

  return inter;
}


export function resolveLang(key: string) {
  let l = lang
  key.split(".").ea((e) => {
    l = l[e]
    if (l === undefined) {
      console.error("Cannot get key \"" + key + "\" from lang.")
      l = key
      return false
    }
  })
  return l as string
}

export default interpolateHTMLWithLang
