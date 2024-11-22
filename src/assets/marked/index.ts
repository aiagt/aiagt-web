import { marked } from 'marked'
import './marked.css'

export function mark(src: string): string | Promise<string> {
  const markedHTML = marked(src)

  if (typeof markedHTML === 'string') {
    const parser = new DOMParser()
    const markedDoc = parser.parseFromString(markedHTML, 'text/html')

    renderCodeHook(markedDoc)

    return markedDoc.documentElement.outerHTML
  }

  return markedHTML
}

function renderCodeHook(doc: Document) {
  doc.querySelectorAll<HTMLElement>('pre code').forEach((element) => {
    let className = Array.from(element.classList).find((cls) => cls.startsWith('language-'))

    if (!className) className = 'language-text'

    const language = className.replace('language-', '')
    element.setAttribute('data-language', language)

    const parentNode = element.parentNode

    const languageHeader = document.createElement('div')
    languageHeader.setAttribute('data-language', language)
    languageHeader.textContent = `${language}`
    languageHeader.classList.add('code-language')
    parentNode?.append(languageHeader)

    const codeBox = document.createElement('div')
    codeBox.append(element)
    codeBox.classList.add('code-box')
    parentNode?.append(codeBox)
  })
}