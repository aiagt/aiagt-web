export function parseLabels(value: any): {
  label_ids: BigInt[];
  label_texts: string[];
} {
  if (!value) return { label_ids: [], label_texts: [] }
  const labels = value as (BigInt | string)[]
  const label_ids: BigInt[] = []
  const label_texts: string[] = []

  for (const label of labels) {
    switch (typeof label) {
      case 'string':
        label_texts.push(label)
        break
      case 'bigint':
        label_ids.push(label)
        break
    }
  }

  return { label_ids, label_texts }
}