import banner from 'rollup-plugin-banner';
import babel from 'rollup-plugin-babel';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.umd.js',
    name: 'Channel',
    format: 'umd'
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    banner('<%= pkg.name %> v<%= pkg.version %> by <%= pkg.author.name %>')
  ]
};
