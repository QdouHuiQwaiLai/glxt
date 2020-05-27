FROM golang:latest

MAINTAINER Razil "1900018250@qq.com"

WORKDIR $GOPATH/end/
ADD . $GOPATH/end/
RUN go get github.com/dgrijalva/jwt-go && \
go get github.com/fsnotify/fsnotify && \
go get github.com/gin-gonic/gin && \
go get github.com/lexkong/log && \
go get github.com/shirou/gopsutil && \
go get github.com/spf13/pflag && \
go get github.com/spf13/viper && \
go get go.mongodb.org/mongo-driver/mongo && \
go get golang.org/x/crypto/bcrypt
RUN go build main.go

EXPOSE 8080

ENTRYPOINT ["./main"]