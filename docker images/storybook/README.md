# description
this image aim the creation of a storybook web server container. Then you can start it and stop it at your convenience. If the host folder is empty, the image will copy a basic reactjs boilerplate project to start with. By the contrary the image will assume the folder already have a project then start the storybook server container. 

to build this image
```
docker image build . -t storybook
```

to run this image
```
docker run -it --network bridge -p 6006:6006 -v <host project folder>:/home/project --name storyserver storybook

// example
docker run -it --network bridge -p 6006:6006 -v c:\dev\test:/home/project --name storyserver storybook
```

Then to access the storybook server open in a browser http://localhost:6006




