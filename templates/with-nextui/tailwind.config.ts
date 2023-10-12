import { nextui } from '@nextui-org/react'
import type { Config } from 'tailwindcss'
const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'radial-gradient-dark':
          'radial-gradient(circle, rgba(2,0,36,1) 0%, rgba(8,8,92,1) 80%, rgba(9,9,121,1) 100%)',
      },
      keyframes: {},
    },
  },
  plugins: [nextui()],
}
export default config
