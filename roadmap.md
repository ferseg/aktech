# coding standards and practices

**Use a linter**. Linting is a process where we run a program that analyses code for potential errors. Mostly, we use it for language-related issues. But it can also fix many other issues automatically – particularly code style.

### **typescript**

**1. Avoid the use of “any” type.** Using the “any” type is like telling the compiler to turn off checking for that element. The only situation you might want to use it is when migrating Javascript to Typescript.

**2. Use let instead of var.** The use of let, prevents the redeclaration of a variable in the same scope. var, instead, is scoped to the immediate funcion body and not the immediate enclosing block, as let does.

**3. Use const.** When declaring a “variable” whose value will not change, use const. This includes not only global constants, but values such as the parameter of a function, whose value not often changes

### **react**
**1. Higher-Order Components.** It’s an advanced technique in React which allows reusing component logic inside the render method.For example, we might need to show some components when the user is logged in. To check this, you need to add the same code with each component. Here comes the use of the Higher-Order Component where the logic to check the user is logged in and keep your code under one app component. While the other components are wrapped inside this

**2. Folder Layout.** Group the file per type. In this, the same type of files is kept under one folder. 
-- aqui va imagen --

**3. Dynamic Rendering with && and the Ternary Operator.** In React, it is possible to perform conditional renderings the same as a variable declaration. 

### **node**
**1. Use Const Over Let, Do Not Use Var.** Const variables assigned cannot be changed, this will help you prevent the use of a single variable multiple times so that way we can keep our code clean. In some scenarios where we need to re-assign variables, we will use the let keyword.

**2. Don’t Use Callbacks, Instead Use Async Await.** We can minimize the use of ‘callbacks’ and ‘promises’ to better deal with asynchronous code. It makes code look synchronous but in reality, it’s a non-blocking mechanism. 

**3. Use Arrow Functions.** The Arrow functions make the code more compact and keep the lexical context of the root function. 

### **java**
**1. Prefer the use of the StreamAPI whenever possible:** The Stream API introduced in Java 8 leverages collection manipulation to take full advantage of the hardware it is running on, also it contributes with code readability and safeness.

**2. Avoid modifying a parameter object, return a new object instead:** When you pass an object as a parameter of a method, java is passing the reference to the object and not creating a new one, that would mean that any modification that you made to the object inside the method will be available in the object of the caller method, now imagine that you have a chain of calls with that same object as a parameter, the modifications in the inner methods can mess up your original object and cause inconsistencies. Instead of modifying the object parameter, make a copy of the object, apply the modifications and return the new object.

**3. Start methods with a verb:** Methods are like actions that the class provides, start them with a verb: get, set, verify, delete, check, modify, etc..

### **python**
**1. List Comprehension:** With this implementation you can avoid to use a specific loop.

**2. Slicing a list:** this is very important when you need to get data from specific list.

**3. Use testing:**  Testing is fundamental for each project, for example use pytest, is an open-source testing framework that is possibly on of the most widely used Python testing frameworks out there, this library is full recommended for unit test.

# best practices in action

**control management**

*automatic bug's template in jira*, michelle alvarado
have an automatic template when creating a jira bug, then everyone can create bug's ticket faster. 

*concept maps and project documentation structure*, lindsay morales, diego cantillo, soledad kooper
making a concept map is a good way to organize page hierarchy before building everything out in confluence. also, keep the information, decisions and assumptions correctly documented for all team members.

*standarize ticket writing*, rodrigo navarro
sections required: problem and acceptance criteria. also add solution saying what to do, and poc. 

*slack for productivity and daily communication*, heiner leon
reinforce the slack guide and practices to increase company productiviy

**operations**

*async stand-up update*, esteban damazio
send a 3 part message with the Most Important Thing Yesterday (MITY), Today (MITT), and blockers using short sentences. If needed, a subject can be expanded on a Slack thread or similar. Tag people considered important to read such update.

**technical**

*assets for devs*, ana elena, velvet, maría jésus, michelle lacoutre, pablo calderon, victoria
standarize how to export assets to development

*general settings in web projects*, esteban jimenez
have a settings standard to have measures, colors and others to be use by all the components

*github desktop*, fabricio alvarado
extend the use of github desktop, becoming a guro in such tool

*peer reviews to perform PRs*, fernando segovia
perform a peer review when PRs are too complex 

*security in mobile apps*, juan josé alpizar
measure and improve security levels and knowledge in our mobile development field

*toDo code standard*, wilson lopez
standarize the toDO format within the code

*microservices in micronaut*, roy cordero, jonathan avalos, arturo padilla, jason solano
have a template to start new microserviecs projects in java with built-in good practices

*smart conditionals*, yeison picado
follow the correctness on if, switch, ? and similar stataments depending of the programming context

*pendings*

*   luis fernando quiros
*   oscar chavarria
*   andrey sanchez
*   jose andres barboza
*   juan manuel guevara
*   pamela vega
*   nahomy moya

# pending technical topics

List of tech topics to improve and teach in the company
*   graphql
*   airflow
*   odoo models
*   i18n

# tech tips


This list do not represent any assignment, are just topics worked by some akurey members. each topic is going to be analized and extract important tips from them. 

*   generar PDF basados en templates, luis diego aguilar
*   swift operadores custom, andrey sanchez
*   hasura para graphql, emmanuel murillo
*   vercel, CI/CD, hosting, gratis fácil de usar
*   redux problems, antipatrones, unsecure, luis diego aguilar
*   custommodal, resusable components, lindsay morales
*   typehead, para react components, lindsay morales
*   mobx, oscar chavarria
*   whitelabeling in react, andrey, oscar chavarria
*   videojs, oscar chavarría
*   connection pooling, rnunez
*   serverless tips https://docs.google.com/document/d/1nl4BT1ZG2AAw4iq0SlacDapPO8KCl3W_/edit
*   technical tips from https://docs.google.com/document/d/10MVA31vx0-X_jvUrIF-wGkpSZ05wDlQi/edit


# procedures

### **pull request procedure**
1. Make sure to thoroughly test the issue, do not take this step lightly. This is very important. Most issues that fail review are because something was not tested carefully. Make sure that the feature/bug you have fixed is indeed fixed.

2. the PR has a proper template: description, type of change, how it has been tested

3. Make sure the task executed by the author is correctly running and works as expected.

4. Make sure all the functions or statements added/modified are well optimized, escalable and clear.

