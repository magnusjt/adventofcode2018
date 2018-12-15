const fs = require('fs')

const data = fs.readFileSync('./day2.txt', 'utf8')

const lines = data.split(/\r\n|\n|\r/g)
    .map(line => line.trim())

function letterFreq(word){
    return word.split('').reduce((freq, letter) => {
        freq[letter] = !freq.hasOwnProperty(letter) ? 1 : freq[letter] + 1
        return freq
    }, {})
}

function part1(){
    const twos = lines
        .map(line => letterFreq(line))
        .map(freq => new Set(Object.values(freq)).has(2) ? 1 : 0)
        .reduce((sum, num) => sum + num, 0)
    const threes = lines
        .map(line => letterFreq(line))
        .map(freq => new Set(Object.values(freq)).has(3) ? 1 : 0)
        .reduce((sum, num) => sum + num, 0)

    return twos * threes
}

function part2(){
    for(let x = 0; x < lines.length; x++){
        const chars1 = lines[x].split('')
        for(let otherLine of lines.slice(x + 1)){
            const chars2 = otherLine.split('')
            let diffs = 0
            let result = ''
            for(let i = 0; i < chars1.length; i++){
                if(chars1[i] !== chars2[i]){
                    diffs++
                    if(diffs > 1){
                        break
                    }
                }else{
                    result += chars1[i]
                }
            }
            if(diffs === 1){
                return result
            }
        }
    }
}

console.log(part1())
console.log(part2())