export function setLocalStorage(key: string, value: any) {
  if (!value) return

  localStorage.setItem(key, JSON.stringify(value))
}

export function getLocalStorage<T>(key: string, defaultValue?: T): T | null {
  const value = localStorage.getItem(key)
  if (value) {
    return JSON.parse(value)
  }

  return defaultValue || null
}

export function removeLocalStorage(key: string) {
  localStorage.removeItem(key)
}