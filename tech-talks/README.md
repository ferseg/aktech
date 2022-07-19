# tech-talks
List of tech talks by category

## frontend

[Susy](https://github.com/akurey/aktech/tree/master/tech-talks/Susy)
The Susy framework is a lightweight SASS gridding system that allows a great amount of flexibility and is able to implement just about any layout that is conceivable. It was presented in this talk as an alternative to Bootstrap for responsive websites implementation because of it's low impact on the overall CSS and it fits perfectly with the ITCSS architecture.


## backend

[RESTful naming conventions](https://1drv.ms/v/s!ApqDVCYL8CG8jYgiFl4thvty4XZsSA?e=ZzMXAo)
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

