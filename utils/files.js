import fs from 'fs'
import path from 'path'

export function createFile(filePath, fileName, data) {
  const resolvedPath = path.resolve(filePath, fileName)
  const dirName = path.dirname(resolvedPath)
  // Check if the directory exists
  if (!fs.existsSync(resolvedPath)) {
    // If not, create the directory and any nested directories that might be needed
    fs.mkdirSync(dirName, { recursive: true })
  }
  fs.writeFileSync(resolvedPath, data)
  console.log(`File created at ${resolvedPath}`)
}

export function injectFile(filePath, fileName, data) {
  const resolvedPath = path.resolve(filePath, fileName)
  const dirName = path.dirname(resolvedPath)
  // Check if the directory exists
  if (!fs.existsSync(resolvedPath)) {
    // If not, create the directory and any nested directories that might be needed
    fs.mkdirSync(dirName, { recursive: true })
  }

  const fileContent = fs.readFileSync(resolvedPath, 'utf-8').split('\n')
  console.log('fileContent :>> ', fileContent)
  data.forEach((d) => {
    fileContent.splice(d.line, 0, d.content)
  });
  console.log('fileContent edited :>> ', fileContent);
  fs.writeFileSync(resolvedPath, fileContent.join('\n'))
  console.log(`File injected at ${resolvedPath} line 7`)
}

