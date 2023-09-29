export function createFolder(relativePath, log = true) {
  const fullPath = path.join(process.cwd(), relativePath)
  fs.mkdirSync(fullPath, { recursive: true })
  if (log) {
    consola.success(`Folder created at ${fullPath}`)
  }
}
