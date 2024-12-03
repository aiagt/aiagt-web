import JSONBigInt from 'json-bigint'

export function setLocalStorage(key: string, value: any) {
  if (!value) return

  localStorage.setItem(key, JSON.stringify(value, (_, value) => {
    return typeof value === 'bigint' ? value.toString() : value
  }))
}

export function getLocalStorage<T>(key: string, defaultValue?: T): T | null {
  const value = localStorage.getItem(key)
  if (value) {
    return JSONBigInt({ useNativeBigInt: true }).parse(value)
  }

  return defaultValue || null
}

export function removeLocalStorage(key: string) {
  localStorage.removeItem(key)
}