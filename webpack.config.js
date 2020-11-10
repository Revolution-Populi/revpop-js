var path = require("path");

module.exports = {
    entry: "./dist/index.js",
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "revpopjs.cjs",
        library: "",
        libraryTarget: "commonjs"
    }
};
