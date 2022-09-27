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

# procedures

### **pull request procedure**
1. When the author completes all the changes make sure to thoroughly test the issue, do not take this step lightly. This is very important. Most issues that fail review are because something was not tested carefully. Make sure that the feature/bug you have fixed is indeed fixed.

2. the PR has a proper template: description, type of change, how it has been tested

3. Make sure the task executed by the author is correctly running and works as expected.

4. Make sure all the functions or statements added/modified are well optimized, escalable and clear.


# best practices in action

**control management**


*michelle alvarado. automatic bug template in jira*

automate in Jira a template to create bug report tickets, such automation will be implemented in the jira projects under akurey's control and the ones when the client agrees to add it.

*rodrigo navarro. automatic standard template for tickets in jira*
automate in Jira a template for tickets having a minimum set of information fields such as problem, acceptance criteria, what-to-do or solution explained, and point of contact.

due date: michelle alvarado and rodrigo navarro are going to research the best way to implement such ticket automation in Jira, making it easy to export or install such templates within Jira environments. Be aware of how to keep versioning such templates. Check in date sep 15th.

-----------------------------------

*lindsay morales, soledad kooper, diego cantillo. clear content structures and project documentation*

this is the definition and example of a concept map, the account manager is encouraged to build a concept map of the starting project and then analyze it in detail along with the team members. the maintenance of such map is not mandatory. the technological tool to build it, store it and share is also an account manager criteria.  

concept maps can help you quickly structure or organize the information generated from a brainstorming session. concept maps are sensemaking tools that connect many ideas, objects, and events within a domain and, as a result, help organise and visualise knowledge. you start with an overarching concept that you break down into its smaller parts, using arrows and linking words to show how ideas are connected. Concept maps are helpful in any field by driving creative and visual thinking. a concept map helps you gain a better understanding of complex topics, see the big picture, and discover new connections through a collaborative and visual approach. concept maps are always used to structure your thoughts or quickly visualize information.

**The process of concept mapping involves three major steps:** 

1. List key concepts/terms related to the topic 
2. Build up concepts to elaborate key concepts
3. Identify links between concepts 

_structure_: concept maps usually follow a hierarchical top-to-bottom format. 

_focus_: concept maps involve many connected ideas or concepts. 

_labels_: concept maps use linking words to illustrate relationships between concepts. 

_purpose_: concept maps or conceptual charts are best used for consolidating knowledge and analyzing problems, and require detailed thinking.

**example**:

![example of a sales concept map](/assets/images/sales%20concept%20map.png) 


any starting project must have valuable information for the team members, the tools to document it, what information is available, and which information have more value for the team is an account manager criteria. the following list are suggested items for any starting project. 

1. project folder hierarchy 
the desire folder distribution of the project will depends of the kind of project, the architectural design, boilerplates, the technology and requirements of the project

    for example it can be represent it using a diagram tool 

    <img src="/assets/images/file%20distribution.png"/>

    or using the folder explorer tool in your favorite IDE 

    ![project explorer tool, example of basic react project](/assets/images/react%20folder%20distribution.png)


2. conceptual map, as described above 

3. workflows, description, steps, restrictions and limitations 

    the account manager or the person designed to design such workflows decides the tool and how to share it to the team.

    ![](/assets/images/sign%20up%20workflow.png) 

4. project external services or services hierarchy (aws, gpa, azure, or similar)
    have a map or directory of the external services in the project, a diagram might work also in order to show the dependencies and relationships among the external components

    ![](/assets/images/external%20services.png) 

5. important project assets and its description

    design department will provide standard assets and information for the project. There's a minimum of information expected. check in this sections such requirements. bellow some examples:

    ![](/assets/images/assetsexample.png)

6. architecture design focus in backend distribution and databases  
    there's not specific rules and shapes to diagram an architecture, but is always recommended to have at least a first version to visualize: 

- technological components
- 3rd party services
- technologies to be use in all the layers: presentation, business and data
- protocols, dependencies and interconectivity 

    bellow some examples

    ![](/assets/images/archi1.jpg) 
    ![](/assets/images/archi2.png)
    ![](/assets/images/archi5.png) 
    ![](/assets/images/archi6.jpg) 


7. fields relationship among database fields and frontend fields 

    the most important goal on this is to map which fields are important in the frontend and how such fields are related to database fields

    ![](/assets/images/sign%20up%20fields.png)

