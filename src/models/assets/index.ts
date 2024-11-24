export interface UploadAssetResp {
  file_name: string;
  file_path: string;
}

export function asset(src?: string): string | undefined {
  if (!src) {
    return undefined
  }

  if (src.startsWith('http')) {
    return src
  }

  return `${import.meta.env.VITE_API_BASE_URL}/assets/${src}`
}