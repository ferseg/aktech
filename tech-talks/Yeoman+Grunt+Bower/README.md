# Frontend Workflow & Automation: Yeoman + Grunt + Bower
###### By: David Ballesteros

#### What's included?

 * [Node](https://nodejs.org/)
 	Since this is just a frontend workflow, NodeJs is only used to run Grunt, Bower and Yeoman.
 	This doesn't involves the server.

 * [Yeoman](http://yeoman.io/)
	Yeoman is an scaffolding tool.
	> Yeoman helps you to kickstart new projects, prescribing best practices and tools to help you stay productive.

	Install: npm install -g yo
	Generators: http://yeoman.io/generators/

 * [Grunt](http://gruntjs.com/)
	Javascript Task Runner. With Grunt, you can automatize your workflow by automatically doing tasks like: compile css, JS Linting, Uglify files or even reloading the browser.


 	Install: npm install -g grunt-cli

 * [Bower](http://bower.io/)
	Package Manager for the web.
	Lets you manage dependencies in your frontend.


	Install: npm install -g bower


To run an automated frontend workflow, you begin using Yeoman as a boilerplate.

First of all, you need to install a generator to begin a project.

For example the [Angular Generator](https://github.com/yeoman/generator-angular).

Once you did the generator's npm install, just type ```yo angular app-name``` and it will begin ask you some questions needed to scaffold the project.

You can check this video https://www.youtube.com/watch?v=1OAfGm_cI6Y for an example of how to use these tools.
