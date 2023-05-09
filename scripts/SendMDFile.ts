import fs from 'fs';
import path from 'path';

const config = {
  dir: "../content/",
  title: "文章备份"
}

export default class SendMDFile {
  mdFileString: string; //
  entry: string = '';

  constructor() {
    this.mdFileString = '';
    this.entry = path.join(__dirname, config.dir);
    this.createTitle(config.title);
    this.readDir(this.entry);
  }

  createElement(tagName: string, props?: any, content?: string): string {
    let attributes = ""
    if (!content) {
      content = props
      props = null
    } else {
      attributes = Object.entries(props).map(item => {
        return ` ${item[0]}="${item[1]}"`
      }).join("")
    }

    content = Array.isArray(content) ? content.join("\n") : content


    return `<${tagName}${attributes}>${content}</${tagName}> \n`
  }

  /**
   * @description: 创建带链接的标题
   * @param {string} path
   * @param {number} text
   * @return {*}
   */
  createLinkTitle(path: string, text: string, level: number = 0): void {
    level = level > 5 ? 5 : level + 1;

    this.mdFileString += this.createElement(`h${level}`, this.createElement("a", { href: path }, text))

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
        this.createLinkTitle(linuxPath, location.split(path.sep).at(-1) || '', level);
      }
    });
  }

  /**
   * @description: 获取生成后的数据
   * @return {*}
   */
  getMdFileString(): string {
    return this.mdFileString;
  }
}
