import typescript from "@rollup/plugin-typescript";
import babel from "@rollup/plugin-babel";
export default {
    input: "src/index.ts",
    output: {
        dir: "dist",
        format: "cjs",
        sourcemap: true,
    },
    plugins: [
        typescript(),
        babel({
            extensions: [".js", ".jsx", ".ts", ".tsx"],
            babelHelpers: "bundled",
            presets: ["@babel/preset-react"],
        }),
    ],
    external: ["react", "react-dom", "tailwindcss", "@mak-stack/mak-ui", "dayjs", "dayjs/plugin/isoWeek"],
};
