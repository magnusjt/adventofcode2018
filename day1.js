const fs = require('fs')

const data = fs.readFileSync('./day1.txt', 'utf8')

const nums = data.split(/\r\n|\n|\r/g)
    .map(line => line.trim())
    .map(line => Number(line))

function part1(){
    return nums.reduce((sum, num) => sum + num, 0)
}

function part2(){
    const freqs = new Set([0])

    let sum = 0
    while(true){
        for(let num of nums){
            sum += num
            if(freqs.has(sum)){
                return sum
            }
            freqs.add(sum)
        }
    }
}

console.log(part1())
console.log(part2())