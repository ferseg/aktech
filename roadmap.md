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


*michelle alvarado. automatic bug template in jira*

automate in Jira a template to create bug report tickets, such automation will be implemented in the jira projects under akurey's control and the ones when the client agrees to add it.

*rodrigo navarro. automatic standard template for tickets in jira*
automate in Jira a template for tickets having a minimum set of information fields such as problem, acceptance criteria, what-to-do or solution explained, and point of contact. 

## Ticket template

Ticket Template

*Problem:* state the problem that needs to be solved. Be as descriptive as possible. Tag figmas, code, screenshots, or anything else that could help the reader understand the issue. 

*Solution:* high level description of the solution of the problem. Can be as descriptive as needed, like a step-by-step description of the code changes needed to implement the solution, or liberty can be given to the person building the ticket. 

*Acceptance Criteria:* sort of high level test cases that will need to be tested before this ticket can be considered done and closed. 

*Resources:* links to useful resources 

*POC (Point of contact):* person to contact in case you have some doubts with the ticket. 

*Jira steps* 

1. go yo your project in Jira, on the left, select project settings 

<img src="/assets/images/ticket_step_1.png" width=50% height=50%> 

2. select issue types 

<img src="/assets/images/ticket_step_2.png" width=20% height=20%> 

3. In the following page, edit each kind of ticket and add the appropriate template in the description. then save the changes. 

<img src="/assets/images/ticket_step_3.png" width=50% height=50%> 


*Front End Bug Template (Jira steps)*  

to access the templates from the official qa document follow this link: 

https://docs.google.com/document/d/1YhcdHOAOyjwA-ZgbPbRyCJq1Vsp11ErK/edit 

1. follow previous steps  1 and 2 

2. on the issue types page, check if the bug issue type is enabled, if not add it. click on add issue type, then, select the type “Bug” from the modal and click on “add” 

<img src="/assets/images/ticket_step_4.png" width=20% height=20%> 
<img src="/assets/images/ticket_step_5.png" width=50% height=50%> 

3. let’s assume that the issue type added in the step 2 is going to be for FE bugs, so change the name and description accordingly 

<img src="/assets/images/ticket_step_6.png" width=50% height=50%>   

4. in the description field add the following sections: bug type, description of the bug, steps to reproduce, possible cause and evidence 

<img src="/assets/images/ticket_step_7.png" width=50% height=50%>   

5. drag and drop or simply click on a paragraph field to create one for specifying the devices in which the bug happened. then opy and paste the devices specification from the template 

<img src="/assets/images/ticket_step_8.png" width=20% height=20%>   
<img src="/assets/images/ticket_step_9.png" width=50% height=50%>   

6. drag and drop or simply click on a dropdown field to create one for selecting the environment in which the bug happened. then, create each environment option 

<img src="/assets/images/ticket_step_10.png" width=50% height=50%>   

7. from previously-created fields, select the priority field and then select the default priority, for example “medium”

<img src="/assets/images/ticket_step_11.png" width=50% height=50%>   

8. click on a dropdown field for creating a new one for specifying the risk level of the bug. For example: 

<img src="/assets/images/ticket_step_12.png" width=50% height=50%>   

9. now it’s time to save the changes and enjoy the new and wonderful template for FE bugs. suggestion: mark the “required” checkbox in each field for avoiding missing important parts while writing an FE bug. 

<img src="/assets/images/ticket_step_13.png" width=50% height=50%>   

*API Bug Template (Jira steps)*  

prerequisites: follow steps  1, 2 from the Jira Steps

templates for FE and API defects are documented in the following document: https://docs.google.com/document/d/1YhcdHOAOyjwA-ZgbPbRyCJq1Vsp11ErK/edit


1. on the issue types page, check if the bug issue type is enabled, if not add it. first, click on add issue type, then, select the type “Bug” from the modal and click on “add”

<img src="/assets/images/ticket_step_4.png" width=20% height=20%>   
<img src="/assets/images/ticket_step_5.png" width=50% height=50%>   

2. let’s assume that the issue type added in the step 2 is going to be for API bugs, so change the name and description accordingly 

<img src="/assets/images/ticket_step_14.png" width=50% height=50%>   

3. in the description field add the following sections: bug type, description of the bug, the tool used to test, base URL, EP path, params (could be none), headers (could be none), body (could be none), possible cause and evidence

<img src="/assets/images/ticket_step_15.png" width=50% height=50%>   

