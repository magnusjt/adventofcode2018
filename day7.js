const _ = require('lodash')
const fs = require('fs')
const data = fs.readFileSync('./day7.txt', 'utf8')

const list = data.split(/\r\n|\n|\r/g)
    .sort()
    .map(line => line.trim())
    .map(line => {
        const [all, left, right] = line.match(/Step (\w+) must be finished before step (\w+) can begin/)
        return {left, right}
    })

function pickWhereOnlyLeft(list){
    let left = new Set(list.map(({left}) => left))
    let right = new Set(list.map(({right}) => right))

    return [...left].filter(x => !right.has(x))
}
function pickWhereOnlyRight(list){
    let left = new Set(list.map(({left}) => left))
    let right = new Set(list.map(({right}) => right))

    return [...right].filter(x => !left.has(x))
}
function removeStepsLeft(list, steps){
    let stepsSet = new Set(steps)
    return list.filter(({left}) => !stepsSet.has(left))
}
function completeTask(list, task){
    return list.filter(({left}) => left !== task)
}

function getTaskTime(task){
    return 60 + task.charCodeAt(0) - 'A'.charCodeAt(0) + 1
}

function traverse(originalList, visit){
    let list = originalList

    while(list.length > 0){
        let steps = pickWhereOnlyLeft(list)
        visit(steps[0])
        list = removeStepsLeft(list, [steps[0]])
    }
    let steps = pickWhereOnlyRight(originalList)
    steps.forEach(step => visit(step))
}

function work(originalList){
    let time = 0
    let list = originalList
    let workers = []
    let nWorkers = 5

    for(let i = 1; i <= nWorkers; i++){
        workers.push({
            task: '.',
            completeAt: 0,
            completed: true
        })
    }

    let completed = new Set()

    while(true){
        for(let worker of workers){
            if(time >= worker.completeAt && !worker.completed){
                list = completeTask(list, worker.task)
                completed.add(worker.task)
                worker.completed = true
                worker.task = '.'
            }
        }

        let availableTasks = pickWhereOnlyLeft(list)
        availableTasks = availableTasks.filter(task => !workers.some(worker => worker.task === task))

        for(let worker of workers){
            if(worker.completed && availableTasks.length > 0){
                let nextTask = availableTasks.shift()
                worker.task = nextTask
                worker.completeAt = time + getTaskTime(nextTask)
                worker.completed = false
            }
        }

        if(workers.every(worker => worker.completed)){
            break
        }
        console.log(time, workers.map(worker => worker.task), [...completed].join(''))
        time++
    }

    let [lastTask] = pickWhereOnlyRight(originalList)
    time += getTaskTime(lastTask)
    completed.add(lastTask)
    console.log(time, lastTask, [...completed].join(''))
    console.log([...completed].join(''))
    return time
}

function part1(){
    const steps = []
    traverse(list, step => {
        steps.push(step)
    })

    return steps.join('')
}

function part2(){
    return work(list)
}

console.log(part1())
console.log(part2())