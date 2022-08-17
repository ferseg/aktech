# tech tips
This a list of technical tips in different fields of software engineering

## 1. general

### generate dynamic data in pdf format

*problem:* is required to download or generate a pdf with a specific format but having dynamic data. 
*solution:* avoid to generate the whole pdf document in code, instead, in a pdf tool, design a pdf form having the desire static format and add the form fields. 

Then with a library (https://pdf-lib.js.org/) the fields can be load:
```
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
```
function updateFields(field,value) {
    const newFields = newFields.filter((x)=>x.name !== field);
    const currentFields = [...newFields,{name:field,value:value}];
}
```

then finally write back the pdf to disk, buffer or send it as an http response.
```
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

> code courtesy and research by luis diego aguilar

=============================================

## 2. frontend

### responsive design - internationalization

English is written from left to right and top to bottom, but not all languages are written this way. Some languages like Arabic and Hebrew read from right to left, and some Japanese typefaces read vertically instead of horizontally. To accommodate these writing modes, logical properties were introduced in CSS.

Whereas the directional property margin-left always refers to the margin on the left side of a content box, the logical property margin-inline-start refers to the margin on the left side of a content box in a left-to-right language, and the margin on the right side of a content box in a right-to-left language. 

Don't 
```
		.byline {
		  text-align: right;
		}
```
Do 
```
		.byline {
		  text-align: end;
		}
```

When CSS has a specific directional value like left or right, there's a corresponding logical property. Where once we had margin-left now we also have margin-inline-start.
In a language like English where text flows from left to right, inline-start corresponds to "left" and inline-end corresponds to "right". 

Likewise, in a language like English where the text is written from top to bottom, block-start corresponds to "top" and block-end corresponds to "bottom." 

Don't 
```
		label {
		  margin-right: 0.5em;
		}
```
Do 
```
		label {
		  margin-inline-end: 0.5em;
		}
```

You can mimic the effect of seeing your pages in a right-to-left language by using the dir attribute on your html element. A value of ltr means "left to right." A value of "rtl" means "right to left." 

```
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

## 3. backend

### restful naming conventions

REST is an acronym for REpresentational State Transfer and an architectural style for distributed hypermedia systems. Roy Fielding first presented it in 2000 in his famous dissertation. Like other architectural styles, REST has its guiding principles and constraints. These principles must be satisfied if a service interface needs to be referred to as RESTful.

In REST, the primary data representation is called resource. Having a consistent and robust REST resource naming strategy will prove one of the best design decisions in the long term.

Any concept that might be the target of an author’s hypertext reference must fit within the definition of a resource. A resource is a conceptual mapping to a set of entities, not the entity that corresponds to the mapping at any particular point in time. REST provides 4 types of resources:

- **collection:** plural nouns, */somecontext/users*
- **document:** singular noun, */somecontext/users/{userid}*
- **store**: noun inside a single document, */somecontext/users/{userid}/wishlist*
- **controller**: verbs acting over a resource or document, */somecontext/users/{userid}/export*

Want to know more about REST guidelines and naming conventions

https://restfulapi.net/

https://restfulapi.net/resource-naming/

[watch the video](https://1drv.ms/v/s!ApqDVCYL8CG8jYgiFl4thvty4XZsSA?e=ZzMXAo)

=============================================