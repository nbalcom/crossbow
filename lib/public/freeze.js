/**
 * Freeze internal data, further mutations are not permitted
 * to any data following the calling of this function.
 */
module.exports = function freeze () {

    var compiler = this;

    compiler.defaultData   = compiler.defaultData.toJS();

    compiler.frozen        = {};

    Object.keys(compiler.types).forEach(function (type) {

        /**
         * Apply per-type filters, if any
         */
        var items  = compiler.cache.byType(type, compiler.config.getIn(["filters", "type:" + type])).toJS();

        /**
         * Apply per-type sorting, if any
         */
        if (compiler.types[type].sort) {
            items = compiler.types[type].sort(items);
        }

        /**
         * Now apply the plural name as a property - for example: pages, posts etc.
         */
        compiler.frozen[type + "s"] = items;

    });

    /**
     *
     */
    compiler.mergeData(compiler.defaultData, compiler.frozen);

    /**
     * Transform Global data
     */
    compiler.globalData = transFormGlobalData({scope: "before item parsed", compiler: compiler, item: compiler.item});
};

/**
 *
 * @param {{compiler: Compiler, scope: string, item: Compiler.item}} opts
 * @returns {*}
 */
function transFormGlobalData (opts) {

    var transforms = opts.compiler.pluginManager.hook("dataTransforms", opts.compiler);

    require("lodash").each(transforms, function (plugin) {
        if (plugin.when === opts.scope) {
            opts.compiler.globalData = plugin.fn(opts);
        }
    });

    return opts.compiler.globalData;
}