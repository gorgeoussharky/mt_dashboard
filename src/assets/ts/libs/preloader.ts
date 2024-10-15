document.documentElement.style.overflow = 'hidden'

window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader') as HTMLElement | undefined

    let timeout: NodeJS.Timeout

    const preloaderFadeOut = () => {
        if (!preloader) return
    
        preloader.style.transition = 'opacity 750ms'
        preloader.style.opacity = '0'
        document.documentElement.style.overflow = ''
    
        clearTimeout(timeout)
    
        timeout = setTimeout(() => {
            preloader.style.display = 'none'
        }, 750)
    }

    preloaderFadeOut()
})

export {}