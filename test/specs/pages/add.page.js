var assert    = require("chai").assert;
var crossbow  = require("../../../index");

describe("Adding a page", function() {

    it("Add 1 page & compile", function(done) {

        var site = crossbow.builder();

        var index = site.add({key: "src/docs/index.html", content: "<p>{{itemTitle}} is rad, {{page.url}}, {{site.title}}</p>"});
        var about = site.add({key: "src/docs/about.html", content: "<div>About page</div>"}); //jshint ignore:line

        assert.equal(index.get("key"),   "src/docs/index.html");
        assert.equal(index.get("url"),   "/src/docs/index.html");
        assert.equal(index.get("filepath"), "src/docs/index.html");
        assert.equal(index.get("title"), "Index");

        assert.equal(site.cache.byType("page").size, 2);

        var collection = site.cache.byType("page");

        assert.equal(collection.get(0).get("url"), "/src/docs/index.html");
        assert.equal(collection.get(0).get("title"), "Index");
        assert.equal(collection.get(1).get("url"), "/src/docs/about.html");
        assert.equal(collection.get(1).get("title"), "About");

        site.freeze();

        site.compile({
            item: index,
            data: {
                site: {
                    title: "browsersync"
                },
                itemTitle: "Crossbow"
            },
            cb: function (err, out) {
                assert.include(out.get("compiled"), "<p>Crossbow is rad, /src/docs/index.html, browsersync</p>");
                done();
            }
        });
    });
    it("Add 1 page & compile with layouts", function(done) {

        var site = crossbow.builder({
            config: {
                base: "test/fixtures"
            }
        });

        var item = site.add({key: "src/docs/index.html", content: "---\nlayout: 'docs.html'\n---\n<p>{{itemTitle}} is rad, {{page.url}}, {{site.title}}</p>"});

        site.freeze();

        assert.equal(item.get("key"),   "src/docs/index.html");
        assert.equal(item.get("url"),   "/src/docs/index.html");
        assert.equal(item.get("title"), "Index");

        assert.equal(site.cache.byType("page").size, 1);
        assert.equal(site.cache.byType("page").get(0).get("title"), "Index");
        assert.equal(site.cache.byType("page").get(0).get("url"), "/src/docs/index.html");

        site.compile({
            item: item,
            data: {
                site: {
                    title: "browsersync"
                },
                itemTitle: "Crossbow"
            },
            cb: function (err, out) {

                if (err) {
                    done(err);
                } else {
                    assert.include(out.get("compiled"), "<h1>Parent Layout</h1>");
                    assert.include(out.get("compiled"), "<p>Crossbow is rad, /src/docs/index.html, browsersync</p>");
                    done();
                }
            }
        });
    });
});