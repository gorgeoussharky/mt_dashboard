const range = (n: number, block: { fn: (args: { i: number, '@first': boolean }) => string }) => {
    let accum = ''
    for (let index = 0; index < n; index += 1) accum += block.fn({ i: index, '@first': index === 0 })
    return accum
}

export default range
