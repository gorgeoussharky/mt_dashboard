import ProgressBar from 'progressbar.js'

document.addEventListener('DOMContentLoaded', () => {
    const circles = document.querySelectorAll('[data-progress-circle]') as unknown as NodeListOf<HTMLElement>

    for (const circle of circles) {
        const { progress } = circle.dataset
        const progressNumber = Number.parseInt(progress ?? '0', 10)

        const bar = new ProgressBar.Circle(circle, {
            strokeWidth: 6,
            easing: 'easeInOut',
            duration: 1400,
            color: '#0043ce',
            trailColor: '#d0e2ff',
            trailWidth: 6,
        })

        bar.animate(progressNumber / 100)
        bar.path.style.strokeLinecap = 'round'
    }
})
