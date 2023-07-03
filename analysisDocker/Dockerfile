FROM ubuntu

# copy SatSCan installation
COPY importData \mnt

#install all neccesry packages
RUN apt-get update && apt install default-jre && apt-get install iputils-ping && apt install iproute2

## install python3.7
RUN apt install software-properties-common && add-apt-repository ppa:deadsnakes/ppa && apt install python3.7

#install SaTScan
RUN java -jar install-10.0.2_linux.jar