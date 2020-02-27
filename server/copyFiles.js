import { getFiles } from './files.js';
import { promises as fs } from 'fs';

export async function copyFiles(folder, options) {
    for await (const file of getFiles(folder || '/home/akindziora/projekte/kjs/test/todoMVC/src/')) {
        let folderPath = file.replace("src", options.buildPath || "public/build/dev").split("/");
        let filename = folderPath.pop();

        if (filename.split(".")[1] === options.extension) {
            await fs.mkdir(folderPath.join("/"), { recursive: true });
            if(filename.indexOf("server_") ===-1)
                await fs.copyFile(file, file.replace("src", options.buildPath || "public/build/dev"));
        }
        
    }
}
