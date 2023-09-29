export function createFile(filePath, content) {
  const resolvedPath = path.resolve(filePath)
  const dirName = path.dirname(resolvedPath)
  // Check if the directory exists
  if (!fs.existsSync(dirName)) {
    // If not, create the directory and any nested directories that might be needed
    fs.mkdirSync(dirName, { recursive: true })
    // consola.success(`Directory ${dirName} created.`);
  }
  fs.writeFileSync(resolvedPath, content)
  console.log(`File created at ${filePath}`)
}

export async function installPackages(packages, pmType) {
  const packagesListString = packages.regular.concat(' ').concat(packages.dev)
  consola.start(`Installing packages: ${packagesListString}...`)
  const installCommand = pmType === 'npm' ? 'install' : 'add'
  try {
    if (packages.dev) {
      await runCommand(pmType, [installCommand, '-D'].concat(packages.dev.split(' ')))
    }
    if (packages.regular) {
      await runCommand(pmType, [installCommand].concat(packages.regular.split(' ')))
    }
    consola.success(`Packages installed: ${packagesListString}`)
  } catch (error) {
    console.error(`An error occurred: ${error.message}`)
  }
}

export function createFolder(relativePath, log = true) {
  const fullPath = path.join(process.cwd(), relativePath)
  fs.mkdirSync(fullPath, { recursive: true })
  if (log) {
    consola.success(`Folder created at ${fullPath}`)
  }
}

export function replaceFile(filePath, content, log = true) {
  const resolvedPath = path.resolve(filePath)
  const dirName = path.dirname(resolvedPath)
  // Check if the directory exists
  if (!fs.existsSync(dirName)) {
    // If not, create the directory and any nested directories that might be needed
    fs.mkdirSync(dirName, { recursive: true })
    // consola.success(`Directory ${dirName} created.`);
  }
  fs.writeFileSync(resolvedPath, content)
  if (log === true) {
    consola.success(`File replaced at ${filePath}`)
  }
}

export const createConfigFile = (options) => {
  createFile('./kirimase.config.json', JSON.stringify(options, null, 2))
}

export const updateConfigFile = (options) => {
  const config = readConfigFile()
  const newConfig = { ...config, ...options }
  replaceFile('./kirimase.config.json', JSON.stringify(newConfig, null, 2), false)
}

export const readConfigFile = () => {
  // Define the path to package.json
  const configPath = path.join(process.cwd(), 'kirimase.config.json')

  if (!fs.existsSync(configPath)) {
    return null
  }
  // Read package.json
  const configJsonData = fs.readFileSync(configPath, 'utf-8')

  // Parse package.json content
  let config = JSON.parse(configJsonData)

  const rootPath = config.hasSrc ? 'src/' : ''
  return { ...config, rootPath }
}

export const addPackageToConfig = (packageName) => {
  const config = readConfigFile()
  updateConfigFile({ packages: [...config?.packages, packageName] })
}

export const wrapInParenthesis = (string) => {
  return '(' + string + ')'
}

// shadcn specific utils

export const pmInstallCommand = {
  pnpm: 'pnpm',
  npm: 'npx',
  yarn: 'npx',
  bun: 'bunx',
}

export const getFileContents = (filePath) => {
  const fileContents = fs.readFileSync(filePath, 'utf-8')
  return fileContents
}

export const updateConfigFileAfterUpdate = () => {
  const { packages, orm, auth } = readConfigFile()
  if (orm === undefined || auth === undefined) {
    const updatedOrm = packages.includes('drizzle') ? 'drizzle' : null
    const updatedAuth = packages.includes('next-auth') ? 'next-auth' : null
    updateConfigFile({ orm: updatedOrm, auth: updatedAuth })
    consola.info('Config file updated.')
  } else {
    consola.info('Config file already up to date.')
  }
}

export async function installShadcnUIComponents(components) {
  const { preferredPackageManager, hasSrc } = readConfigFile()
  const componentsToInstall = []

  for (const component of components) {
    const tsxFilePath = path.resolve(
      `${hasSrc ? 'src/' : ''}components/ui/${component}.tsx`
    )

    if (!existsSync(tsxFilePath)) {
      componentsToInstall.push(component)
    }
  }
  const baseArgs = ['shadcn-ui@latest', 'add', ...componentsToInstall]
  const installArgs = preferredPackageManager === 'pnpm' ? ['dlx', ...baseArgs] : baseArgs

  if (componentsToInstall.length > 0) {
    consola.start(`Installing shadcn-ui components: ${componentsToInstall.join(', ')}`)
    try {
      await execa(pmInstallCommand[preferredPackageManager], installArgs, {
        stdio: 'inherit',
      })
      consola.success(`Installed components: ${componentsToInstall.join(', ')}`)
    } catch (error) {
      consola.error(`Failed to install components: ${error.message}`)
    }
  } else {
    consola.info('All items already installed.')
  }
}
