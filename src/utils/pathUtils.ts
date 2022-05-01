
export function basename (path: string) {
  if (!path) throw new Error('Path is empty')
  const s = path.split(/\/|\\/)
  return s[s.length - 1]
}

export function isHidden (path: string) {
  const b = basename(path)
  if (!b.length) throw new Error(`Path empty or not a valid path: ${path}`)
  return b[0] === '.'
}

export function toSystemSlashes (path: string, os: string | null = null) {
  if (os === null) os = process.platform
  if (os === 'win32') return path.replace(/\//g, '\\')
  return path.replace(/\\/g, '/')
}
