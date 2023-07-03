FROM ubuntu

COPY install-10.0.2_linux.jar \mnt\.

#install all neccesry packages
RUN apt-get update \
 && apt install -y default-jre \ 
 && apt-get install -y iputils-ping \
 && apt install -y iproute2 

## install python3
RUN apt install software-properties-common -y \
    && add-apt-repository ppa:deadsnakes/ppa -y \
    && apt install python3 -y 

#install python library
RUN apt install -y \
    python3-pandas \
    python3-numpy \
    python3-geopandas
    
#install SaTScan
RUN cd /mnt/ \
    java -y -jar install-10.0.2_linux.jar 