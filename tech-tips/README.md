# tech tips
This a list of technical tips in different fields of software engineering

## 1. general

### generate dynamic data in pdf format

*problem:* is required to download or generate a pdf with a specific format but having dynamic data. 
*solution:* avoid to generate the whole pdf document in code, instead, in a pdf tool, design a pdf form having the desire static format and add the form fields. 

Then with a library (https://pdf-lib.js.org/) the fields can be load:
```js
async function getFieldsInDocument() {

    const pdfDoc = await PDFDocument.load('path/url to pdf file');
    const form = pdfDoc.getForm();
    const fields = form.getFields();

    let newFields = []; 

    fields.forEach((field) => {
        const type = field.constructor.name;
        const name = field.getName();
        newFields.push({ type: type, name: name });
    });
    ...
}
```

now replace the fields with the values required
```js
function updateFields(field,value) {
    const newFields = newFields.filter((x)=>x.name !== field);
    const currentFields = [...newFields,{name:field,value:value}];
}
```

then finally write back the pdf to disk, buffer or send it as an http response.
```js
  async function updatePDF() {

    const formPdfBytes = source_PDFBuffer;

    const pdfDoc = await PDFDocument.load(formPdfBytes);

    const form = pdfDoc.getForm();
    const page = pdfDoc.getPage(0);

    for (let index = 0; index < updatedFields.length; index++) {
      const element = updatedFields[index];
      form.getTextField(element.name).setText(element.value);
    }
    
    const psource_PDF = await pdfDoc.save();

    const bytesfile = new Uint8Array(psource_PDF);
    const blob = new Blob([bytesfile], { type: "application/pdf" });
    const docUrl = URL.createObjectURL(blob);
    setUpdated_PDF(docUrl);

    downloadPDF(pdfDoc);
  
  }
```

> ing. luis diego aguilar

=============================================

## 2. frontend

### responsive design - internationalization

English is written from left to right and top to bottom, but not all languages are written this way. Some languages like Arabic and Hebrew read from right to left, and some Japanese typefaces read vertically instead of horizontally. To accommodate these writing modes, logical properties were introduced in CSS.

Whereas the directional property margin-left always refers to the margin on the left side of a content box, the logical property margin-inline-start refers to the margin on the left side of a content box in a left-to-right language, and the margin on the right side of a content box in a right-to-left language. 

Don't 
```css
.byline {
	text-align: right;
}
```
Do 
```css
.byline {
	text-align: end;
}
```

When CSS has a specific directional value like left or right, there's a corresponding logical property. Where once we had margin-left now we also have margin-inline-start.
In a language like English where text flows from left to right, inline-start corresponds to "left" and inline-end corresponds to "right". 

Likewise, in a language like English where the text is written from top to bottom, block-start corresponds to "top" and block-end corresponds to "bottom." 

Don't 
```css
label {
  margin-right: 0.5em;
}
```
Do 
```css
label {
  margin-inline-end: 0.5em;
}
```

You can mimic the effect of seeing your pages in a right-to-left language by using the dir attribute on your html element. A value of ltr means "left to right." A value of "rtl" means "right to left." 

```html
<body dir="rtl">
  <h1>Form fields</h1>
  <form>
    <section>
      <label for="namefield">Name</label>
      <input type="text" id="namefield">
    </section>
    <section>
      <label for="emailfield">Email</label>
      <input type="email" id="emailfield">
    </section>
  </form>
</body>
```
```css
section {
  margin-block-start: 1rem;
  display: flex;
  flex-direction: row;
}

h1 {
  margin-inline-start: 2rem;
}

label {
  display: inline-block;
  width: 100%;
  max-width: 3em;
  text-align: start;
  margin-inline-end: 1em;
  margin-inline-start: 2rem;
}

input {
  width: 100%;
  max-width: 16em;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  border: 3px solid #555;
  margin-inline-end: 2rem;
}
```
> ing. alejandro arce

### responsive design - identify page language
```html
<html lang="en">
```
This is for a page in English.

This is for a page using US English:
```html
<html lang="en-us">
```

Declaring the language is useful for search engines. It's also useful for assistive technologies like screen readers and voice assistants to  prononunce your content correctly.

The lang attribute can go on any HTML element, in this case, one word is in German:
```html
<p>I felt some <span lang="de">schadenfreude</span>.</p>
```

The hreflang attribute takes the same language code notation as the lang attribute and describes the linked document's language. If there's a translation of your entire page available in German, link to it like this:

```html
<a href="/path/to/german/version" hreflang="de">German version</a>
```

If you use text in German to describe the link to the German version, use both hreflang and lang. Here, the text "Deutsche Version" is marked up as being in the German language, and the destination link is also marked up as being in German:

```html
<a href="/path/to/german/version" hreflang="de" lang="de">Deutsche Version</a>
```

You can also use the hreflang attribute on the link element. This goes in the head of your document:

```html
<link href="/path/to/german/version" rel="alternate" hreflang="de">
```

Unlike the lang attribute, hreflang can only be applied to link elements.

Make sure your line-height values can accommodate characters like accents and other diacritics. Lines of text that look fine in English might overlap in a different language.

Don't create images that have text in them. If you do, you'll have to create separate images for each language. Instead, separate the text and the image, and use CSS to overlay the text on the image.

> ing. alejandro arce

### responsive design - typography
It's difficult to know what size text on the web should be.

While you can't know for certain how far away someone is from a screen, you can try to use text sizes that will hopefully turn out to be appropriate. Use smaller text sizes for smaller screens and larger text sizes for larger screens.

You can use media queries to change the font-size property as the screen size gets wider.

```css
@media (min-width: 30em) {
  html {
    font-size: 125%;
  }
}

@media (min-width: 40em) {
  html {
    font-size: 150%;
  }
}

@media (min-width: 50em) {
  html {
    font-size: 175%;
  }
}

@media (min-width: 60em) {
  html {
    font-size: 200%;
  }
}
```

It's important that you don't use the vw by itself in a font-size declaration.
Don't

```css
html {
  font-size: 2.5vw;
}
```

If you do, the user won't be able to resize the text. The text will be resizable if you mix in a relative unit—like em, rem or ch. The CSS calc() function is perfect for this.

You probably don't want your text to shrink and grow to extremes. You can control where the scaling starts and ends using the CSS clamp() function. This “clamps” the scaling to a specific range.

The clamp() function is like the calc() function but it takes three values. The middle value is the same as what you pass to calc(). The opening value specifies the minimum size, in this case 1rem so as to not go below the user's preferred font size. The closing value specifies the maximum size.

```css
html {
  font-size: clamp(1rem, 0.75rem + 1.5vw, 2rem);
}
```

Now the text size shrinks and grows in proportion to the user's screen but the text size will never go below 1rem or above 2rem.

You can't set a line length directly in CSS. There is no line-length property. But you can stop text from getting too wide by limiting how wide the container can be. The max-inline-size property is perfect for this.
Don't set your line-lengths with a fixed unit like px. Users can scale their font size up and down and your line lengths should adjust accordingly. Use a relative unit like rem or ch. 

Don't
```css
article {
  max-inline-size: 700px;
}
```

Do
```css
article {
  max-inline-size: 66ch;
}
```

Using ch units for width will cause new lines to wrap at the 66th character at that font size.

Use unitless values for your line-height declarations. This ensures that the line height is relative to the font-size. 

Don't
```css
line-height: 24px;
```
Do
```css
line-height: 1.5;
```

An empty alt attribute is not the same as a missing alt attribute. Always provide an alt attribute even if an image is presentational and the alt attribute has no content.

Usually the alt attribute describes the contents of the image (“Three horizontal lines.”) but with standalone icons, the alt attribute describes the meaning of the image (“Menu”).

> ing. alejandro arce

### responsive design - accesibility

In general it's not a good idea to rely purely on color to differentiate between different elements. For example, you can—and should—make your links a different color to the surrounding text. But you should also apply some other styling indicator like underlining the links or making them bold.

Don't
```css
a {
  color: red;
}
```
Do
```css
a {
  color: red;
  font-weight: bold;
}
```

Keyboard navigation

Not everyone uses a mouse or a trackpad to navigate web pages. A keyboard is another way of getting around a page, with the tab key being particularly useful. Users can quickly move from one link or form field to the next.
Links styled with the :hover and :focus pseudo-classes, will display those styles regardless of whether someone is using a mouse, a trackpad, or a keyboard. Use the :focus-visible pseudo-class to style your links for just keyboard navigation. You can make those styles extra noticeable.

```css
a:focus,
a:hover {
  outline: 1px dotted;
}
a:focus-visible {
  outline: 3px solid;
}
```

> ing. alejandro arce

## 3. backend

### restful naming conventions

REST is an acronym for REpresentational State Transfer and an architectural style for distributed hypermedia systems. Roy Fielding first presented it in 2000 in his famous dissertation. Like other architectural styles, REST has its guiding principles and constraints. These principles must be satisfied if a service interface needs to be referred to as RESTful.

In REST, the primary data representation is called resource. Having a consistent and robust REST resource naming strategy will prove one of the best design decisions in the long term.

Any concept that might be the target of an author’s hypertext reference must fit within the definition of a resource. A resource is a conceptual mapping to a set of entities, not the entity that corresponds to the mapping at any particular point in time. REST provides 4 types of resources:

- **collection:** plural nouns, */somecontext/users*
- **document:** singular noun, */somecontext/users/{userid}*
- **store**: plural noun inside a single document, */somecontext/users/{userid}/wishlists*
- **controller**: verbs acting over a resource or document, */somecontext/users/{userid}/export*

Want to know more about REST guidelines and naming conventions

https://restfulapi.net/

https://restfulapi.net/resource-naming/

[watch the video](https://1drv.ms/v/s!ApqDVCYL8CG8jYgiFl4thvty4XZsSA?e=ZzMXAo)

> msc. rodrigo nunez 

=============================================