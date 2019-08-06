const version = require('./package.json').version;

module.exports = () => ({
    presets: [
        require("babel-preset-env"),
    ],
    plugins: [
        [
            require("babel-plugin-search-and-replace"),
            [{
                "search": "<%= version %>",
                "replace": version
            }]
        ],
        require("babel-plugin-transform-remove-console"),
        require("babel-plugin-transform-class-properties"),
        require("babel-plugin-transform-object-rest-spread")
    ]
})