module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true
  },
  extends: [
    "standard"
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    quotes: ["error", "double", { allowTemplateLiterals: true }],
    semi: ["error", "always"],
    "comma-dangle": ["error", {
      arrays: "never",
      objects: "only-multiline",
      imports: "only-multiline",
      exports: "only-multiline",
      functions: "only-multiline"
    }],
    "space-before-function-paren": ["error", {
      anonymous: "never",
      named: "never",
      asyncArrow: "always"
    }],
    eqeqeq: ["error", "always"],
    complexity: ["error", 12],
    "max-len": ["error", { code: 120, comments: 80, ignoreUrls: true }],
    "max-depth": ["error", 4],
    "max-lines-per-function": 0,
    "no-unreachable": 2,
    "consistent-return": 0,
    "no-return-await": 2,
    "no-return-assign": 2,
    "no-multiple-empty-lines": ["error", { max: 1, maxBOF: 1, maxEOF: 1 }],
    "lines-between-class-members": ["error", "always", { exceptAfterSingleLine: true }],
    indent: ["error", 2]
  }
};
