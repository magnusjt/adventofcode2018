const _ = require('lodash')
const fs = require('fs')
const data = fs.readFileSync('./day6.txt', 'utf8')
/*
const data = '1, 1\n' +
    '1, 6\n' +
    '8, 3\n' +
    '3, 4\n' +
    '5, 5\n' +
    '8, 9\n'*/

const places = data.split(/\r\n|\n|\r/g)
    .map(line => line.trim())
    .map((line, i) => {
        const [x, y] = line.split(', ')
        return {x: Number(x), y: Number(y), id: ''+i}
    })

function getDistance(point1, point2){
    return Math.abs(point1.x - point2.x) + Math.abs(point1.y - point2.y)
}

function getBounds(places){
    const xSort = _.sortBy(places, 'x')
    const ySort = _.sortBy(places, 'y')
    return {
        x: xSort[0].x,
        y: ySort[0].y,
        width: xSort[xSort.length - 1].x - xSort[0].x,
        height: ySort[ySort.length - 1].y - ySort[0].y
    }
}

function isOnBound(x, y, bounds){
    return (
        x === bounds.x ||
        x === bounds.x + bounds.width ||
        y === bounds.y ||
        y === bounds.y + bounds.height
    )
}

function getNearestPlace(places, placeToCheck){
    let res = _(places)
        .map(place => {
            return {place, distance: getDistance(place, placeToCheck)}
        })
        .sortBy('distance')
        .value()

    // Equal distance -> no winner
    if(res[0].distance === res[1].distance){
        return null
    }

    return res[0].place
}

function part1(){
    const bounds = getBounds(places)
    const board = []
    for(let x = bounds.x; x <= bounds.x + bounds.width; x++){
        for(let y = bounds.y; y <= bounds.y + bounds.height; y++){
            const place = getNearestPlace(places, {x, y})
            if(place){
                board.push({x, y, place})
            }

        }
    }

    const placeIdsWithInfiniteArea = [...new Set(board
        .filter(item => isOnBound(item.x, item.y, bounds))
        .map(item => item.place.id))]

    let countById = {}
    board.forEach(({place}) => {
        if(!countById.hasOwnProperty(place.id)) countById[place.id] = {place, count: 0}
        countById[place.id].count++
    })

    return _.max(
        Object.entries(countById)
            .filter(([id]) => !placeIdsWithInfiniteArea.some(placeId => placeId === id))
            .map(([id, {count}]) => count)
    )
}

function part2(){
    const bounds = getBounds(places)
    const maxTotalDistance = 10000
    let regionSize = 0

    for(let x = bounds.x; x <= bounds.x + bounds.width; x++){
        for(let y = bounds.y; y <= bounds.y + bounds.height; y++){
            let totalDistance = 0
            for(let place of places){
                totalDistance += getDistance(place, {x, y})
                if(totalDistance >= maxTotalDistance) break
            }

            if(totalDistance < maxTotalDistance){
                regionSize++
            }
        }
    }

    return regionSize
}

console.log(part1())
console.log(part2())