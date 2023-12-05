# nextViewer
This is a very experimental tool to view the strucutre of a TS. Mabe by a newbie just for fun and learn.
Use it at your own risk :-)

# How to use it
The app is made of two components:
- a backend based on Nodejs and use tsduck for TS Analysis
- a front-end basedon React 

The back-end server listen on port 8081.

## Docker version
A pre-package version is available as Docker image.

 ```docker pull enricovittorini/nextviewer:latest ```

To allow the Docker image have access to the netowrk interfaces of the host server, run the image with the --net=host option

 ```docker run --net host --name nextviewer -p 8081:8081 enricovittorini/nextviewer:latest ```



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
