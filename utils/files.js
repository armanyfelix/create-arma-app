import fs from 'fs'
import path from 'path'

export function handleFile(filePath, fileName, content) {
  const resolvedPath = path.resolve(filePath, fileName)
  const dirName = path.dirname(resolvedPath)
  if (!fs.existsSync(resolvedPath)) {
    fs.mkdirSync(dirName, { recursive: true })
  }
  fs.writeFileSync(resolvedPath, content)
  console.log(`File generated at ${resolvedPath}`)
}

export function injectFile(filePath, fileName, data) {
  const resolvedPath = path.resolve(filePath, fileName)
  const dirName = path.dirname(resolvedPath)
  // Check if the directory exists
  if (!fs.existsSync(resolvedPath)) {
    // If not, create the directory and any nested directories that might be needed
    fs.mkdirSync(dirName, { recursive: true })
    console.log(`Directory created at ${resolvedPath}`)
  }
  const fileContent = fs.readFileSync(resolvedPath, 'utf-8').split('\n')
  data.forEach((d) => {
    fileContent.splice(d.line - 1, d.replace, d.content)
    console.log(`File injected at line ${d.line} in ${resolvedPath}`)
  })
  fs.writeFileSync(resolvedPath, fileContent.join('\n'))
}
