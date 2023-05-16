import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

//posts目录的路径
const postsDirectory = path.join(process.cwd(), 'posts');

export function getSortedPostsData() {
  // 获取posts目录下的所以文件名
  const fileNames = fs.readdirSync(postsDirectory);
  // 获取所有md文件用于展示首页列表的数据，包含id，元数据（标题，时间）
  const allPostsData = fileNames.map((fileName) => {
     // 去除文件名的md后缀，使其作为文章id使用
    const id = fileName.replace(/\.md$/, '');

     // 获取md文件路径
    const fullPath = path.join(postsDirectory, fileName);
    // 读取md文件内容
    const fileContents = fs.readFileSync(fullPath, 'utf8');

 // 使用matter提取md文件元数据：{data:{//元数据},content:'内容'}
     const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      id,
      ...matterResult.data,
    };
  });
  // 按照日期从近到远排序
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

// 获取格式化后的所有文章id（文件名）
export function getAllPostIds() {
    const fileNames = fs.readdirSync(postsDirectory);
  
    // Returns an array that looks like this:
    // [
    //   {
    //     params: {
    //       id: 'ssg-ssr'
    //     }
    //   },
    //   {
    //     params: {
    //       id: 'pre-rendering'
    //     }
    //   }
    // ]
    return fileNames.map((fileName) => {
      return {
        params: {
          id: fileName.replace(/\.md$/, ''),
        },
      };
    });
  }

  // 获取指定文章内容
  export async function getPostData(id) {
    // 文章路径
    const fullPath = path.join(postsDirectory, `${id}.md`);
      // 读取文章内容
    const fileContents = fs.readFileSync(fullPath, 'utf8');
  
// 使用matter解析markdown元数据和内容
    const matterResult = matter(fileContents);
  
    //  使用remark将markdown转换为HTML字符串
    const processedContent = await remark()
      .use(html)
      .process(matterResult.content);
    const contentHtml = processedContent.toString();
  
    // Combine the data with the id and contentHtml
    return {
      id,
      contentHtml,
      ...matterResult.data,
    };
  }