4. drag and drop or simply click on a dropdown field to create one for selecting the environment in which the bug happened. then, create each environment option

<img src="/assets/images/ticket_step_16.png" width=20% height=20%>   
<img src="/assets/images/ticket_step_17.png" width=50% height=50%>   


5. drag and drop or simply click on a dropdown field to create one for specify the type of request that is failing and create an option for each type of request

<img src="/assets/images/ticket_step_16.png" width=20% height=20%>   

<img src="/assets/images/ticket_step_18.png" width=50% height=50%>   

6. from previously-created fields, select the priority field, and then select the default priority, for example “medium”

<img src="/assets/images/ticket_step_11.png" width=50% height=50%>   

7. click on a dropdown field for creating a new one for specifying the risk level of the bug. for example: 

<img src="/assets/images/ticket_step_12.png" width=50% height=50%>   

8. now it’s time to save the template 

<img src="/assets/images/ticket_step_19.png" width=50% height=50%>    


-----------------------------------

## Structured project documentation content

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

*heiner leon, improve slack communication productivity over slack*

reinforce the slack guide for the correctness practice in the company, channels refactoring, improve searching for info and insisist in practicing the guideline.

The first two task will be completed by Sep 30rd
- normalize public and private channels 
- reduce noise in public directory 
- move project's channels from public to private 

-----------------------------------

## daily standups by slack 

*esteban damazio, async stand-up updates*

when performing daily stand-ups send in slack a 3 part message with the Most Important Thing Yesterday (MITY), Today (MITT), and blockers using short sentences. If needed, a subject can be expanded on a Slack thread or similar. Also tag concerned people on specific updates. 

using the slack workflow builder is possible to remind people within the channel to report the status following the designed format in particular days of the week.  

teams currently using it:
- a-team, in charge of the odoo platform, mobile app and website
- doodles, a blog web application to provide pets information and shop articles
- agex, project to easy how people get loans to transact cows 


-----------------------------------

## picture assets to dev team 

*velvet, ana elena, maría jesús, michelle lacouture, pablo calderon, victoria. standard to export assets to dev team*

design the order, schema, values, outputs and organization of how the assets must be released to dev team for mobile and web apps. use this guideline to check how you as a designer is releasing assets to devs, but also devs, to detect missing parts

sharing best practices is an excellent way to improve the performance and productivity of our team. It can help us fill knowledge gaps, improve efficiency, encourage leadership, and more. 

Benefits of applying best practices

- improve our workflow as a team.
- fill information gaps.
- smooth project handoff from one designer to another.
- avoid miscommunication issues with the team and client.
- reduces meetings' time.
- improve efficiency and project understanding.

revision, 09-29-2022

1. File management

    In order to deliver the images to the development team, there is necessary to create a file where they can find the images easily. The path structure to place the images should be hierarchical. The recommendation is to use screens as the main files.

    *Main Screen 1 / Section / Image*

- create a folder for all the images
- design a hierarchical path
- for websites, at the end of the path, make 3 folders: *_Mobile, Tablet, Desktop_*

2. name conventions

- image name must describe content in general, such file names will serve for SEO purposes
- words in the image name separated by -, 
    ex: image-name.jpg, 
    home-green-backyard-and-akurey-house.jpg 
- all letters in lowercase

3. image content structure

- explore the image structure, checking what elements sorrounding the image can be place within the image, reducing extra lines of development code 

4. image format

- JPG format is priority, easy to compress, good quality image, reduced image size
- when the image has rounded borders or is a circular image, use the normal JPG and the devs will code the round effect by css 
- use PNG only when transparent background is required
- use GIF to simulate animations 
- SVG is advisible for logos, icons or images required to scale in/out without loosing resolution 

5. image dimensions / responsiveness 
- for websites create 3 device optimized images: mobile, tablet and desktop
- tablet and desktop image might be the same depending on the image structure and page breakpoints 
- for mobile smaller images are always required 
- be aware in optimizing load time because of images weight 


-----------------------------------
## web app general settings 

*esteban jiménez, reduce potential errors by having general settings in web projects*

have a settings standard file in web projects to have measures, colors and others to be use by all the web components keeping consistency.

after a research about what and how the general settings of a web projected have been managed by others, a minimum settings structure is suggested by akurey standards on October 3rd, 2022.

*Base scss/css* 

Given the fact that many projets use different languages and structures, there isn't an unique way to define how the scss/css is handled across them. But there are some basics to every project lead should consider to include at the beginning.

