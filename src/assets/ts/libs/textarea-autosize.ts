document.addEventListener('DOMContentLoaded', () => {
    const textAreas = document.querySelectorAll('.textarea')

    for (const textArea of textAreas) {
        const textAreaControl = textArea.querySelector('.textarea__control') as
            | HTMLTextAreaElement
            | undefined

        textAreaControl?.addEventListener('input', () => {
            const { maxLength, value } = textAreaControl
            textAreaControl.style.height = 'auto'
            textAreaControl.style.height = `${textAreaControl.scrollHeight}px`

            if (value.length >= maxLength) {
                textArea.classList.add('textarea--error')
                return
            }

            textArea.classList.remove('textarea--error')
        })
    }
})
