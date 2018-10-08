const version = require('./package.json').version;

module.exports = () => ({
    presets: [
        require("babel-preset-metal"),
    ],
    plugins: [
        [
            require("babel-plugin-search-and-replace"),
            [{
                "search": "<%= version %>",
                "replace": version
            }]
        ],
        require("babel-plugin-transform-remove-console")
    ]
})