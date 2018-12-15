const _ = require('lodash')
const fs = require('fs')
const data = fs.readFileSync('./day10.txt', 'utf8')
const points = data.split(/\r\n|\n|\r/g)
    .map(line => line.trim())
    .map(line => {
        const [all, x, y, vx, vy] = line.match(/position=<\s*([\d-]+)\s*,\s*([\d-]+)\s*> velocity=<\s*([\d-]+)\s*,\s*([\d-]+)\s*>/)
        return {
            x: Number(x),
            y: Number(y),
            vx: Number(vx),
            vy: Number(vy),
        }
    })

function normalize(points){
    let left = Math.min(...points.map(point => point.x))
    let top = Math.min(...points.map(point => point.y))
    let leftShift = -1*left
    let topShift = -1*top

    return points.map(point => {
        return {...point, x: point.x + leftShift, y: point.y + topShift}
    })
}
function print(points){
    points = normalize(points)
    let pointsByCoord = points.reduce((acc, point) => {
        acc[`${point.x}-${point.y}`] = true
        return acc
    }, {})
    let bounds = getBounds(points)
    for(let y = 0; y <= bounds.height; y++){
        let row = []
        for(let x = 0; x <= bounds.width; x++){
            if(pointsByCoord.hasOwnProperty(`${x}-${y}`)){
                row.push('#')
            }else{
                row.push('.')
            }
        }
        console.log(row.join(''))
    }
}

function getBounds(points){
    let xs = points.map(point => point.x)
    let ys = points.map(point => point.y)
    let left = Math.min(...xs)
    let right = Math.max(...xs)
    let top = Math.min(...ys)
    let bottom = Math.max(...ys)
    return {width: (right - left), height: (bottom - top)}
}

function getCloseness(points){
    let {width, height} = getBounds(points)
    return width + height
}

function step(points){
    return points.map(point => {
        return {...point, x: point.x + point.vx, y: point.y + point.vy}
    })
}

function part1AndTwo(points){
    let currentCloseness = Infinity
    let seconds = 1

    while(true){
        let prevCloseness = currentCloseness
        let prevPoints = points
        points = step(points)
        currentCloseness = getCloseness(points)

        if(currentCloseness > prevCloseness){
            print(prevPoints)
            console.log(seconds - 1)
            break
        }

        seconds++
    }
}

part1AndTwo(points)