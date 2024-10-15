import path from 'node:path'

const config = {
    paths: {
        imgs: path.resolve(__dirname, '../src/assets/img'),
        source: path.resolve(__dirname, '../src/'),
        output: path.resolve(__dirname, '../dist/'),
        public: path.resolve(__dirname, '../public'),
        nodeModules: path.resolve(__dirname, '../node_modules'),
    },
    limits: {
         /* Image files size in bytes. Below this value the image file will be served as DataURL (inline base64). */
        images: 0,
         /* Font files size in bytes. Below this value the font file will be served as DataURL (inline base64). */
        fonts: 0,
    },
}

export default config
