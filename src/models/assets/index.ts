export interface UploadAssetResp {
  file_name: string;
  file_path: string;
  file_ext: string;
}

export function asset(src?: string): string | undefined {
  if (!src?.length) {
    return src
  }

  if (src.startsWith('http')) {
    return src
  }

  return `${import.meta.env.VITE_API_BASE_URL}/assets/${src}`
}