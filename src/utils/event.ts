export function isEnterEvent(e?: Event): boolean {
  if (!e) return false

  const event = e as KeyboardEvent

  if (
    !event.isComposing
    && !event.shiftKey
    && !event.ctrlKey
    && !event.altKey
  ) {
    event.preventDefault()
    return true
  }

  return false
}

export function onEnter(e: Event | undefined, f: () => void) {
  if (isEnterEvent(e)) f()
}