var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var Post = /** @class */ (function () {
    function Post(id) {
        this.title = "reina hormiga rinde homenaje " + id;
        this.posttime = new Date();
        this.body = "Party on king ant house for the new hole made under the mango tree";
    }
    Post.prototype.getTitle = function () {
        return this.title;
    };
    Post.prototype.getBody = function () {
        return this.body;
    };
    return Post;
}());
;
var News = /** @class */ (function () {
    function News(id) {
        this.title = "Cars on sale " + id;
        this.articleDate = new Date();
        this.pictures = new Array();
        this.content = "Last week Tesla published hundred of cars with 50% discount";
        this.pictures.push("http://foto1.png");
        this.pictures.push("http://foto2.png");
    }
    News.prototype.getTitle = function () {
        return this.title;
    };
    News.prototype.getPicture = function (pIndex) {
        return this.pictures[pIndex];
    };
    News.prototype.getContent = function () {
        return this.content;
    };
    return News;
}());
;
var MyAnyTester = /** @class */ (function () {
    function MyAnyTester() {
        this.articles = __spreadArray([], Array(5), true).map(function (_, i) { return i % 2 == 0 ? new News(i) : new Post(i); });
    }
    MyAnyTester.prototype.displayWithAny = function () {
        this.articles.map(function (article) { return console.log(article.getTitle()); });
    };
    MyAnyTester.prototype.displayOne = function () {
        var article = this.articles[Math.floor(Math.random() * this.articles.length)];
        console.log(article.getTitle());
        console.log(article.getContent());
        console.log(article.getBody());
    };
    MyAnyTester.prototype.displayOneExplicit = function () {
        var article = this.articles[Math.floor(Math.random() * this.articles.length)];
        console.log(article.getTitle());
        console.log(article.getContent());
        console.log(article.getBody());
    };
    MyAnyTester.prototype.processData = function (pArticle) {
        console.log(pArticle.getTitle());
        console.log(pArticle.getContent());
    };
    MyAnyTester.prototype.getAny = function () {
        return this.articles[Math.floor(Math.random() * this.articles.length)];
    };
    return MyAnyTester;
}());
;
var tester = new MyAnyTester();
tester.displayWithAny();
//tester.displayOne();
//tester.displayOneExplicit();
//tester.processData(new News(1111));
//tester.processData(new Post(2727));
// deal with uncertainty 
var myData;
myData = tester.getAny();
if (myData instanceof Post) {
    console.log("Saco body: " + myData.getBody());
}
if (myData instanceof News) {
    console.log("Saco Content: " + myData.getContent());
}
