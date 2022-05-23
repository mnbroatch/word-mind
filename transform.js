const fs = require('fs')

const lines = (fs.readFileSync('./gameWords.txt')).toString().split('\n')

fs.writeFileSync('./game-words.json', JSON.stringify(lines, null, 2))
