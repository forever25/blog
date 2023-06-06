export const config = {
  dir: '../content/',
  title: '文章备份',
  description: `
<p>这个仓库用于储存备份文件，知识库，提供加密和根据文档内容自动生成README索引文档。</p>

<h2>功能</h2>

<ul>
  <li><code>pnpm build</code>将文件名后缀为<code>_enc</code>的文件进行加密</li>
  <li><code>pnpm decrypt</code>加密文档解密</li>
  <li><code>pnpm build</code>自动根据content内容生成README文件索引</li>
</ul>

`,
};
