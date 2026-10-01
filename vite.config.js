import react from '@vitejs/plugin-react'
// base './' keeps asset paths relative so it works under /<repo-name>/ on GitHub Pages
export default { base: './', plugins: [react()] }
