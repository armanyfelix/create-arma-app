import pc from 'picocolors'
import spawn from 'cross-spawn'

// Reference: https://ui.shadcn.com/docs/installation/next

export default async function generateShadcnUI(packageManager, projectName) {
  const { magenta, bgRed, bgMagenta } = pc
  const args = []
  let pm = ''
  switch (packageManager) {
    case 'npm':
      pm = 'npx'
      break
    case 'yarn':
      pm = 'yarn'
      args.push('dlx')
      break
    case 'pnpm':
      pm = 'pnpm'
      args.push('dlx')
      break
    case 'bun':
      pm = 'bunx'
      break
    default:
      pm = 'npx'
      break
  }
  args.push('shadcn-ui@latest')
  args.push('init')

  console.log(`\n${bgMagenta(' Running ')} ${pm} ${args.join(' ')}\n`)
  const child = spawn.sync(pm, args, {
    stdio: 'inherit',
    cwd: `./${projectName}`,
  })

  if (child.status === 0) {
    console.log(`${bgMagenta(' Success ')} Good shit`)
  } else {
    console.log(`${bgRed(' Failed ')} Unexpected error installing ${magenta('ShadcnUI')}`)
  }
}
