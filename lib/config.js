var Immutable = require("immutable");

var defaults = Immutable.fromJS({
    /**
     * Global log level
     */
    logLevel: "info",
    /**
     * Should posts be rendered using Markdown?
     */
    markdown: true,
    /**
     *
     */
    inlineErrors: true,
    /**
     *
     */
    base: process.cwd(),
    /**
     * Should code snippets be auto-highlighted?
     */
    highlight: true,
    /**
     * Should ALL code fences be auto-highlighted?
     */
    autoHighlight: false,
    /**
     * Data format for posts
     */
    dateFormat: "LL", // http://momentjs.com/docs/#/utilities/
    /**
     * Post url format, eg: /blog/:year/:month/:title
     */
    urlFormat: {
        "page": "/:filename"
    },
    /**
     * Instead of `blog/post1.html,` you can have `blog/post1` instead
     */
    prettyUrls: false,
    /**
     * Padd content blocks to enable nicer source code
     */
    prettyMarkup: true,
    /**
     * Should extra `\n` be striped from markup?
     * <p>Hi</p>
     *
     * <span>Bye</span>
     *
     * Would become:
     * <p>Hi</p>
     * <span>Bye</span>
     */
    markup: {
        stripNewLines: false
    },
    /**
     * No layouts by default.
     */
    defaultLayout: false,
    /**
     * Initial Site config
     */
    siteConfig: {},
    /**
     * Set lookup DIRS for layouts & includes
     */
    dirs: {
        "layouts":   "_layouts",
        "includes":  "_includes"
    },
    /**
     * Global error handler
     */
    errorHandler: function (err, compiler) {
        compiler.logger.error(compiler.getErrorString(err));
    }
});

module.exports.merge = function (config) {
    return defaults.mergeDeep(config);
};