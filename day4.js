const fs = require('fs')
const data = fs.readFileSync('./day4.txt', 'utf8')

const lines = data.split(/\r\n|\n|\r/g)
    .map(line => line.trim())
    .sort()

const events = lines
    .map(line => {
        const [all, date, hour, minute] = line.match(/^\[([\w-]+) (\d+):(\d+)\]/)
        const time = new Date(`${date}T${hour}:${minute}Z`)

        if(line.includes('falls asleep')){
            return {type: 'sleep', time}
        }
        else if(line.includes('wakes up')){
            return {type: 'wake', time}
        }else{
            const [all, guardId] = line.match(/Guard #(\d+)/)
            return {
                type: 'guard',
                guardId,
                time
            }
        }
    })

function getShifts(events){
    const shifts = []

    let currentShift = null
    for(let event of events){
        if(event.type === 'guard'){
            if(currentShift !== null){
                shifts.push(currentShift)
            }
            currentShift = [event]
        }else{
            currentShift.push(event)
        }
    }

    return shifts
}

function getSleepTimesByGuard(shifts){
    const sleepTimesByGuard = {}
    shifts.forEach(shift => {
        const guardId = shift[0].guardId
        if(!sleepTimesByGuard[guardId]){
            let sleepTimeList = []
            for(let m = 0; m < 60; m++){
                sleepTimeList[m] = 0
            }
            sleepTimesByGuard[guardId] = sleepTimeList
        }

        let startedSleeping = null
        for(let event of shift){
            if(event.type === 'sleep'){
                startedSleeping = event.time
            }else if(event.type === 'wake'){
                for(let m = startedSleeping.getMinutes(); m < event.time.getMinutes(); m++){
                    sleepTimesByGuard[guardId][m]++
                }
            }
        }
    })
    return sleepTimesByGuard
}

function part1(){
    const shifts = getShifts(events)
    const sleepTimesByGuard = getSleepTimesByGuard(shifts)

    const totalSleepTimeByGuard = {}
    Object.entries(sleepTimesByGuard).forEach(([guardId, sleepTimes]) => {
        if(!totalSleepTimeByGuard[guardId]){
            totalSleepTimeByGuard[guardId] = 0
        }
        totalSleepTimeByGuard[guardId] += sleepTimes.reduce((sum, num) => sum + num, 0)
    })

    let maxSleepTime = {
        guardId: null,
        time: 0
    }
    Object.entries(totalSleepTimeByGuard).forEach(([guardId, sleepTime]) => {
        if(sleepTime > maxSleepTime.time){
            maxSleepTime = {
                guardId,
                time: sleepTime
            }
        }
    })

    let maxMinute = -1
    let maxSlept = -1
    sleepTimesByGuard[maxSleepTime.guardId].forEach((sleptMinutes, minute) => {
        if(sleptMinutes > maxSlept){
            maxSlept = sleptMinutes
            maxMinute = minute
        }
    })

    return Number(maxSleepTime.guardId) * maxMinute
}

function part2(){
    const shifts = getShifts(events)
    const sleepTimesByGuard = getSleepTimesByGuard(shifts)

    let winner = {
        guardId: null,
        maxMinute: -1,
        maxSlept: -1
    }
    Object.entries(sleepTimesByGuard)
        .forEach(([guardId, sleepTimes]) => {
            sleepTimes.forEach((sleptMinutes, minute) => {
                if(sleptMinutes > winner.maxSlept){
                    winner.guardId = guardId
                    winner.maxSlept = sleptMinutes
                    winner.maxMinute = minute
                }
            })
        })

    return Number(winner.guardId) * winner.maxMinute
}

console.log(part1())
console.log(part2())