import { handleFile } from '../../utils/files'
import { justNextWithTailwind } from './content'

export default function generateHomePage(projectName, appOptions) {
  if (appOptions.tailwind) {
    let filePath = appOptions.srcDir ? `${projectName}/src/` : `${projectName}/`
    let fileName = ''
    let content = ''
    if (appOptions.app) {
      filePath += 'app/'
      appOptions.typescript ? (fileName = 'page.tsx') : (fileName = 'page.js')
      content = justNextWithTailwind
    } else {
      filePath += 'pages/'
      appOptions.typescript ? (fileName = 'index.tsx') : (fileName = 'index.js')
      // content = justNextWithoutTailwind
    }
    console.log('fileName :>> ', fileName);
    handleFile(filePath, fileName, content)
  }
}
