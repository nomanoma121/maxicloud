import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  preflight: true,
  include: ["./app/**/*.{js,jsx,ts,tsx}"],
  exclude: [],
  theme: {
    containerNames: ["dashboard"],
    extend: {
      tokens: {
        gradients: {
          primary: {
            value: {
              type: "linear",
              placement: "to right bottom",
              stops: ["#34AA8E", "#63C178"],
            },
          },
        },
      },
    },
  },
  shorthands: false,
  minify: true,
  hash: true,
  outdir: "styled-system",
});
