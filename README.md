## 拉取代码后先进入各目录build Dockerfile文件，然后新建一张网卡，最后将各镜像运行在网卡上
## 启动方式：
+ docker run --network ldl --name mongo -d mongo
+ docker run --name end --network ldl  -v /temp:/temp -d end
+ docker run -p 80:80 --name front --network ldl  -d front
+ docker run --name imtepr --network ldl  -v /temp:/temp -d imtepr
+ docker run --name redis  --network ldl -d redis


