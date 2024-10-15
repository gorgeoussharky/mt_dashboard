import { merge } from 'webpack-merge'
import type { Configuration } from 'webpack'

import baseConfig from './webpack.config'

import environment from './webpack.environment'
import 'webpack-dev-server'

const config: Configuration = merge(baseConfig, {
    mode: 'development',
    devtool: 'eval-source-map',
    devServer: {
        open: false,
        hot: true,
        watchFiles: {
            paths: [environment.paths.source],
            options: {
                usePolling: true,
            },
        },
        static: environment.paths.public,
        client: {
            progress: true,
            logging: 'none',
            overlay: {
                warnings: false,
                errors: true,
            },
        },
        historyApiFallback: true,
        compress: true,
        host: '0.0.0.0',
        port: 8000,
    },

    optimization: {
        minimize: false,
    },
})

export default config
