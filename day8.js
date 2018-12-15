const _ = require('lodash')
const fs = require('fs')
const data = fs.readFileSync('./day8.txt', 'utf8')
//const data = '2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2'
const nums = data.split(' ').map(Number)

function readNode(nums, index){
    const nChildren = nums[index++]
    const nMeta = nums[index++]

    let children = []
    for(let n = 1; n <= nChildren; n++){
        const res = readNode(nums, index)
        children.push(res.node)
        index = res.index
    }

    let meta = []
    for(let n = 1; n <= nMeta; n++){
        meta.push(nums[index++])
    }

    return {index, node: {children, meta}}
}

function traverse(node, visit){
    visit(node)
    node.children.forEach(child => traverse(child, visit))
}

function nodeSum(node){
    if(node.children.length === 0){
        return node.meta.reduce((sum, num) => sum + num, 0)
    }

    return node.meta.reduce((sum, num) => {
        let index = num - 1
        if(index < 0) return sum
        if(index >= node.children.length) return sum
        return sum + nodeSum(node.children[index])
    }, 0)
}

function part1(){
    const {node} = readNode(nums, 0)

    let sum = 0
    traverse(node, node => {
        sum += node.meta.reduce((sum, num) => sum + num, 0)
    })
    return sum
}

function part2(){
    const {node} = readNode(nums, 0)
    return nodeSum(node)
}

console.log(part1())
console.log(part2())