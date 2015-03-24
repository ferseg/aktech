# JMeter
###### By: Alexander Chaves

> Apache JMeter may be used to test performance both on static and dynamic resources (Webservices (SOAP/REST), Web dynamic languages - PHP, Java, ASP.NET, Files, etc. -, Java Objects, Data Bases and Queries, FTP Servers and more). It can be used to simulate a heavy load on a server, group of servers, network or object to test its strength or to analyze overall performance under different load types. You can use it to make a graphical analysis of performance or to test your server/script/object behavior under heavy concurrent load.


* ** Load Testing vs Stress Testing**

 Stress Testing is pushing your application to its limit. 

 Load Testing is check if the requirements are met.

* ** JMeter Capacities **
	+ Add Threads: specify a number of users and the time span they are going to make requests
	+ Config Element: make the test as real as possible
	+ Pre Processors: test configurations
	+ Post Processors: results analysis
	+ Assertions: tests validators
	+ Listeners: the most common are Summary Report, View Results in Table, View Results Tree

* ** Examples **
	+ Simple:
    	* Add a thread group
	    * Add a sample to each test group (HTTP Request for instance)
    	* Add Listeners to check the results

	+ Uso más real:
    	* Use the ```Recording Template``` to record user actions in a browser through a Proxy. ** Always remember to setup your browser and put the proxy configuration **
	    * User Defined Variables: use variables to not wire the variables in the test
    	* Request Defaults
	    * Cookie manager
	    * Workbench: activates the proxy
        * User Defined Variables -> CSV DataSet Config: Pull variables from a dataset. You can use this to not login with the same user and password every time.
