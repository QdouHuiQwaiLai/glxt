FROM golang:latest

MAINTAINER Razil "1900018250@qq.com"

WORKDIR $GOPATH/end/
ADD . $GOPATH/end/
RUN go get github.com/dgrijalva/jwt-go
RUN go get github.com/fsnotify/fsnotify
RUN go get github.com/gin-gonic/gin
RUN go get github.com/lexkong/log
RUN go get github.com/shirou/gopsutil
RUN go get github.com/spf13/pflag
RUN go get github.com/spf13/viper
RUN go get go.mongodb.org/mongo-driver/mongo
#RUN go get golang.org/x/crypto/bcrypt
RUN go build main.go

EXPOSE 8080

ENTRYPOINT ["./main"]