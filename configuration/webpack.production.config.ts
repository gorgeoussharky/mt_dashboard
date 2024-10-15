import { merge } from 'webpack-merge'
import type { Configuration } from 'webpack'
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin'
import { EsbuildPlugin } from 'esbuild-loader'
import CSSMinimizerWebpackPlugin, {
    CssNanoOptionsExtended,
} from 'css-minimizer-webpack-plugin'
import lightningcss from 'lightningcss'
import browserslist from 'browserslist'
// @ts-expect-error no types for plugin
import { FaviconsBundlerPlugin } from 'html-bundler-webpack-plugin/plugins'
import CopyPlugin from 'copy-webpack-plugin'
import baseConfig from './webpack.config'
import { imageFileNameGenerator } from '@/utils/utils'


interface CSSMinifierOptions extends CssNanoOptionsExtended {
    targets: object
}

const config: Configuration = merge(baseConfig, {
    mode: 'production',
    output: {
        publicPath: process.env.IS_WP
            ? `${process.env.WP_SUBFOLDER}/wp-content/themes/${process.env.WP_THEME_NAME}/`
            : undefined,
    },
    devtool: false,
    /* Optimization configuration */
    optimization: {
        minimize: true,
        minimizer: [
            new CSSMinimizerWebpackPlugin<CSSMinifierOptions>({
                minify: CSSMinimizerWebpackPlugin.lightningCssMinify,
                minimizerOptions: {
                    targets: lightningcss.browserslistToTargets(
                        browserslist('>= 0.1%'),
                    ),
                },
            }),
            new EsbuildPlugin({
                target: 'es6',
                css: false,
            }),
            new ImageMinimizerPlugin({
                test: /\.(jpe?g|png|gif)$/i,
                minimizer: {
                    implementation: ImageMinimizerPlugin.sharpMinify,
                    options: {
                        encodeOptions: {
                            jpeg: {
                                quality: 80,
                            },
                            webp: {
                                lossless: true,
                            },
                            avif: {
                                lossless: true,
                            },
                            png: {
                                quality: 80,
                            },
                        },
                    },
                },
                generator: [
                    {
                        preset: 'webp',
                        implementation: ImageMinimizerPlugin.sharpGenerate,
                        filename: ({filename}) => imageFileNameGenerator(filename!), 
                        options: {
                            encodeOptions: {
                                webp: {
                                    quality: 80,
                                },
                            },
                        },
                    },
                    {
                        preset: 'avif',
                        implementation: ImageMinimizerPlugin.sharpGenerate,
                        filename: ({filename}) => imageFileNameGenerator(filename!), 
                        options: {
                            encodeOptions: {
                                avif: {
                                    cqLevel: 33,
                                },
                            },
                        },
                    },
                ],
            }),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            new FaviconsBundlerPlugin({
                enabled: true,
                faviconOptions: {
                    path: '/', // favicons output path relative to webpack output.path
                    icons: {
                        android: true, // Create Android homescreen icon.
                        appleIcon: true, // Create Apple touch icons.
                        appleStartup: false, // Create Apple startup images.
                        favicons: true, // Create regular favicons.
                        yandex: true, // Create Yandex browser icon.
                    },
                },
            }),
            // new CopyPlugin({
            //     patterns: [
			// 	  { from: "public/favicon", to: "assets/favicon" },
            //       { from: "public/ogp.jpg" },
            //     ],
            //   }),
        ],
    },

    /* Performance treshold configuration values */
    performance: {
        maxEntrypointSize: 512_000,
        maxAssetSize: 512_000,
    },
})

export default config
