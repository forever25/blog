import fs from 'fs';
import path from 'path';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { config } from './constants';

const encryptionKey = process.env.CRYPTO_KEY!;

export default class SendMDFile {
  mdFileString: string; //
  entry: string = '';

  constructor() {
    this.mdFileString = '';
    this.entry = path.join(__dirname, config.dir);
    this.createTitle(config.title);
    this.mdFileString += config.description;
    this.readDir(this.entry);
  }

  createElement(tagName: string, props?: any, content?: string): string {
    let attributes = '';
    if (!content) {
      content = props;
      props = null;
    } else {
      attributes = Object.entries(props)
        .map(item => {
          return ` ${item[0]}="${item[1]}"`;
        })
        .join('');
    }

    content = Array.isArray(content) ? content.join('\n') : content;

    return `<${tagName}${attributes}>${content}</${tagName}>`;
  }

  /**
   * @description: 创建带链接的标题
   * @param {string} path
   * @param {number} text
   * @return {*}
   */
  createLinkTitle(path: string, text: string, level: number = 0): void {
    level = level > 5 ? 5 : level + 1;

    this.mdFileString += this.createElement(`h${level}`, this.createElement('a', { href: path }, text));
    this.mdFileString += '\n\n';
  }

  /**
   * @description: 根据生成对应层级的标题
   * @param {string} text
   * @param {number} level
   * @return {*}
   */
  createTitle(text: string, level: number = 0): void {
    level = level > 5 ? 5 : level + 1;
    this.mdFileString += this.createElement(`h${level}`, text);
    this.mdFileString += '\n\n';
  }

  /**
   * @description: 递归获取文件夹
   * @param {string} dirPath 需要获取文件夹地址
   */
  readDir(dirPath: string, level = 1) {
    const dirInfo = fs.readdirSync(dirPath);
    dirInfo.forEach(item => {
      const location = path.join(dirPath, item);
      const info = fs.statSync(location);
      if (info.isDirectory()) {
        const title = location.split(path.sep).at(-1) || '';
        this.createTitle(title, level);
        this.readDir(location, 1 + level);
      } else {
        let winPath = location.replace(this.entry, 'content/');
        let linuxPath = winPath.replaceAll(path.sep, '/');
        const fileName = location.split(path.sep).at(-1) || '';
        this.encryptionFile(location, fileName);
        this.createLinkTitle(linuxPath, fileName, level);
      }
    });
  }

  encryptionFile(paths: string, fileName: string) {
    if (fileName.includes('_enc') && !fileName.includes('_enc_end')) {
      const text = fs.readFileSync(paths).toString('utf-8');
      const encText = encryptionData(text);
      fs.writeFileSync(paths, encText, {
        encoding: 'utf-8',
        flag: 'w+',
      });

      const newPath = paths.replace('_enc', '_enc_end');
      try {
        fs.rename(paths, newPath, () => {});
      } catch (error) {}
    }
  }

  /**
   * @description: 获取生成后的数据
   * @return {*}
   */
  getMdFileString(): string {
    return this.mdFileString;
  }
}

export const encryptionData = (src: string) => {
  const key = encryptionKey;
  const iv = encryptionKey;
  let sign = '';
  const cipher = createCipheriv('aes-128-cbc', key, iv); // createCipher在10.0.0已被废弃
  sign += cipher.update(src, 'utf8', 'hex');
  sign += cipher.final('hex');
  return sign;
};

export const decryptData = (sign: string) => {
  const key = encryptionKey;
  const iv = encryptionKey;
  let src = '';
  const cipher = createDecipheriv('aes-128-cbc', key, iv);
  src += cipher.update(sign, 'hex', 'utf8');
  src += cipher.final('utf8');
  return src;
};
