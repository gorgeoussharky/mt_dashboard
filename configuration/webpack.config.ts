import path from 'node:path'

import { DefinePlugin, WebpackError } from 'webpack'
import { ConfigData, HtmlValidate, formatterFactory } from 'html-validate/node'
import type { Configuration } from 'webpack'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import ESLintPlugin from 'eslint-webpack-plugin'
import StylelintPlugin from 'stylelint-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import HtmlBundlerPlugin from 'html-bundler-webpack-plugin'
import dotenv from 'dotenv'

import environment from './webpack.environment'
import { fileNameGenerator, pages } from '../utils/utils'
import htmlValidateRules from '../.htmlvalidate.json'

// helpers
import equal from '../utils/helpers/equal'
import more from '../utils/helpers/more'
import multiply from '../utils/helpers/multiply'
import range from '../utils/helpers/range'
import slice from '../utils/helpers/slice'
import length from '../utils/helpers/length'
import parseOptions from '../utils/helpers/options'
import imageSize from '../utils/helpers/image-size'
import isSvg from '../utils/helpers/is-svg'

dotenv.config({ path: './.env' })

const htmlvalidate = new HtmlValidate({
    root: true,
    ...htmlValidateRules as ConfigData
})
const stylish = formatterFactory('codeframe')

const config: Configuration = {
    output: {
        path: environment.paths.output,
    },
    module: {
        rules: [
            // SCSS/CSS
            {
                test: /\.((c|sa|sc)ss)$/i,
                exclude: environment.paths.nodeModules,
                use: [
                    {
                        loader: 'css-loader',
                        options: {
                            import: false,
                            importLoaders: 3,
                        },
                    },
                    'svg-transform-loader/encode-query',
                    'postcss-loader',
                    'sass-loader',
                ],
            },
            // TS
            {
                test: /\.(ts|js)$/i,
                loader: 'esbuild-loader',
                options: {
                    target: 'esnext',
                },
                exclude: environment.paths.nodeModules,
            },
            // Images
            {
                test: /\.(png|gif|jpe?g)$/i,
                type: 'asset',
                 parser: {
                     dataUrlCondition: {
                         maxSize: environment.limits.images,
                     },
                },
                generator: {
                    filename({ filename }: { filename: string }) {
                        return fileNameGenerator(filename)
                    },
                },
            },
            {
                test: /\.svg$/,
                type: 'asset/resource',
                use: [
                    'svg-transform-loader',
                    {
                        loader: 'svgo-loader',
                        options: {
                            multipass: true,
                            js2svg: {
                                indent: 4,
                                pretty: true,
                            },
                            plugins: [
                                'removeDoctype',
                                'removeXMLProcInst',
                                'removeComments',
                                'removeMetadata',
                                'removeEditorsNSData',
                                'cleanupAttrs',
                                'mergeStyles',
                                'inlineStyles',
                                'minifyStyles',
                                'cleanupNumericValues',
                                'convertColors',
                                'removeUnknownsAndDefaults',
                                'removeNonInheritableGroupAttrs',
                                'removeUselessStrokeAndFill',
                                'removeViewBox',
                                'cleanupEnableBackground',
                                'removeEmptyText',
                                'convertShapeToPath',
                                'convertEllipseToCircle',
                                'moveElemsAttrsToGroup',
                                'moveGroupAttrsToElems',
                                'collapseGroups',
                                'convertPathData',
                                'convertTransform',
                                'removeEmptyAttrs',
                                'removeEmptyContainers',
                                'removeUnusedNS',
                                'mergePaths',
                                'sortAttrs',
                                'sortDefsChildren',
                                'removeTitle',
                                'removeDesc'
                            ]
                        },
                    },
                ],
                generator: {
                    filename({ filename }: { filename: string }) {
                        return fileNameGenerator(filename)
                    },
                },
            },
            // Videos
            {
                test: /\.(mp4|webm|mov)$/i,
                type: 'asset/resource',
                generator: {
                    filename({ filename }: { filename: string }) {
                        return fileNameGenerator(filename)
                    },
                },
            },
            {
                test: /\.(eot|ttf|woff|woff2)$/,
                type: 'asset',
                 parser: {
                     dataUrlCondition: {
                         maxSize: environment.limits.fonts,
                     },
                 },
                generator: {
                    filename({ filename }: { filename: string }) {
                        return fileNameGenerator(filename)
                    },
                },
            },
        ],
    },
    plugins: [
        new ESLintPlugin({
            extensions: ['js', 'ts'],
        }),
        new StylelintPlugin(),
        new ForkTsCheckerWebpackPlugin(),
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['**/*', '!stats.json'],
        }),
        new DefinePlugin({
            'process.env': JSON.stringify(process.env),
        }),
        new HtmlBundlerPlugin({
            entry: pages(),
            preprocessor: 'handlebars',
            preprocessorOptions: {
                partials: [path.resolve(environment.paths.source, 'pages/partials')],
                helpers: {
                    equal,
                    length,
                    more,
                    multiply,
                    range,
                    slice,
                    parseOptions,
                    imageSize,
                    isSvg,
                },
            },
            beforeEmit(content, { assetFile }, compilation) {
                if (process.env.NODE_ENV === 'development') {
                    return content
                }

                void htmlvalidate.validateString(content).then(report => {
                    if (!report.valid) {
                        compilation.errors.push(new WebpackError(`${assetFile} ${stylish(report.results)}`))
                        return false
                    }
                    return true
                })
                return content
            },
            watchFiles: {
                includes: [/\.(html|hbs|json)$/],
            },
            preload: [
                {
                    test: /\.(css|scss)$/,
                    as: 'style',
                },
                {
                    test: /.*\.woff2$/,
                    attributes: {
                        as: 'font',
                        type: 'font/woff2',
                        crossorigin: true,
                    },
                },
            ],
            js: {
                filename: process.env.NO_HASH
                    ? 'assets/js/app.js'
                    : 'assets/js/app.[contenthash:8].js',
                inline: process.env.NODE_ENV === 'development',
            },
            css: {
                filename: process.env.NO_HASH
                    ? 'assets/css/app.css'
                    : 'assets/css/app.[contenthash:8].css',
                inline: process.env.NODE_ENV === 'development',
            },
            loaderOptions: {
                sources: [
                    {
                        tag: 'a',
                        attributes: ['data-src'],
                    },

                ],
            }
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, environment.paths.source),
            '@assets': path.resolve(__dirname, environment.paths.source, 'assets'),
            '@img': path.resolve(__dirname, environment.paths.source, 'assets/img'),
        },
        extensions: ['.js', '.ts'],
    },
    target: 'web'
}

export default config
