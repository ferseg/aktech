class Post {
  private title: string;
  private posttime: Date;
  private body: string;

  constructor(id: number) {
    this.title = "reina hormiga rinde homenaje "+id;
    this.posttime = new Date();
    this.body = "Party on king ant house for the new hole made under the mango tree";
  }

  public getTitle(): string {
    return this.title;
  }

  public getBody(): string {
    return this.body;
  }
};

class News {
  private title: string;
  private articleDate: Date;
  private pictures:Array<string>;
  private content: string;

  constructor(id: number) {
    this.title = "Cars on sale "+id;
    this.articleDate = new Date();
    this.pictures = new Array<string>();
    this.content = "Last week Tesla published hundred of cars with 50% discount";

    this.pictures.push("http://foto1.png");
    this.pictures.push("http://foto2.png");
  }
  
  public getTitle(): string {
    return this.title;
  }
  
  public getPicture(pIndex: number): string {
    return this.pictures[pIndex];
  }

  public getContent() : string {
    return this.content;
  }
};


class MyAnyTester {
  private articles:any[]; // auto XX, do not check the type on this variable

  constructor() {
    this.articles = [...Array(5)].map((_, i) => i%2==0? new News(i) : new Post(i)); 
  }

  public displayWithAny() {
    this.articles.map( article => console.log(article.getTitle()));
  }

  public displayOne() {
    var article = this.articles[Math.floor(Math.random()*this.articles.length)];
    console.log(article.getTitle());
    console.log(article.getContent());
    console.log(article.getBody());
  }

  public displayOneExplicit() {
    var article:any = this.articles[Math.floor(Math.random()*this.articles.length)];
    console.log(article.getTitle());
    console.log(article.getContent());
    console.log(article.getBody());
  }

  public processData(pArticle: any) {
    console.log(pArticle.getTitle());
    console.log(pArticle.getContent());
  }

  public getAny() : any {
    return this.articles[Math.floor(Math.random()*this.articles.length)];
  }

};


var tester =  new MyAnyTester();
tester.displayWithAny();
//tester.displayOne();
//tester.displayOneExplicit();
//tester.processData(new News(1111));
//tester.processData(new Post(2727));

// deal with uncertainty 
var myData: unknown;

myData = tester.getAny();

if (myData instanceof Post ) {
  console.log("Saco body: " + myData.getBody());
}

if (myData instanceof News ) {
  console.log("Saco Content: " + myData.getContent());
}