8. potential errors and how to tackle them 

    this information must be build during project execution and becomes extremely important for on going projects. this information reduce blocking time for new team members and when building the dev environtment from scratch. 

    these are examples of problems and how to taclke, keep it simple and using reacheable words. 

_Maligned structs_ 

For reference on this issue, visit the following article: http://onedomain.com/ff/help/article-180

--------------------------------------

_Problems updating vendors_ 

when updating vendors using Go modules you may encounter the following error: 

run vendor library-x master 
go: github.com/facility/library-x master => v1.39.2-0.20201030171102-0132eeef438a 
go get: inconsistent versions: 
    github.com/facility/library-x@v1.39.2-0.20201030171102-0132eeef438a from github.com/facility/library-x@master
    requires github.com/facility/library-x@v4.0.0+incompatible
    (not github.com/facility/library-x@v1.39.2-0.20201030171102-0132eeef438a from github.com/facility/library-x@master)

solution: 
make sure you are in Go 1.14+

--------------------------------------

_Problems with the run proto command_ 

When you try to run the proto command in any of the golang MS you need all the repositories cloned in your computer. If that is not the case, you will find some errors like these:

github.com/facility/clinic/api/proto: warning: directory does not exist.
github.com/facility/mpi/api/proto: warning: directory does not exist.
github.com/facility/meeting/api/proto: warning: directory does not exist.

--------------------------------------

9. members rol description 
    at least have the person name and the brief role description. when posibble list each person role functions as describe below in the example

*Mariana Musk, Technical Architect Rol* 
- analyze and review codes PR (pull request)
- design and analyze Technical Approaches for the solution.
- oversees assigned programs and provide guidance to team members.
- provide full support to the client by explaining approaches we took or may take, doing research, and bug fixing.
- participate in several tech meetings.
- support BA folks on their technical ask.
- communication with apps member to align on our products and share knowledge.
- analyze Technical Documents provided by clients to adjust our site solutions to their systems.
- evaluate and select appropriate software and/or hardware.

*Aurelio Fuentes, Business Architect Rol* 
- work with the Technical Analysts and development team to clarify specifications.
- coordinate workload with others BA.
- review, create and update technical documents.
- perform requirements analysis.
- gather, validate and document business requirements.
- join technical meetings.
- analyze business scenarios.
- create Mock Apis.

another useful option in this section is the team roster table 

![](/assets/images/teamroster.png)


10. project scope 

    the suggested project scope consist in a business card or visualization including the following information 
- business goal of the project
- near milestores of the project
- everyone's contribution level to such of milestones 
- progress balance updated 


-----------------------------------

**operations**


*heiner leon, improve slack communication productivity over slack*

reinforce the slack guide for the correctness practice in the company, channels refactoring, improve searching for info and insisist in practicing the guideline.

The first two task will be completed by Sep 30rd
- normalize public and private channels 
- reduce noise in public directory 
- move project's channels from public to private 

-----------------------------------

*esteban damazio, async stand-up updates*

when performing daily stand-ups send in slack a 3 part message with the Most Important Thing Yesterday (MITY), Today (MITT), and blockers using short sentences. If needed, a subject can be expanded on a Slack thread or similar. Also tag concerned people on specific updates. 

the-a-team, in charge of odoo, website and the internal apps of the company started using this format and async updates in slack since Sep 1st.  

-----------------------------------

**technical**


*velvet, ana elena, maría jesús, michelle lacouture, pablo calderon, victoria. standard to export assets to dev team*

design the order, schema, values, outputs and organization of how the assets must be released to dev team for mobile and web apps.

In the next steps, for every information unit detected,  the team will define what and how the assets must be released, taking in consideration fonts, sizes, color, brand book, cross-platform, cross browsing, quality and performance requirements. 

First version of such standard will be release by Sep 20th

-----------------------------------

*esteban jiménez, reduce potential errors by having general settings in web projects*

have a settings standard file in web projects to have measures, colors and others to be use by all the web components keeping consistency.

after a research about what and how the general settings of a web projected have been managed by others, a minimum list of settings are set as akurey standard by Sep 20th.


-----------------------------------

*fabricio alvarado, guro in github desktop*

increase productivity and github conflicts by becoming a guru en github desktop to then spread such practices in the company.

people in akurey are using commmand lines, github desktop and other visual tools for this purpose. fabricio identify who wants to learn an specific tool to perform a workshop or mentoring on this. 

final decision will take place on october 4th. 

-----------------------------------

*fernando segovia, peer reviews to improve PRs efficacy*

