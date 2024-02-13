declare namespace _default {
    let input: string;
    namespace output {
        let dir: string;
        let format: string;
        let sourcemap: boolean;
    }
    let plugins: import("rollup").Plugin[];
    let external: string[];
}
export default _default;
