import { animate } from 'motion'

export const fadeOverlay = async (type: 'in' | 'out') => {
    const overlay = document.querySelector('.overlay') as
        | HTMLDivElement
        | undefined

    if (!overlay) return

    if (type === 'in') {

        await animate(
            overlay,
            { opacity: [0, 1], display: 'block' },
            { duration: 0.5 },
        ).finished
        return
    }

    await animate(
        overlay,
        { opacity: [1, 0], display: 'none' },
        { duration: 0.5 },
    ).finished

}
