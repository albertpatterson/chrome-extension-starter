export function getTsCompilerOptions(isProd) {
  const prodOptions = {
    outDir: './dist/unpacked',
    noImplicitAny: true,
    module: 'es6',
    target: 'es5',
    jsx: 'react',
    allowJs: true,
    moduleResolution: 'node',
  };

  if (isProd) {
    return prodOptions;
  }

  return { ...prodOptions, sourceMap: true };
}
