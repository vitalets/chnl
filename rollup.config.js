import banner from 'rollup-plugin-banner';
import pkg from './package.json';

export default {
  input: 'src/index.js',
  output: [
    { file: pkg.main, format: 'cjs' },
    { file: pkg.module, format: 'es' }
  ],
  plugins: [
    banner('<%= pkg.name %> v<%= pkg.version %> by <%= pkg.author.name %>')
  ]
};
