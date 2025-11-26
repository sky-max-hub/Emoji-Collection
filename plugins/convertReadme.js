import fs from 'fs'
import path from 'path'
import MarkdownIt from 'markdown-it'

export default function convertReadme() {
    return {
        name: 'convert-readme',
        apply: 'build',

        closeBundle() {
            const root = process.cwd()
            const srcPath = path.join(root, 'README.md')
            const distPath = path.join(root, 'dist', 'readme.html')

            if (!fs.existsSync(srcPath)) {
                console.warn('[convert-readme] README.md 不存在，跳过转换')
                return
            }

            try {
                const mdContent = fs.readFileSync(srcPath, 'utf-8')
                const md = new MarkdownIt({ html: true })

                let html = md.render(mdContent)
                html = html.replace(/src="\.\/*public\/assets\//g, 'src="./assets/');

                // 生成一个简单 HTML 包裹
                const fullHtml = `
<!DOCTYPE html>
<html lang="zh-cn">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Emoji-Collection-README</title>
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml" />
  <style>
    body { max-width: 800px; margin: 40px auto; font-family: sans-serif; line-height: 1.7; }
    pre { background: #f5f5f5; padding: 10px; border-radius: 8px; }
    code { color: #d6336c; }
  </style>
</head>
<body>
${html}
</body>
</html>`

                fs.writeFileSync(distPath, fullHtml, 'utf-8')

                console.log('[convert-readme] 已生成 dist/readme.html')
            } catch (err) {
                console.error('[convert-readme] 转换失败:', err)
            }
        }
    }
}
