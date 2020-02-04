
import { resolve } from 'path';
import { promises as fs } from 'fs';

export async function* getFiles(dir) {
    let dirents = await fs.readdir(dir, { withFileTypes: true }); 
    for (const dirent of dirents) {
        const res = resolve(dir, dirent.name);
        if (dirent.isDirectory()) {
            yield* getFiles(res);
        } else {
            yield res;
        }
    }
}