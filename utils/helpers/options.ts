interface Option {
    label: string
    value: string
}

const parseOptions = (
    options: string | Option[],
    block: {
        fn: (args: { options: Option[] }) => void
    },
) => {
    const optionsArray = () => {
        if (typeof options === 'string') {
            return options
                .split(',')
                .map((element: string) => ({ label: element, value: element }))
        }

        return options
    }

    return block.fn({
        options: optionsArray(),
    })
}

export default parseOptions
