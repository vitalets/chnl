import banner from 'rollup-plugin-banner';
import analyze from 'rollup-plugin-analyzer';
import pkg from './package.json';

export default [
  {
    input: 'src/index.js',
    output: {
      file: pkg.main,
      format: 'cjs',
    },
    plugins: [
      getBanner(),
      analyze({summaryOnly: true}), // analyze once
    ]
  },
  {
    input: 'src/index.js',
    output: {
      file: pkg.module,
      format: 'es'
    },
    plugins: [
      getBanner(),
    ]
  }
];

function getBanner() {
  return banner('<%= pkg.name %> v<%= pkg.version %> by <%= pkg.author.name %>');
}
