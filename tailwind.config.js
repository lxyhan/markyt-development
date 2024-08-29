/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {}
	},
	daisyui: {
		themes: [
			{
				mytheme: {
					primary: '#0A7E6A', // Dark green color
					secondary: '#52AF7A', // Lighter green color
					accent: '#0A7E6A', // Same as primary, or adjust as needed
					neutral: '#F5F5F5', // Very light gray
					'base-100': '#FFFFFF', // White
					info: '#52AF7A', // Using the lighter green for info
					success: '#52AF7A', // Lighter green for success
					warning: '#F5F5F5', // Light gray for warning (can adjust if needed)
					error: '#FF0000' // Keeping red for error
				}
			}
		]
	},
	plugins: [require('daisyui')]
};
