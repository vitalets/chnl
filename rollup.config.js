import analyze from 'rollup-plugin-analyzer';
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
      analyze({summaryOnly: true}), // analyze once
    ]
  },
  {
    input: 'src/index.js',
    output: {
      file: pkg.module,
      format: 'es',
      banner
    },
  }
];
