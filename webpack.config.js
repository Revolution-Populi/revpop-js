var path = require("path");

module.exports = {
    entry: "./dist/index.js",
    node: {
        child_process: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
      },
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "revpopjs.cjs",
        library: "",
        libraryTarget: "commonjs"
    }
};
