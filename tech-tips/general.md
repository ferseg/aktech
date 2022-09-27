# general

## generate dynamic data in pdf format

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

