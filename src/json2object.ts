import * as fs from 'fs'

const json2object = function (filePath: string) : Object {
  console.log(filePath)
  const data = fs.readFileSync(filePath, 'utf8')
  const r = JSON.parse(data)
  console.log(r)
  return r
}

export default json2object