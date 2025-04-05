import fs from 'fs';

class FileMaster {
    ready(pathFile: string): string | null {
        if (fs.existsSync(pathFile)) {
            return fs.readFileSync(pathFile, { encoding: 'utf-8' });
        }
        return null;
    }

    write(pathFile: string, data: string): void {
        fs.writeFileSync(pathFile, data, { encoding: 'utf-8' });
    }

    writeJson<T extends Record<string, any>>(pathFile: string, data: T): void {
        fs.writeFileSync(pathFile, JSON.stringify(data, null, 2), { encoding: 'utf-8' });
    }

    readyJson<T = any>(pathFile: string): T | null {
        if (fs.existsSync(pathFile)) {
            try {
                const cronData = fs.readFileSync(pathFile, { encoding: 'utf-8' });
                return JSON.parse(cronData) as T;
            } catch (error) {
                console.error('Error parsing JSON file:', error);
                return null;
            }
        }
        return null;
    }
}

export default new FileMaster();
