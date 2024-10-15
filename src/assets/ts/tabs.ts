document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll(
        '[data-tabs]',
    ) as unknown as NodeListOf<HTMLDivElement>

    for (const tab of tabs) {
        const control = tab.querySelector(
            '[data-tabs-control]',
        ) as HTMLSelectElement | undefined
        const contents = tab.querySelectorAll(
            '[data-tabs-content]',
        ) as unknown as NodeListOf<HTMLElement>

        control?.addEventListener('change', () => {
            const { value } = control


            const selectedContent = tab.querySelector(
                `[data-tabs-content="${value}"]`,
            ) as HTMLElement | undefined

            console.log(selectedContent)

            if (selectedContent) {
                for (const otherContent of contents) {
                    otherContent.style.display = 'none'
                }

                selectedContent.style.display = 'block'
            }
        })
    }
})