fernando will keep a log for himself of peer reviews performed: date, feature, person, findings and brief note describing why this PR required a peer review. find out a niche where to suggest, implement and monitor such practice. 

fernando will perform meetings to set how is going to perform the peer reviews when doing PRs.

rodrigo navarro -> fernanda porras, randall moya, franco 

roy cordero -> andrey sanchez, oscar chavarría

Final guideline by September 30th


-----------------------------------

*juan josé alpizar, security practices for mobile apps*

perform an assessment of developed mobile apps in akurey to list vulnerabilities and establish a set of minimum security practices for the dev team.

Three apps were check. 

PureHealth, check with Alejandro Arce
Joypath, check with Alejandro Arce
Unimart, check with Wilson Lopez

due date: friday 19th, assessment performed of at least 3 apps. 
In the next steps, based on the assessment result, extract the minimum set of practices and organice with rodrigo how this is going to be spread in the company. 

Mobile security workshop based on HonoredEd app will be perform in 2023. 

-----------------------------------

*wilson lopez, jonathan salazar, esteban navarro, luis diego aguilar, kristal duran,  standardize toDo format*

team is going to design a format for toDOs in code, look if search or any other tool within the code editor to display all the toDos.

the implementation of the toDo format is ready, starting in september the team we'll collect the extension of its use in the current project.

counters , next count Octobr 18th

- 09/06/2022
    Jona: 0
    Luis: 1
    Esteban: 12
    Wilson: 10
    Kris: 0
-----------------------------------

*roy cordero, jonathan avalos, arturo padilla, jason solano. micronaut microservices boilerplate*

build, test and release a boilerplate for micronaut microservices architecture, following within multiple best practices and architectural patterns.

due date: friday 5th, have the first basic version of the boilerplate ready for projects from scratch. 

In the next steps, a list of the practices and architectural patterns will be set. 

Next check Sep 23rd
-----------------------------------

*yeison picado, conditional correctness structure*

improve general code quality and reduce errors by the constant practice of correct conditional statements such as if, switch and ? 

*conditional correcness checklist*

1. the often condition must be first
2. circuit break principle on conditions order
3. early termination (break, return)
4. when many cases are required to evaluated, the switch is better than if
5. ifs changing just one variable state can be transform into ternary conditional operation 

on revision keep a log with revision date, person, amount of ifs reviewed, amount of ifs fixed

Mainor Sancho, 24/8/2022, Revisados: 15, Sugerencia persona: 2, Suerencias proyecto: 1 
Fernando Segovia, 24/8/2022, Revisados: 15, Sugerencia persona: 0, Suerencias proyecto: 2 
Andrey Sanchez, 9/9/2022, Revisados: 10, Sugerencia persona: 1, Sugerencia proyecto: 1 
Esteban Navarro, 9/8/2022, Revisados: 15, Sugerencia persona: 1, Sugerencia proyecto: 1 
Lindsay, PENDIENTE, Revisados: 0, Sugerencia persona: 0, Sugerencia proyecto: 0 


Sugerencia persona: codigo creado por la persona
Sugerencia proyecto: codigo creado por otra persona pero que esta en el proyecto donde se trabaja, asi que ellos lo pueden mejorar
-----------------------------------

# pending technical topics

List of tech topics to improve and teach in the company
*   graphql
*   airflow
*   odoo models
*   i18n
*   swift operadores custom, andrey sanchez
*   hasura para graphql, emmanuel murillo
*   vercel, CI/CD, hosting, gratis fácil de usar
*   redux problems al usar componetes de devtools para ver el storage, antipatrones, unsecure, luis diego aguilar
*   custommodal, resusable components, lindsay morales
*   typehead, para react components, lindsay morales
*   mobx, oscar chavarria
*   whitelabeling in react, andrey, oscar chavarria
*   videojs, oscar chavarría
*   connection pooling, rnunez
*   mobile components phone, text, calendar que se pueda ver mes y año actual, con manejo de focus, esteban jimenez
*   Como usar a favor de uno la composicion en react, dado que no hay herencia. https://es.reactjs.org/docs/composition-vs-inheritance.html
*   atomic design, randall moya
*   manejo de logs y errores en front y back
*   heiner leon temas de arquitectura, interfaces proyecto huli
*   serverless tips https://docs.google.com/document/d/1nl4BT1ZG2AAw4iq0SlacDapPO8KCl3W_/edit
*   technical tips from https://docs.google.com/document/d/10MVA31vx0-X_jvUrIF-wGkpSZ05wDlQi/edit

