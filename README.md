# streaming-snapshot #
An architecture to capture streaming snapshot from a stand alone service

## HLD ##
- Default Pub/Sub for Client Browser:
    ![HLD_Default](https://raw.githubusercontent.com/blackie1019/streaming-snapshot/master/References/HLD_Default.png)
- Network Bandwith/Throughput Concern:
    ![HLD](https://raw.githubusercontent.com/blackie1019/streaming-snapshot/master/References/HLD.png)

## Prerequisite ##

- install [node with npm](https://nodejs.org/), version must greater then v6.0.0.
- install [FFMpeg](https://ffmpeg.org/).
- [Optional]install [Virtual Webcam](http://virtual-webcam.soft32.com/) to simulate streaming source. 

## Setup ##

1. using npm restore packages.
        npm install
2. start applicaion.
        npm start
3. Open Virtual Webcam to simulate streaming source from Desktop Screen. 
4. Open browser and go to client url(default is [http://localhost:9999/client.html](http://localhost:9999/client.html)) to watch change.