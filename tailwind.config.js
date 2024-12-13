/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
		extend: {
			colors: {
				'-gray': '#292929',
				'-error': '#F17373',
				'-success': '#5AE4BB',
				'base--52': '#525252',
				'base--black': '#121212',
				'base--gray': '#292929',
				'gray-38': '#383838',
				'gray-20': '#202020',
				'gray-40': '#404040',
				'gray-A8': "#A8A8A8",
				'gray-AE': '#AEAEAE',
			},
			fontFamily: {
				iransans: ['var(--font-iransans)'],
				fedra: ['var(--font-fedra)']
			},
			maxWidth: {
				'100vw': '100vw'
			}
		}
	},
  plugins: [
    require('daisyui'),
  ],
}