*Having a base styles folder* 

Within the project structure there should be a *Base/Settings* folder where the general webapp measures, colors, breakingpoints and so on, are defined. Here is a basic structure (can grow depending on the project). 

```css
sass/
|- base/
| |- _common.scss
| |- _measurements.scss
| |- _colors.scss
| |- _breakpoints.scss
| |- main.scss
```

those are quick examples of the expected general information in such of files 

```css
//-- common.scss --//

//_ font _//
.small{font-size: 10px;}
.big{font-size: 14px;}
.le{text-align:left;}
.ri{text-align:right;}
.bold{font-weight:bold;}

//_ display _//
.none{display: none ;}
.none_i{display: none ;}
.block{display: block ;}
.inline{display: inline ;}
...

// depends on project size and needs //
```


```css
//-- measurements.scss --//
$spacing-block: 4px;
$grid-block: $spacing-block * 2;
$grid-block-2x: $grid-block * 2;
$grid-block-4x: $grid-block * 4;
...
```

```css
//-- _colors.scss --//

//- Basic Colors -//
$transparent: transparent;
$black: #000;
$white: #fff;
$error-red: #EE4B2B;
$success-green: #33FF38;
...

//- Primary -//
...

//- Secondary -//
...
```

```css
//-- breakingpoints.scss --//

$mid-phone-upper = 670px;
$big-phone-upper = 860px;
$tablet-upper: 1024px;
$desktop-upper: 1280px;
...
```

considering a bigger project, you could go for something that includes a reset, icons and other important settings, separating them into two main subfolders /config (general) and /local (project specific) structured as so: 

```css
sass/
|- config/
| |- _common.scss
| |- _cdn.scss
| |- _colors.scss
| |- _directions.scss
| |- _breakpoints.scss
| |- _layers.scss
|- local/
| |- _mixins.scss        
| |- _resets.scss     // normalize + resets + typography
| |- _fonts.scss      
| |- _icons.scss
| |- _utilities.scss
| |- _grids.scss
|- _config.scss
|- _local.scss
|- main.scss
``` 

*In this case there will be two files created at the end called config.scss and local.scss that import every scss within the two folders.*

*ingle import* 

Having everything under a single folder simplifies the looking for base styles, but still doesn't simplify the importing of styles across the project, therefore, all files defined in the base folder should be imported in a single scss file 

***main.scss*** as: 

```css
@import "colors";
@import "breakpoints";
...
@import "local";
```

Then, inside other project files it will be as easy as calling this main.scss and using whatever is needed from the styles defined previously.  


-----------------------------------

*fabricio alvarado, guro in github desktop*

increase productivity and reduce github conflicts by becoming excersise time consuming situations under visual github tools. people is using commmand line, github desktop and some other visual tools for this purpose. the goal is to teach people how easy specific cases when using such tools:

use cases to explore 
1. how to visualize changes before a commit or merge, comparing branches 
2. how to solve merge conflicts on visual tools 

expected date, nov 10th
got the videos, now are getting refined

-----------------------------------

*fernando segovia, peer reviews to improve PRs efficacy*

fernando will keep a log for himself of peer reviews performed: date, feature, person, findings and brief note describing why this PR required a peer review. find out a niche where to suggest, implement and monitor such practice. 

fernando will perform meetings to set how is going to perform the peer reviews when doing PRs.

rodrigo navarro -> fernanda porras, randall moya, franco 

roy cordero -> andrey sanchez, oscar chavarría

## Peer review guideline

Created: September 27, 2022 8:42 AM
Last Edited Time: September 30, 2022 2:45 PM
Type: Documentation

### Introduction

When dealing with code reviews, you are also ensuring that what is being reviewed is meeting the current code standards, solves the problem and it does it in the proper manner, sometimes ensuring those statements (between others) is not that easy and efficient task to do, there are a lot of things that can slow us down like having to deal too much back and forth, trying to get the exact idea of the author at the time of solving the issue and the interaction between different pieces of the code or any other service.

Doing a peer review is a powerful tool when it is done correctly and it can save us so much time and also help us understand better the intention of the author. Some people could consider peer reviews as a waste of time or a tedious task, and that can be truth when it is not done correctly.

This guideline will list some points that can help you take the decision of doing a peer review.

### When to make a peer review?

The following list has some points that can help you determine when to do a peer review (although there is no magic formula) and hopefully prevent you from unnecessarily waste some of your time.

