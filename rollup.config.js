import analyze from 'rollup-plugin-analyzer';
import babel from 'rollup-plugin-babel';
import pkg from './package.json';

const banner = `/* ${pkg.name} v${pkg.version} by ${pkg.author.name} */`;

export default [
  {
    input: 'src/index.js',
    output: {
      file: pkg.main,
      format: 'cjs',
      banner,
    },
    plugins: [
      babel({
        exclude: 'node_modules/**' // only transpile our source code
      }),
      analyze({summaryOnly: true}), // analyze once
    ]
  },
  // disable esm build as it breaks in transitive dependency: e.g. app -> some-lib -> chnl
  // {
  //   input: 'src/index.js',
  //   output: {
  //     file: pkg.module,
  //     format: 'es',
  //     banner
  //   },
  // }
];
