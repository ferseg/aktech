# tech tips
This a list of technical tips in different fields of software engineering

## 1. general

### generate dynamic data in pdf format

*problem:* is required to download or generate a pdf with an specific format but dynamic data within. 
*solution:* avoid to generate the whole pdf document in code, instead, in a pdf tool design a pdf form having the desire static format and add the form fields. Then with a library such as https://pdf-lib.js.org/ the fields can be load:

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
}
```

then replace the fields with the values required
```
function updateFields(field,value) {
    const newFields = updatedFields.filter((x)=>x.name !== field);
    const currentFields = [...newFields,{name:field,value:value}];
}
```
then finally write back to disk, buffer or send in the response the built pdf with the new values.
> code courtesy and research by luis diego aguilar

=============================================

## 2. frontend


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