- [ ]  Author’s maturity level: The maturity level of the author can influence the decision of making a peer review, usually more junior colleagues tend to require more guidance when solving an issues, consider the performance of the solution and interaction with every piece of the program along with the code styling.
- [ ]  Length of the code review: Bigger code reviews are hard to follow, if the code review is unusually big, this could mean that there is something the author might be missing. Try to spend some time finding out whats happening but not too much time to decipher everything, ask the author instead.
- [ ]  Complexity of the code review: Sometimes the problem that is being solved is complex, trying to understand the solution can take time and can even be hard to determine the intention, do not dedicate more than 20 minutes trying to figure out what’s happening, meet with the author and let him explain it to you.
- [ ]  Complexity of the proposed changes: When explaining our point of view for a desired solution finding the right words to explain it, could be harder than just meet with the author, if there are a lot of changes or the change is critical, this could be a good opportunity to meet with the author and go over the solution together.
- [ ]  Too many comments related to the same code portion: When simple section of the code will end up in a lot of comments (and possibly in a lot back and forth) that might be a sign of a solution design issue, talk with the author to understand its point of view and explain yours.
- [ ]  When it will take you more than 20 mins understanding the code changed/added: Do not spend too much time trying to get the author’s perspective, ask him instead.
- [ ]  Lots of back and forth: Sometimes it is better to meet with the author instead of exchanging an extensive written conversation that can consume too much time, and the initial point can be lost.

### How to make a peer review?

How to make a code review shares the same characteristic as when to make them… There is no magic formula to ensure it is good, but following you’ll find out some points that will help you doing them better.

- [ ]  Schedule some time with the author: Make sure you reserve some time to do the review without interruption, this meeting should not take too much time, more than 30 minutes will probably indicate that you are not doing a proper peer review.
- [ ]  Be familiar with the code: You should use the meeting to clarify certain pieces of the MR, not the whole development from the start, it is important to you have dedicated some time previously to go over the code review.
- [ ]  Take notes: Take notes that will be useful and will reduce the peer review time, point out important sections of the code, things that you don’t understand and suggestions.
- [ ]  Use the time to go over the code review: Go straight to the point, explain your point of view, what needs some clarification and the suggestions you have, the meeting is not for the author to explain everything from the beginning but to clarify and suggest.
- [ ]  Do not socialize: Reinforcing the previous point, the peer review should be meant for code review related topics not to talk about life, socializing can help lose focus and not take advantage of the peer review.
- [ ]  You can group code reviews for the same author: Be careful about this point, it could make you loose focus and confuse things between code reviews. If doing this, make sure they are al related. 


-----------------------------------

## mobile security

*juan josé alpizar, security practices for mobile apps*

perform an assessment of developed mobile apps in akurey to list vulnerabilities and establish a set of minimum security practices for the dev team.

By friday 08/19th, three apps were check: 

- PureHealth, check with Alejandro Arce
- Joypath, check with Alejandro Arce
- Unimart, check with Wilson Lopez

a workshop to improve mobile security will be perform in 2023, based on the HonoredEd experience. in the mean time, akurey decides to become pro owasp practices to secure mobile apps againts the most common vulnerabilities.

please use this checklist wise to improve your solution deliverable and your team experience in creating more secure apps.

the OWASP Top 10 provides rankings of—and remediation guidance for—the top 10 most critical mobile application security risks. Leveraging the extensive knowledge and experience of the OWASP’s open community contributors, the report is based on a consensus among security experts from around the world. Risks are ranked according to the frequency of discovered security defects, the severity of the uncovered vulnerabilities, and the magnitude of their potential impacts. 

![](/assets/images/owasp-mobile-top-10.png)

1. *improper platform usage* 

iOS, android, or windows phone provide different capabilities and features that you can use. If the app does not use an existing function or even uses it incorrectly, this is called improper use. This can be, for example, a violation of published guidelines that affects the security of the app. read and be aware of the platform guidelines. 

2. *insecure data storage* 

insecure data storage as well as unintentional data leaks. mobile application penetration testing tools help uncover such grievances, including databases, manifest file, logs, cookies, clound sync and more. 

3. *insecure communication*

Your app transports data from point A to point B, ff this transport is insecure, the risk increases. the main mobile application penetration testing tools will support you in detecting faulty app-to-server or mobile-to-mobile communication. make sure the channel is secure to transport encryptions, passwords, account details or private user information. 

