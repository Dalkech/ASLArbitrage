import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'
import handlebars from 'vite-plugin-handlebars';
import { exec } from 'child_process';
import { cp, readdirSync } from 'fs';
import { resolve } from 'path';

const componentDirs = readdirSync(resolve(__dirname, 'src/components')).map(dir =>
  resolve(__dirname, 'src/components', dir)
);

export default defineConfig({
    plugins: [
        handlebars({
            partialDirectory: componentDirs,
            reloadOnPartialChange: true,
        }),
        viteSingleFile(),
        {
            name: 'run-script-on-change',
            handleHotUpdate({ file }) {
                console.info(`File changed: ${file}, building ...`);
                exec('npx vite build',
                    (err, stdout) => {
                        console.info(`Script output:\n${stdout}`);
                        
                        if (err)
                            console.error(`Error executing script:\n${err}`);
                    });
            }
        }
    ],
    build: {
        rollupOptions: {
            input: './src/index.html',
            output : {
                format: 'iife'
            }
        },
        minify: true,
        cssMinify: true,
        cssCodeSplit: false,
        target: 'esnext',
    },
})