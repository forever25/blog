import fs from 'fs';
import SendMDFile from './SendMDFile';

/**
 * @description: 主函数
 */
function main() {
  const MDFile: SendMDFile = new SendMDFile();
  //写入文件
  try {
    fs.writeFileSync('./README.md', MDFile.getMdFileString(), {
      encoding: 'utf-8',
      flag: 'w+',
    });
  } catch (error) {
    console.log(error);
  }
}

main();
