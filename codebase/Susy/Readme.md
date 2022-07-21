Susy Framework Demo
===================

March 21, 2016

In this brief demo you will find a web application using a NodeJS server. This is meant to be viewed on a web browser.

The Susy framework is a lightweight SASS gridding system that allows a great amount of flexibility and is able to implement just about any layout that is conceivable.

It was presented in this talk as an alternative to Bootstrap for responsive websites implementation because of it's low impact on the overall CSS and it fits perfectly with the ITCSS architecture.

Some other technologies are integrated and where demoed during the presentation:

 - [Browser-sync](https://browsersync.io/docs/)
 - [Breakpoint](http://breakpoint-sass.com/)
 - [Modernizr with customizr](https://modernizr.com/docs). Customizr will extract and build a tailored Modernizr JS file with only the necessary tools that are actually referenced.
 - SASS
 - Compass
 - Bower
 - Gulp


----------


Resources
---------

I strongly recommend you check the following documents for a better understanding of  Susy:

 - http://susydocs.oddbird.net/en/latest/settings/ - A look into how Susy settings wor
 - http://susydocs.oddbird.net/en/latest/toolkit/ - A reference guide of all the exciting and useful new mixins provided by Susy. Only by using these it is possible to make amazing and complicated things with Susy.
 -  http://zellwk.com/blog/context-with-susy/ - Context is the most important concept to understand about Susy.
 - Zell Liew's tutorials:
	 - http://zellwk.com/blog/susy2-tutorial/
	 - http://zellwk.com/blog/susy2-tutorial-2/


----------

How to Run?
-----------

 1. First of all, you will need to install bundler: `gem install bundler`
 2. Now install the rest of the Gems (SASS) <sup>[1](#gemFootNote)</sup>: `bundle install`
 3. Now install all the node dependencies: `npm install`
 4. Gulp is already set up, simply type `gulp` and the browser window will automatically open.

<a name="gemFootNote">1</a>: I specified the current versions I used for the example to be sure it works, but you may update the Gemfile to use more recent versions.
