# backend

## restful naming conventions

REST is an acronym for REpresentational State Transfer and an architectural style for distributed hypermedia systems. Roy Fielding first presented it in 2000 in his famous dissertation. Like other architectural styles, REST has its guiding principles and constraints. These principles must be satisfied if a service interface needs to be referred to as RESTful.

In REST, the primary data representation is called resource. Having a consistent and robust REST resource naming strategy will prove one of the best design decisions in the long term.

Any concept that might be the target of an author’s hypertext reference must fit within the definition of a resource. A resource is a conceptual mapping to a set of entities, not the entity that corresponds to the mapping at any particular point in time. REST provides 4 types of resources:

- **collection:** plural nouns, */somecontext/users*
- **document:** singular noun, */somecontext/users/{userid}*
- **store**: plural noun inside a single document, */somecontext/users/{userid}/wishlists*
- **controller**: verbs acting over a resource or document, */somecontext/users/{userid}/export*

Want to know more about REST guidelines and naming conventions

https://restfulapi.net/

https://restfulapi.net/resource-naming/

[watch the video](https://1drv.ms/v/s!ApqDVCYL8CG8jYgiFl4thvty4XZsSA?e=ZzMXAo)

> msc. rodrigo nunez 


## choosing a message broker to communicate microservices asynchronously 

to communicate microservices asynchronously with each other, meaning without waiting for a response, suited for distributed systems, a message broker is required. 

when choosing a broker you should consider a few things: 

- Broker Scale — The number of messages sent per second in the system.
- Data Persistency — The ability to recover messages.
- Consumer Capability — Whether the broker is capable of managing one-to-one and/or one-to-many consumers. 

![](/assets/images/message%20broker.png)

> msc. rodrigo nunez 

