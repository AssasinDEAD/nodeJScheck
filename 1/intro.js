// const fs = require('fs').promises;
// const inputPath = './input.txt'
// const outputpath = './Output.txt'

// async function analyze() {
//    try{
//       const data = await fs.readFile(inputPath, 'utf8')
//       const dataLength = data.length
//       const dataLength2 = [...data].length
//       const dataLines=data.split('\n').length
//       const dataWorrds=data.split(/\s+/).length

//       const result = `
//       Namber of chars: ${dataLength}
//       \n
//       Namber of chars2: ${dataLength2}
//       \n
//       Number of lines: ${dataLines}
//       \n
//       Number of words: ${dataWorrds}
//       `
//       await fs.writeFile(outputpath, result)
//       console.log('Analysis complete. Results written to output.txt', outputpath);
//    }catch(err){
//       console.error('Error reading or writing files:', err);
//    }
// }

// analyze();

// 2
// const greetings = process.argv

// if(!greetings[2]){
//    console.log("hello, Гость");
// }else{
// console.log("hello", greetings[2]);
// }


// 3
// const os = require('os')
// console.log('user', os.userInfo())
// console.log('platform', os.platform())
// console.log('memory', os.totalmem()/1024/1024/1024)
// console.log('work', os.uptime()/3600)
// console.log('free memory', os.freemem()/1024/1024/1024)

// // 4
// const path = require('path')


// const abs = path.resolve(__dirname, 'intro.js')
// const extname = path.extname(abs)
// const base = path.basename(abs)

// console.log('abs', abs, '\nextname', extname, '\nbase', base);

// 5
// const fs = require('fs').promises;
// const { dir } = require('console');
// const path = require('path');

// async function dirs(){
//    const [, , dirsPathARG] = process.argv
//    const dirsPath = dirsPathARG || process.cwd()
//    if(!dirsPath) {
//       console.log('Please provide a directory path')
//       process.exit(1)
//    }

//    try{
//       const pathFiles = await fs.readdir(dirsPath)
//       const filestFind= pathFiles.filter(name => path.extname(name).toLowerCase() === '.txt')

//       if(filestFind.length === 0){
//          console.log('No .txt files found in the directory');
//          return
//       }else{
//          filestFind.forEach(files => console.log('file:', files))
//       }
//    }catch(err){
//       console.log('Error reading directory', err.message);
//       process.exitCode=1
//    }
// }

// dirs()

// 6
// const fs = require("fs").promises
// const path = require("path")

// async function copyFile() {
//    const src = path.resolve("input.txt")
//    const destDir = path.resolve("backup")
//    const destFile = path.join(destDir, "backup.txt")
//    try{
//       await fs.access(src)

//       await fs.mkdir(destDir, {recursive: true})

//       await fs.copyFile(src, destFile)
//       console.log("File copied to backup/backup.txt")

//    }catch(err){
//       console.log("Error copying file", err.message);
//       process.exitCode = 1
//    }

  
// }
// copyFile()

//7

const count =Number(process.argv[2] || 5)

// process.stdout.write(`${remain} left \r`)
// const interval = setInterval(() => {
//    remain = remain - 1
//    if(remain > 0){
//       process.stdout.write(`${remain} left \r`)
//    }else{
//       clearInterval(interval)
//       console.log('Done' );
//    }
// },1000)


//   for(let i=0; i<=count; i++){
//    setTimeout(() => {
//    const remain = count - i
   
//    if (remain > 0){
//       console.log('left', remain);
     
//    }else{
//       console.log('Done');
//    }
//    },i*1000)
   
//   }


// const fs = require('fs').promises
// const path = require('path')

// const filePath = process.argv[2] || path.resolve("backup", 'backup.txt')

// async function fileInfo(){
//    try{
//       const stats= await fs.stat(filePath)
//       const filname = path.basename(filePath)
//       console.log('File:', stats)
//       console.log('File name:', filname);
      
      
//    }catch(err){
//       console.error('Error getting file info', err.message);
//       process.exitCode = 1
//    }
// }

// fileInfo()