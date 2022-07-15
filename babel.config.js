module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: { esmodules: true },
        shippedProposals: true,
      },
    ],
    "@babel/preset-typescript",
  ],
};
