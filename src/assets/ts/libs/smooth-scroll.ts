import Lenis from 'lenis'

export const lenis = new Lenis({
    lerp: 0.07,
})

const raf = (time: number) => {
    lenis.raf(time)
    requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
        if (
            mutation.type === 'attributes' &&
            mutation.attributeName === 'class'
        ) {
            if (document.documentElement.classList.contains('locked')) {
                lenis.stop()
            } else {
                lenis.start()
            }
        }
    }
})

const config = { attributes: true, attributeFilter: ['class'] }

observer.observe(document.documentElement, config)
