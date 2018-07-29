# RythmCubes

RythmCubes is a game that uses your webcam and any magenta-colored object as your controller. You can add an Arduino with a motion sensor to it for an extra game mechanic.

You can play the version just with the camera [here](https://davidebecker.github.io/RythmCubes/)

# Arduino setup
1. You'll need the [MPU-9250](https://www.google.de/search?q=mpu+9250&tbm=isch) motion sensor with the following pin configuration:

| MPU-9250 | Arduino Uno | Arduino Mega |
| --- | --- | --- |
| VCC | 3,3v | 3,3v |
| GND | GND | GND |
| SCL | SCL | A5 | 21 |
| SDA | SDA | A4 | 22 |

2. Upload the sketch in /arduino-sketches/sketch.ino    
    2.1. Write down the name of the port your Arduino is connected to. On macOS it's usually something like /dev/usbmodem and on Windows COM    
    2.2. Make sure you close the serial console in the Arduino IDE

3. Change the first line in /assets/config.js from `var useMotionSensor = false` to `var useMotionSensor = true`

4. Install node.js dependencies with `npm install`

5. Start the server with `node server.js <SerialportName>`. For example `node server.js /dev/cu.usbmodem1411`

6. Open [localhost:8081](http://localhost:8081)