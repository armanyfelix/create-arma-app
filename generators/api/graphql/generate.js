import pc from 'picocolors'
import spawn from 'cross-spawn'

// Reference: https://medium.com/@ShrianshAgarwal/adding-graphql-to-next-js-13-4-12-project-b3b9f80d848c

export default async function generateGraphQL(packageManager, projectName) {
  const { magenta, bgRed, bgMagenta } = pc
  const args = []

  if (packageManager === 'npm') {
    args.push('install')
  } else {
    args.push('add')
  }
  args.push('graphql')
  args.push('@apollo/client')

  console.log(`\n${bgMagenta(' Running ')} ${packageManager} ${args.join(' ')}\n`)
  const child = spawn.sync(packageManager, args, {
    stdio: 'inherit',
    cwd: `./${projectName}`,
  })

  if (child.status !== 0) {
    console.log(`${bgRed(' Failed ')} Unexpected error installing ${magenta('GraphQL')}`)
  }
}
