import sizeOf from 'image-size'
import path from 'node:path'
import enviroments from '../../configuration/webpack.environment'

const imageSize = (
    src: string,
    unlazy: boolean,
    block: {
        fn: (args: { width: number; height: number, baseWidth: number, baseHeight: number, src: string, unlazy?: boolean }) => void
    },
) => {
    const url = path.resolve(__dirname, src.replace('@', enviroments.paths.source))
    const { width, height } = sizeOf(url)

    const baseWidth = width ?? 0
    const baseHeight = height ?? 0

    return block.fn({ width: baseWidth / 2, height: baseHeight / 2, baseWidth, baseHeight, src, unlazy })
}

export default imageSize
