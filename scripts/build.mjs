import { spawn } from 'node:child_process'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
const distDir = path.join(projectRoot, 'dist')
const assetsDir = path.join(distDir, 'assets')

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: projectRoot,
      stdio: 'inherit',
      shell: false,
    })

    child.on('exit', (code) => {
      if (code === 0) {
        resolve()
        return
      }

      reject(new Error(`Command failed: ${command} ${args.join(' ')}`))
    })

    child.on('error', reject)
  })
}

await rm(distDir, { recursive: true, force: true })
await mkdir(assetsDir, { recursive: true })

await run(
  path.join(projectRoot, 'node_modules', '.bin', 'tailwindcss'),
  [
    '-i',
    path.join(projectRoot, 'src', 'index.css'),
    '-o',
    path.join(assetsDir, 'index.css'),
    '--minify',
  ],
)

await run(path.join(projectRoot, 'node_modules', '.bin', 'rollup'), [
  '-c',
  path.join(projectRoot, 'rollup.config.mjs'),
])

const indexTemplate = await readFile(path.join(projectRoot, 'index.html'), 'utf8')
const htmlOutput = indexTemplate
  .replace(
    '</head>',
    '    <link rel="stylesheet" href="./assets/index.css" />\n  </head>',
  )
  .replace(
    '<script type="module" src="/src/main.tsx"></script>',
    '<script type="module" src="./assets/index.js"></script>',
  )

await writeFile(path.join(distDir, 'index.html'), htmlOutput)
