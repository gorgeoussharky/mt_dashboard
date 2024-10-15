document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll(
        '.additional-info-item',
    ) as unknown as NodeListOf<HTMLDivElement>

    for (const item of items) {
        const expandButton = item.querySelector('.additional-info-item__expand') as HTMLButtonElement | undefined

        expandButton?.addEventListener('click', () => {
            item.classList.toggle('additional-info-item--expanded')
        })
    }
})