require('dotenv').config()
import fs from 'fs';
import path from 'path';

import { decryptData } from "./SendMDFile"
import { config } from './constants'

function readDir(dirPath: string) {
  const dirInfo = fs.readdirSync(dirPath);
  dirInfo.forEach(item => {
    const location = path.join(dirPath, item);
    const info = fs.statSync(location);
    if (info.isDirectory()) {
      readDir(location);
    } else {
      const fileName = location.split(path.sep).at(-1) || ''
      encryptionFile(location, fileName)
    }
  });
}

function encryptionFile(paths: string, fileName: string) {
  if (fileName.includes('_enc_end')) {
    const text = fs.readFileSync(paths).toString('utf-8')
    const encText = decryptData(text)

    fs.writeFileSync(paths, encText, {
      encoding: 'utf-8',
      flag: 'w+',
    });
    const newPath = paths.replace('_enc_end', '_enc')
    try {
      fs.rename(paths, newPath, () => { });
    } catch (error) {

    }

  }
}

function main() {
  readDir(path.join(__dirname, config.dir))
}


main()