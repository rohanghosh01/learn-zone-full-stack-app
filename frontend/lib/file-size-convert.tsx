export function convertSize(size: any) {
  let data = parseInt(size) / 1024; // Convert size from bytes to KB
  if (data < 1024) {
    // If size is less than 1 MB, return the size in KB
    return data.toFixed(2) + " KB";
  } else {
    // Otherwise, return the size in MB
    let dataInMB = data / 1024;
    return dataInMB.toFixed(2) + " MB";
  }
}
