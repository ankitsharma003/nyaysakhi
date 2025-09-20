/*
 Render Mermaid .mmd files in public/diagrams to PNGs using Kroki API.
 This avoids local mermaid-cli/puppeteer installation issues.
*/

import fs from 'fs'
import path from 'path'
import https from 'https'

const DIAGRAMS_DIR = path.join(process.cwd(), 'public', 'diagrams')
const OUTPUT_DIR = DIAGRAMS_DIR // place PNGs alongside sources
const KROKI_URL = process.env.KROKI_URL || 'https://kroki.io'

function readAllMmdFiles(dir: string): string[] {
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mmd'))
    .map((f) => path.join(dir, f))
}

function renderMermaidToPng(mermaidSource: string): Promise<Buffer> {
  const body = JSON.stringify({ diagram_source: mermaidSource })
  const url = new URL('/mermaid/png', KROKI_URL)

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        method: 'POST',
        hostname: url.hostname,
        path: url.pathname,
        protocol: url.protocol,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body).toString(),
        },
      },
      (res) => {
        const chunks: Buffer[] = []
        res.on('data', (d) => chunks.push(d as Buffer))
        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            resolve(Buffer.concat(chunks))
          } else {
            reject(
              new Error(
                `Kroki error ${res.statusCode}: ${Buffer.concat(chunks).toString()}`
              )
            )
          }
        })
      }
    )
    req.on('error', reject)
    req.write(body)
    req.end()
  })
}

async function main() {
  if (!fs.existsSync(DIAGRAMS_DIR)) {
    console.error(`Directory not found: ${DIAGRAMS_DIR}`)
    process.exit(1)
  }

  const files = readAllMmdFiles(DIAGRAMS_DIR)
  if (files.length === 0) {
    console.log('No .mmd files found.')
    return
  }

  console.log(`Rendering ${files.length} Mermaid files via ${KROKI_URL}...`)
  for (const file of files) {
    const base = path.basename(file, '.mmd')
    const out = path.join(OUTPUT_DIR, `${base}.png`)
    const source = fs.readFileSync(file, 'utf8')
    try {
      const png = await renderMermaidToPng(source)
      fs.writeFileSync(out, png)
      console.log(`✔ ${base}.png`)
    } catch (err) {
      console.error(`✖ Failed ${base}.mmd -> ${base}.png`)
      console.error(err)
    }
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
