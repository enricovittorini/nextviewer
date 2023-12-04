# How to use it
The app is made of two components:
- a backend based on Nodejs and use tsduck for TS Analysis
- a front-end basedon React 

The back-end server listen on port 8081.

## Docker version
A pre-package version is available as Docker image.

 ```docker pull enricovittorini/tsviewer:latest ```

To allow the Docker image have access to the netowrk interfaces of the host server, run the image with the --net=host option

 ```docker run --net host --name tsviewer -p 8081:8081 enricovittorini/tsviewer:latest ```



## Service Icons

![](./images/service_tv.svg) TV Service

![](./images/service_radio.svg) Radio Service

## Component Icons

![](./images/component_video.svg) Video Component

![](./images/component_audio.svg) Audio Component

![](./images/component_teletext.svg) Teletext  Component

![](./images/component_app.svg) App  Component

![](./images/component_scrambled.svg) Scrambled / ECM Component

![](./images/component_emm.svg) EMM component

![](./images/component_unknown.svg) Unknown Component

![](./images/component_table.svg) Table Component