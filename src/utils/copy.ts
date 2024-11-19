export function clipboardCopy(text: string) {
  const el = document.createElement('textarea')
  el.value = text
  el.setAttribute('readonly', '')
  document.body.appendChild(el)
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
}