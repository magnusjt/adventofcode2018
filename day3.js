const fs = require('fs')

const data = fs.readFileSync('./day3.txt', 'utf8')

const claims = data.split(/\r\n|\n|\r/g)
    .map(line => line.trim())
    .map(line => {
        const [all, id, x, y, width, height] = line.match(/^#(\d+) @ (\d+),(\d+): (\d+)x(\d+)$/)
        return {id, x: Number(x), y: Number(y), width: Number(width), height: Number(height)}
    })

function part1(){
    const board = {}

    claims.forEach(claim => {
        for(let x = claim.x; x < claim.x + claim.width; x++){
            for(let y = claim.y; y < claim.y + claim.height; y++){
                const key = `${x}-${y}`
                if(!board.hasOwnProperty(key)) board[key] = 0
                board[key]++
            }
        }
    })

    return Object.values(board)
        .filter(num => num >= 2)
        .length
}

function part2(){
    const board = {}

    claims.forEach(claim => {
        for(let x = claim.x; x < claim.x + claim.width; x++){
            for(let y = claim.y; y < claim.y + claim.height; y++){
                const key = `${x}-${y}`
                if(!board.hasOwnProperty(key)) board[key] = 0
                board[key]++
            }
        }
    })

    return claims.find(claim => {
        for(let x = claim.x; x < claim.x + claim.width; x++){
            for(let y = claim.y; y < claim.y + claim.height; y++){
                const key = `${x}-${y}`
                if(board[key] !== 1){
                    return false
                }
            }
        }

        return true
    }).id
}

console.log(part1())
console.log(part2())