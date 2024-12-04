import { marked } from 'marked'
import './marked.css'
import { clipboardCopy } from '@/utils/copy.ts'
import { Message } from '@arco-design/web-vue'

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

    const copyIcon = document.createElement('div')
    copyIcon.innerHTML = '<svg t="1733316989720" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3095" width="14" height="14"><path d="M792.64 96h-320a136.96 136.96 0 0 0-136.96 136.96v103.04H231.36A136.96 136.96 0 0 0 96 471.36v320a136.96 136.96 0 0 0 136.96 136.96h320a136.96 136.96 0 0 0 136.96-136.96v-101.76h103.04a136.96 136.96 0 0 0 136.96-136.96v-320A136.96 136.96 0 0 0 792.64 96zM608 792.64a53.76 53.76 0 0 1-53.76 53.76h-320a53.76 53.76 0 0 1-53.76-53.76v-320a53.76 53.76 0 0 1 53.76-53.76h320A53.76 53.76 0 0 1 608 471.36z m240-240A53.76 53.76 0 0 1 792.64 608h-103.04v-136.64a136.96 136.96 0 0 0-136.96-136.96h-135.04V231.36a53.76 53.76 0 0 1 53.76-53.76h320a53.76 53.76 0 0 1 53.76 53.76z" p-id="3096" fill="#394150"></path></svg>'
    copyIcon.style.cursor = 'pointer'
    copyIcon.className = 'code-copy'
    copyIcon.setAttribute('code-content', element.textContent || '')

    const languageHeader = document.createElement('div')
    languageHeader.setAttribute('data-language', language)
    languageHeader.textContent = `${language}`
    languageHeader.classList.add('code-language')
    languageHeader.appendChild(copyIcon)
    parentNode?.append(languageHeader)

    const codeBox = document.createElement('div')
    codeBox.append(element)
    codeBox.classList.add('code-box')
    parentNode?.append(codeBox)
  })
}

export function onClickMarked(event: Event) {
  const target = event.target as HTMLElement

  const btnCodeCopy = target.closest('.code-copy')
  if (btnCodeCopy) {
    const code = btnCodeCopy?.getAttribute('code-content')
    clipboardCopy(code || '')
    Message.success('Copied to clipboard')
  }
}