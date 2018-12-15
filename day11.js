const serial = 7689

function calcFuel(x, y){
    const rackId = x + 10
    let power = ((rackId * y) + serial)*rackId
    power = Math.floor((power%1000)/100) - 5
    return power
}

function part1(){
    let maxPower = 0
    let coord = {}
    let r = 3
    for(let y = 1; y <= 300-r; y++){
        for(let x = 1; x <= 300-r; x++){
            let power = 0
            for(let n = 0; n < r; n++){
                for(let m = 0; m < r; m++){
                    power += calcFuel(x+n, y+m)
                }
            }

            if(power > maxPower){
                maxPower = power
                coord = {x, y}
            }
        }
    }
    return coord
}

function part2(){
    let maxPower = 0
    let coord = {}
    for(let y = 1; y <= 300; y++){
        if(y % 50 === 0) console.log('progress', y)
        for(let x = 1; x <= 300; x++){
            let max = Math.max(x, y)
            let power = 0
            for(let r = 1; r <= 300 - max + 1; r++){
                for(let n = 0; n < r; n++){
                    power += calcFuel(x+r-1, y+n)
                }
                for(let n = 0; n < r-1; n++){
                    power += calcFuel(x+n, y+r-1)
                }

                if(power > maxPower){
                    maxPower = power
                    coord = {x, y, r}
                }
            }
        }
    }

    return coord
}

console.log(part1())
console.log(part2())