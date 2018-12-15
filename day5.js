const fs = require('fs')
const data = fs.readFileSync('./day5.txt', 'utf8') // beware of newline!

const willReact = (a, b) => ((a.toLowerCase() === b.toLowerCase()) && (a !== b))

function react(chars){
    const reacted = []
    let i = 0
    while(i < chars.length - 1){
        if(willReact(chars[i], chars[i+1])){
            i += 2
        }else{
            reacted.push(chars[i])
            i++
        }
    }

    if(i < chars.length){
        reacted.push(chars[i])
    }

    return reacted
}

function fullyReact(chars){
    let reacted = chars
    while(true){
        let nextReacted = react(reacted)
        if(nextReacted.length === reacted.length){
            break
        }
        reacted = nextReacted
    }
    return reacted
}

function part1(){
    const chars = data.split('')
    const reacted = fullyReact(chars)
    return reacted.length
}

function part2(){
    const letters = 'abcdefghijklmnopqrstuvwxyz'.split('')
    let bestLength = 10000000000000

    let preReactedData = fullyReact(data.split('')).join('')

    for(let letter of letters){
        let chars = preReactedData.replace(new RegExp(letter, 'g'), '').replace(new RegExp(letter.toUpperCase(), 'g'), '').split('')
        let reacted = fullyReact(chars)
        if(reacted.length < bestLength){
            bestLength = reacted.length
        }
    }

    return bestLength
}

console.log(part1())
console.log(part2())