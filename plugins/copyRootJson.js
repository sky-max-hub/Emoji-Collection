import fs from 'fs'
import path from 'path'

export default function copyRootJson() {
    return {
        name: 'copy-root-json',
        writeBundle() {
            const files = ['gallery-index.json']
            const distDir = path.resolve(process.cwd(), 'dist') // process.cwd() 更稳
            console.log('distDir:', distDir);
            console.log('files:', files);
            files.forEach(fileName => {
                const srcPath = path.resolve(process.cwd(), fileName)
                console.log('srcPath:', srcPath);
                const destPath = path.join(distDir, fileName)
                console.log('destPath:', destPath);
                if (fs.existsSync(srcPath)) {
                    console.log('srcPath exists:', fs.existsSync(srcPath));
                    fs.copyFileSync(srcPath, destPath)
                    console.log(`Copied ${fileName} to dist/`)
                }
            })
        }
    }
}
