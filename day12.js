const _ = require('lodash')
const fs = require('fs')
const data = fs.readFileSync('./day12.txt', 'utf8')
const lines = data.split(/\r\n|\n|\r/g)

const [, initialState] = lines[0].match(/initial state: (.+)/)
const rules = lines.slice(2)
    .map(line => line.split(' => '))
    .map(([list, plant]) => ({list, plant}))

function getNextState(state){
    let nextState = []
    let inside = x => x >= 0 && x < state.length

    for(let i = - 2; i < state.length + 2; i++){
        let list = [
            inside(i - 2) ? state[i - 2] : '.',
            inside(i - 1) ? state[i - 1] : '.',
            inside(i) ? state[i] : '.',
            inside(i + 1) ? state[i + 1] : '.',
            inside(i + 2) ? state[i + 2] : '.',
        ].join('')
        let plant = '.'
        for(let rule of rules){
            if(rule.list === list){
                plant = rule.plant
                break
            }
        }
        nextState.push(plant)
    }

    return nextState
}

function part1(){
    const N = 20
    let state = initialState.split('')
    let start = 0
    for(let g = 0; g < N; g++){
        start += 2
        state = getNextState(state)
    }

    return state.reduce((sum, plant, i) => {
        return sum + (plant === '#' ? i-start : 0)
    }, 0)
}

function part2(){
    const N = 50000000000 // :)
    let state = initialState.split('')
    let start = 0
    let prevSum = 0
    let sumDiff = 0
    for(let g = 0; g < N; g++){
        start += 2
        state = getNextState(state)
        let sum = state.reduce((sum, plant, i) => {
            return sum + (plant === '#' ? i-start : 0)
        }, 0)

        let nextSumDiff = sum - prevSum
        if(nextSumDiff === sumDiff){
            let gsLeft = N - g - 1
            return sum + gsLeft * nextSumDiff

        }

        sumDiff = nextSumDiff
        prevSum = sum
    }
}

console.log(part1())
console.log(part2())