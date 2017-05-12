var typescript = require('rollup-plugin-typescript');

module.exports = {
    entry: './src/index.ts',
    dest: './dist/steel-scene.js',
    format: 'iife',
    moduleName: 'steel',
    plugins: [
        typescript({
            moduleResolution: "node",
            newLine: "LF",
            rootDir: "src",
            target: "es5",
            tsconfig: false,
            typescript: require('typescript'),
            allowUnreachableCode: false,
            allowUnusedLabels: false,
            declaration: false,
            forceConsistentCasingInFileNames: true,
            inlineSourceMap: false,
            noFallthroughCasesInSwitch: true,
            noImplicitAny: false,
            noImplicitReturns: false,
            noImplicitUseStrict: true,
            noImplicitThis: true,
            noUnusedLocals: true,
            preserveConstEnums: false,
            removeComments: true,
            sourceMap: false,
            strictNullChecks: false,
            suppressImplicitAnyIndexErrors: true
        })
    ]
};
