const sizeKB = 1024;
const sizeMB = 1024 * sizeKB;
const sizeGB = 1024 * sizeMB;
/**@name 文件大小转换 */
export function transformFileSize(size: number) {
  try {
    if (size >= sizeKB && size <= sizeMB) {
      return (size / sizeKB).toFixed(2) + 'KB';
    } else if (size > sizeMB && size <= sizeGB) {
      return (size / sizeMB).toFixed(2) + 'MB';
    } else if (size > sizeGB) {
      return (size / sizeGB).toFixed(2) + 'GB';
    } else {
      return size.toFixed(2) + 'B';
    }
  } catch (error) {
    return null;
  }
}
// 释放媒体资源
export function freeMedia(url: string) {
  if (url !== '' && url.indexOf('blob') === 0) {
    URL.revokeObjectURL(url);
  }
}
