import { resolve, extname } from 'node:path'
import { readdirSync, readFileSync } from 'node:fs'
import dotenv from 'dotenv'

import environment from '../configuration/webpack.environment'
import data from '../src/pages/data/data.json'

dotenv.config({ path: './.env' })

interface Page {
    import: string
    filename: string
    data: object
}


export const imageFileNameGenerator = (filename: string) => {
    const relativePath = filename.split(/[/\\]/)
    relativePath.splice(0, 3)
    relativePath.splice(-1, 1)

    const path = []

    const urlArray = filename.split(/[/\\]/)
    urlArray.pop()
    urlArray.reverse()

    for (const part of urlArray) {
        path.push(part)

        if (part === 'src') {
            break
        }
    }
    const pathString = path.reverse().join('/')

    if (process.env.NO_HASH === 'true') {
        return `${pathString}/[name][width]x[height][ext][query]`
    }
    return `${pathString}/[name][width]x[height][ext][query]`
}


export const fileNameGenerator = (filename: string) => {
    const relativePath = filename.split(/[/\\]/)
    relativePath.splice(0, 1)
    relativePath.splice(-1, 1)
    
    if (process.env.NO_HASH === 'true') {
        return `${relativePath.join('/')}/[name][ext][query]`
    }
    return `${relativePath.join('/')}/[name].[hash][ext][query]`
}

export const pages = () => {
    const result: Page[] = []

    const additionalPages = readdirSync(
        resolve(__dirname, environment.paths.source, 'pages'),
    ).filter(
        file =>
            extname(file).toLowerCase() === '.html' &&
            file.toLowerCase() !== 'index.html',
    )

    result.push({
        import: resolve(environment.paths.source, 'pages', 'index.html'),
        filename: 'index.html',
        data: {
            name: process.env.PROJECT_NAME,
            list: additionalPages.map((page: string) => {

                const pageContent = readFileSync(
                    resolve(__dirname, environment.paths.source, 'pages', page),
                    'utf8',
                )

                const titleComment = pageContent.match(
                    /<!-- Название страницы:(.*?) -->/,
                )

                return {
                    url: page,
                    title: titleComment ? titleComment[1] : page,
                }
            }),
        },
    })

    for (const template of additionalPages) {
        result.push({
            import: resolve(environment.paths.source, 'pages', template),
            filename: template,
            data: {
                ...data,
                meta: {
                    locale: process.env.LOCALE,
                    description: process.env.META_DESC,
                    ogUrl: process.env.OG_URL,
                    ogImage: process.env.OGP_IMG,
                    ogType: process.env.OG_TYPE,
                    twitterCard: process.env.TWITTER_CARD,
                    themeColor: process.env.THEME_COLOR,
                    backgroundColor: process.env.BACKGROUND_COLOR,
                }
            }
        })
    }

    return result
}
