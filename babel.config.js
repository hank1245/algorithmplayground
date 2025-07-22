module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          chrome: "58",
        },
        useBuiltIns: "usage",
        corejs: {
          version: 3,
        },
      },
    ],
  ],
};
