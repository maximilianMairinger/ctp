


function findFirstChar(s: string) {
  for (let i = 0; i < s.length; i++) {
    if (s[i] !== " ") {
      return i
    }
  }
  return 0
}

function revString(s: string) {
  let rev = ""
  for (const k of s) {
    rev = k + rev
  }
  return rev
}

function stripSpaceFromLeftAndRight(s: string) {
  let begin = findFirstChar(s)
  let rev = revString(s)
  let end = s.length - findFirstChar(rev)
  return s.substring(begin, end)
}

function spliceString(str: string, index: number, count: number, add: string) {
  if (index < 0) {
    index = str.length + index;
    if (index < 0) {
      index = 0;
    }
  }

  return str.slice(0, index) + (add || "") + str.slice(index + count);
}


const openCharSeq = "${"
const closeCharSeq = "}"
const escapeCharSeq = "$"


export default function interpolate (source: string, replaceIndex: {[key in string]: string}) {
  let res = source
  let a = 0

  while (true) {
    let localStart = source.indexOf(openCharSeq)
    let start = localStart + a

    if (localStart === -1) break
    if (source[localStart-1] === escapeCharSeq) {
      res = spliceString(res, start, 1, "")
      source = source.substr(localStart + 1)
      a = start
      continue
    }
    let localEnd = localStart + source.substr(localStart).indexOf(closeCharSeq) + 1
    if (localEnd === -1) break
    let end = localEnd + a
    let inner = source.substring(localStart + openCharSeq.length, localEnd - closeCharSeq.length)
    let key = stripSpaceFromLeftAndRight(inner)
    let insert = replaceIndex[key] === undefined ? key : replaceIndex[key]
    let omit = end - start
    res = spliceString(res, start, omit, insert)
    

    source = source.substring(localEnd)

    a = end - (omit - insert.length)

  }

  return res
}
