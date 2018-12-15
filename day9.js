function moveCW(marble, nSteps){
    for(let n = 1; n <= nSteps; n++){
        marble = marble.next
    }
    return marble
}
function moveCCW(marble, nSteps){
    for(let n = 1; n <= nSteps; n++){
        marble = marble.prev
    }
    return marble
}
function removeMarble(marble){
    const next = marble.next
    const prev = marble.prev

    next.prev = prev
    prev.next = next
}
function insertAfter(value, marbleBefore){
    const marble = {value, prev: null, next: null}
    const originalNext = marbleBefore.next
    marbleBefore.next = marble
    originalNext.prev = marble
    marble.next = originalNext
    marble.prev = marbleBefore
    return marble
}
function play(nPlayers, lastMarbleValue){
    let players = []
    for(let i = 0; i < nPlayers; i++){
        players.push({score: 0})
    }

    let currentMarble = {value: 0, prev: null, next: null}
    currentMarble.prev = currentMarble
    currentMarble.next = currentMarble

    let player = 0
    let nextValue = 1
    while(nextValue <= lastMarbleValue){
        if(nextValue%23 === 0){
            players[player].score += nextValue
            currentMarble = moveCCW(currentMarble, 7)
            players[player].score += currentMarble.value
            let nextCurrentMarble = currentMarble.next
            removeMarble(currentMarble)
            currentMarble = nextCurrentMarble
        }else{
            currentMarble = moveCW(currentMarble, 1)
            currentMarble = insertAfter(nextValue, currentMarble)
        }

        player++
        player = player % nPlayers
        nextValue++
    }

    return Math.max(...players.map(p => p.score))
}

function part1(){
    return play(418, 71339)
}

function part2(){
    return play(418, 7133900)
}

console.log(part1())
console.log(part2())