4. *insecure authentication*

there are many different ways that the app can provide insecure authentication. a classic example is a back-end API service request that the mobile app executes anonymously without relying on an access token. additionally, there are still apps that store passwords locally in clear text. 

5. *lack of cryptography* 

the insecure use of cryptography can be observed in most app applications. this is almost always one of two problems: a fundamentally flawed process behind the encryption mechanisms or the implementation of a weak algorithm.

6. *insecure authorization* 

authorization deals with the verification of an identified person. It verifies that the necessary authorizations are in place to perform certain actions. you need to secure these vulnerabilities as soon as possible to protect your sensitive corporate data from unwanted access.

7. *poor client code quality* 

all vulnerabilities from code-level errors can provide attackers with a way inside. The main risk lies in the need to make localized changes to the code. In particular, insecure API usage or insecure language constructs are common problems that you need to fix directly at the code level.

8. *code manipulation* 

from a technical perspective, any code on a mobile device is vulnerable to tampering. this is because the mobile code is running in a foreign environment. it is no longer under the control of your organization. Therefore, there are numerous ways to modify it at will. you should always consider these unauthorized changes in the context of business implications.

9. *reverse engineering* 

attackers who want to understand how your app works can use reverse-engineering to access all the information they need. especially metadata, which is supposed to be a relief for your programmers, is a high risk. basically, if you can clearly understand the string table of the binary or cross-functional analysis is possible, the app is considered at risk.

10. *Extraneous Functionality* 

hidden backdoor functionality or internal security controls are a common problem in mobile applications. The problem with them is that they are not only useful for developers, but also for hackers. This allows them, for example, to disable 2-factor authentication or change basic functionality.

-----------------------------------

## toDO standard

*wilson lopez, jonathan salazar, esteban navarro, luis diego aguilar, kristal duran,  standardize toDo format*

team is going to design a format for toDOs in code, look if search or any other tool within the code editor to display all the toDos.

the implementation of the toDo format is ready, starting in september the team we'll collect the extension of its use in the current project.

//ToDo:<What needs to be done>
//By:<username> || Date: <Date> || TicketRelated : <NumberOfTicket>

counters , next count Octobr 18th

- 09/06/2022
    Jona: 0
    Luis: 1
    Esteban: 12
    Wilson: 10
    Kris: 0

counters , next count October 25th

- 10/04/2022
    Jona: 0
    Luis: 0  , agrega 5 al proyecto de rescate animal
    Esteban: 2
    Wilson: 0
    Kris: 0

-----------------------------------

## micronaut boilerplate for java microservies

*roy cordero, jonathan avalos, arturo padilla, jason solano. micronaut microservices boilerplate*

build, test and release a boilerplate for micronaut microservices architecture, following within multiple best practices and architectural patterns.

due date: friday 5th, have the first basic version of the boilerplate ready for projects from scratch. 

the boilerplate is on active use for agex project. 

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

Mainor Sancho 
24/8/2022, Revisados: 15, Sugerencia persona: 2, Suerencias proyecto: 1 
18/10/2022, Revisados: 20, Sugerencia persona: 3, Suerencias proyecto: 0
16/11/2022 , Revisados: 29, Sugerencia persona: 0, Suerencias proyecto: 0

Fernando Segovia 
24/8/2022, Revisados: 15, Sugerencia persona: 0, Suerencias proyecto: 2 
18/10/2022, Revisados: 26, Sugerencia persona: 0, Suerencias proyecto: 8
1/12/2022 , Revisados: 0, Sugerencia persona: 0, Suerencias proyecto: 0

Andrey Sanchez
9/9/2022, Revisados: 10, Sugerencia persona: 1, Sugerencia proyecto: 1 
20/10/2022, Revisados: 18, Sugerencia persona: 0, Sugerencia proyecto: 0
30/11/2022, Revisados: 24, Sugerencia persona: 2, Sugerencia proyecto: 0

Esteban Navarro
9/8/2022, Revisados: 15, Sugerencia persona: 1, Sugerencia proyecto: 1 
18/10/2022, Revisados: 18, Sugerencia persona: 0, Sugerencia proyecto: 4
30/11/2022, Revisados: 20, Sugerencia persona: 0, Sugerencia proyecto: 1

Lindsay 
23/11/2022, Revisados: 21, Sugerencia persona: 1, Sugerencia proyecto: 0

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

