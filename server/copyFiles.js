import { getFiles } from './files.js';
import { promises as fs } from 'fs';
import { createFolderAndFiles } from './translation.js';

export async function copyFiles(folder, options) {

    for await (const file of getFiles(folder || '/home/akindziora/projekte/radbod/test/todoMVC/src/')) {
        let folderPath = file.replace("src", options.buildPath || "public/build/dev").split("/");
        let filename = folderPath.pop();
                    
        if (filename.split(".")[1] === options.extension) {

            await fs.mkdir(folderPath.join("/"), { recursive: true });

            if (filename.indexOf("server_") === -1){
                await fs.copyFile(file, file.replace("src", options.buildPath || "public/build/dev"));
        
            } 
    
        }

        if (filename.split(".")[1] === "html") {
            console.log("PAGE", file);

            await createFolderAndFiles(file.replace("src", options.buildPath || "public/build/dev"));
        }

    }


    let buildP = folder.replace("src", options.buildPath || "public/build/dev");
    await fs.copyFile(folder.replace("src", "config/manifest.json"), buildP + "/manifest.json" );
    await fs.copyFile(folder + "/app.js", buildP + "/app.js" );
    await fs.mkdir(folder + "/deps", { recursive: true });

    await fs.copyFile("/home/akindziora/Downloads/projekte/radbod/dist/radbod.js", buildP + "/deps/radbod.js"  );

    


}
