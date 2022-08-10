# graphql 
Code base for a graphql server in nodejs

docker network create --subnet "10.0.0.0/24" -d bridge littlenet
docker run -d -it --net littlenet --ip 10.0.0.2 -p 5000:5000 -v C:\dev\akurey\aktech\codebase\graphql:/home/api --name apiserver node bash
docker attach apiserver

cd /home/api
#npm init
npm install graphql --save
npm install -g --save typescript
npm install -D --save @types/node
npm install express --save
npm install graphql@^15.3.0
npm install express-graphql --save


https://graphql.org/learn/schema/
https://hevodata.com/learn/graphql-nodejs-mongodb-connection/
https://dev.to/adityajoshi12/graphql-with-nodejs-and-mongodb-2bdm
