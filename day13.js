const _ = require('lodash')
const fs = require('fs')
const data = fs.readFileSync('./day13.txt', 'utf8')
const lines = data.split(/\r\n|\n|\r/g)

const map = []
const carts = []
for(let y = 0; y < lines.length; y++){
    let chars = lines[y].split('')
    let cols = []
    for(let x = 0; x < chars.length; x++){
        if(['<', '>', '^', 'v'].includes(chars[x])){
            carts.push({x, y, dir: chars[x], nextTurn: 0})
        }
        if(['<', '>'].includes(chars[x])){
            cols.push('-')
        }else if([ '^', 'v'].includes(chars[x])){
            cols.push('|')
        }else{
            cols.push(chars[x])
        }
    }
    map.push(cols)
}

function sortCarts(carts){
    return [...carts].sort((a,b) => {
        if(a.y > b.y) return 1
        if(a.y < b.y) return -1

        if(a.x > b.x) return 1
        if(a.x < b.x) return -1

        return 0
    })
}

function isTopRightCorner(cart, map){
    let currentTrack = map[cart.y][cart.x]
    if(currentTrack !== '\\') return false
    let leadingTrack = map[cart.y][cart.x - 1]
    return leadingTrack === '-' || leadingTrack === '+'

}
function isBottomLeftCorner(cart, map){
    let currentTrack = map[cart.y][cart.x]
    if(currentTrack !== '\\') return false
    let leadingTrack = map[cart.y][cart.x + 1]
    return leadingTrack === '-' || leadingTrack === '+'
}
function isTopLeftCorner(cart, map){
    let currentTrack = map[cart.y][cart.x]
    if(currentTrack !== '/') return false
    let leadingTrack = map[cart.y][cart.x + 1]
    return leadingTrack === '-' || leadingTrack === '+'
}
function isBottomRightCorner(cart, map){
    let currentTrack = map[cart.y][cart.x]
    if(currentTrack !== '/') return false
    let leadingTrack = map[cart.y][cart.x - 1]
    return leadingTrack === '-' || leadingTrack === '+'
}

function turnCart(cart, map){
    let currentTrack = map[cart.y][cart.x]
    let dir = cart.dir
    let nextTurn = cart.nextTurn

    if(isTopRightCorner(cart, map)){
        if(cart.dir === '^'){
            dir = '<'
        }else if(cart.dir === '>'){
            dir = 'v'
        }
    }else if(isBottomLeftCorner(cart, map)){
        if(cart.dir === '<'){
            dir = '^'
        }else if(cart.dir === 'v'){
            dir = '>'
        }
    }else if(isTopLeftCorner(cart, map)){
        if(cart.dir === '^'){
            dir = '>'
        }else if(cart.dir === '<'){
            dir = 'v'
        }
    }else if(isBottomRightCorner(cart, map)){
        if(cart.dir === '>'){
            dir = '^'
        }else if(cart.dir === 'v'){
            dir = '<'
        }
    }else if(currentTrack === '+'){
        if(nextTurn !== 1){
            const intersection = {
                '0>': '^',
                '0<': 'v',
                '0^': '<',
                '0v': '>',
                '2>': 'v',
                '2<': '^',
                '2^': '>',
                '2v': '<',
            }
            dir = intersection[''+nextTurn + cart.dir]
        }

        nextTurn = (nextTurn + 1) % 3
    }

    return {
        ...cart,
        dir,
        nextTurn
    }
}

function moveCart(cart, map){
    cart = turnCart(cart, map)

    let nextCoords = {}
    if(cart.dir === '<'){
        nextCoords = {x: cart.x - 1, y: cart.y}
    }else if(cart.dir === '>'){
        nextCoords = {x: cart.x + 1, y: cart.y}
    }else if(cart.dir === '^'){
        nextCoords = {x: cart.x, y: cart.y - 1}
    }else if(cart.dir === 'v'){
        nextCoords = {x: cart.x, y: cart.y + 1}
    }

    return {
        ...cart,
        ...nextCoords
    }
}
function isCollision(cart, carts){
    return carts.some(c => c.x === cart.x && c.y === cart.y)
}

function part1(carts){
    while(true){
        carts = sortCarts(carts)

        for(let i = 0; i < carts.length; i++){
            let cart = carts[i]
            cart = moveCart(cart, map)
            if(isCollision(cart, carts)){
                return cart
            }
            carts[i] = cart
        }
    }
}

function part2(carts){
    while(true){
        carts = sortCarts(carts)

        for(let i = 0; i < carts.length; i++){
            let cart = carts[i]
            if(cart.dead){
                continue
            }
            cart = moveCart(cart, map)
            let collisionIndex = _.findIndex(carts, c => !c.dead && c.x === cart.x && c.y === cart.y)
            carts[i] = cart
            if(collisionIndex >= 0){
                carts[i].dead = true
                carts[collisionIndex].dead = true
            }
        }

        let alive = carts.filter(c => !c.dead)
        if(alive.length === 1){
            return alive[0]
        }
    }
}

console.log(part1(carts))
console.log(part2(carts))