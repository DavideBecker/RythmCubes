/************************************************************
MPU9250_Basic
 Basic example sketch for MPU-9250 DMP Arduino Library 
Jim Lindblom @ SparkFun Electronics
original creation date: November 23, 2016
https://github.com/sparkfun/SparkFun_MPU9250_DMP_Arduino_Library

This example sketch demonstrates how to initialize the 
MPU-9250, and stream its sensor outputs to a serial monitor.

Development environment specifics:
Arduino IDE 1.6.12
SparkFun 9DoF Razor IMU M0

Supported Platforms:
- ATSAMD21 (Arduino Zero, SparkFun SAMD21 Breakouts)
*************************************************************/
#include <SparkFunMPU9250-DMP.h>

#define SerialPort Serial

// Define the interrupt pin
#define INTERRUPT_PIN 2
// Motion Processor Sample Rate
// This value can range between: 1-200Hz
#define SAMPLE_RATE_DMP 20
// Compass Sample Rate
// This value can range between: 1-100Hz
#define SAMPLE_RATE_COMPASS 10
// Accelerometer and Gyroscope Sample Rate
// This value can range between: 4Hz-1kHz
#define SAMPLE_RATE_GYRO 10

MPU9250_DMP imu;

void setup() 
{
  SerialPort.begin(115200);

  // Call imu.begin() to verify communication with and
  // initialize the MPU-9250 to it's default values.
  // Most functions return an error code - INV_SUCCESS (0)
  // indicates the IMU was present and successfully set up
  if (imu.begin() != INV_SUCCESS)
  {
    while (1)
    {
      SerialPort.println("Unable to communicate with MPU-9250");
      SerialPort.println("Check connections, and try again.");
      SerialPort.println();
      delay(5000);
    }
  }

  // Use setSensors to turn on or off MPU-9250 sensors.
  // Any of the following defines can be combined:
  // INV_XYZ_GYRO, INV_XYZ_ACCEL, INV_XYZ_COMPASS,
  // INV_X_GYRO, INV_Y_GYRO, or INV_Z_GYRO
  // Enable all sensors:
  imu.setSensors(INV_XYZ_GYRO | INV_XYZ_ACCEL | INV_XYZ_COMPASS);

  // Use setGyroFSR() and setAccelFSR() to configure the
  // gyroscope and accelerometer full scale ranges.
  // Gyro options are +/- 250, 500, 1000, or 2000 dps
  imu.setGyroFSR(2000); // Set gyro to 2000 dps
  // Accel options are +/- 2, 4, 8, or 16 g
  imu.setAccelFSR(2); // Set accel to +/-2g
  // Note: the MPU-9250's magnetometer FSR is set at 
  // +/- 4912 uT (micro-tesla's)

  // setLPF() can be used to set the digital low-pass filter
  // of the accelerometer and gyroscope.
  // Can be any of the following: 188, 98, 42, 20, 10, 5
  // (values are in Hz).
  imu.setLPF(5); // Set LPF corner frequency to 5Hz

  // The sample rate of the accel/gyro can be set using
  // setSampleRate. Acceptable values range from 4Hz to 1kHz
  imu.setSampleRate(SAMPLE_RATE_GYRO); // Set sample rate

  // Likewise, the compass (magnetometer) sample rate can be
  // set using the setCompassSampleRate() function.
  // This value can range between: 1-100Hz
  imu.setCompassSampleRate(SAMPLE_RATE_COMPASS); // Set mag rate

  // Setup Interrupt PIN
  pinMode(INTERRUPT_PIN, INPUT_PULLUP);
    // Use enableInterrupt() to configure the MPU-9250's 
    // interrupt output as a "data ready" indicator.
    imu.enableInterrupt();

    // The interrupt level can either be active-high or low. Configure as active-low.
    // Options are INT_ACTIVE_LOW or INT_ACTIVE_HIGH
    imu.setIntLevel(INT_ACTIVE_LOW);

    // The interrupt can be set to latch until data is read, or as a 50us pulse.
    // Options are INT_LATCHED or INT_50US_PULSE
    imu.setIntLatched(INT_LATCHED);

  // Initialize the digital motion processor
  imu.dmpBegin(DMP_FEATURE_SEND_RAW_ACCEL | // Send accelerometer data
               DMP_FEATURE_GYRO_CAL       | // Calibrate the gyro data
               DMP_FEATURE_SEND_CAL_GYRO  | // Send calibrated gyro data
               DMP_FEATURE_6X_LP_QUAT     , // Calculate quat's with accel/gyro
               SAMPLE_RATE_DMP);            // Set update rate.

  analogWrite(7, 255);
}

void loop() 
{
  // dataReady() checks to see if new accel/gyro data
  // is available. It will return a boolean true or false
  // (New magnetometer data cannot be checked, as the library
  //  runs that sensor in single-conversion mode.)
//  if ( digitalRead(INTERRUPT_PIN) == LOW )
//  {
//    // Call update() to update the imu objects sensor data.
//    // You can specify which sensors to update by combining
//    // UPDATE_ACCEL, UPDATE_GYRO, UPDATE_COMPASS, and/or
//    // UPDATE_TEMPERATURE.
//    // (The update function defaults to accel, gyro, compass,
//    //  so you don't have to specify these values.)
//    imu.update();
//    handleIMUData();
//  }

  if ( imu.fifoAvailable() > 0 ) // Check for new data in the FIFO
  {
      // Use dmpUpdateFifo to update the ax, gx, qx, etc. values
      if ( imu.dmpUpdateFifo() == INV_SUCCESS )
      {
          imu.update(UPDATE_COMPASS);
          handleIMUData();
          // The following variables will have data from the top of the FIFO:
          // imu.ax, imu.ay, imu.az, -- Accelerometer
          // imu.gx, imu.gy, imu.gz -- calibrated gyroscope
          // and imu.qw, imu.qx, imu.qy, and imu.qz -- quaternions
      }
  }
}

float q30_to_float(long q30)
{ 
return (float) q30 / ((float)(1L << 30));
}

void handleIMUData(void)
{  
  // After calling update() the ax, ay, az, gx, gy, gz, mx,
  // my, mz, time, and/or temerature class variables are all
  // updated. Access them by placing the object. in front:

  // Use the calcAccel, calcGyro, and calcMag functions to
  // convert the raw sensor readings (signed 16-bit values)
  // to their respective units.
  float accelX = imu.calcAccel(imu.ax);
  float accelY = imu.calcAccel(imu.ay);
  float accelZ = imu.calcAccel(imu.az);
  float gyroX = imu.calcGyro(imu.gx);
  float gyroY = imu.calcGyro(imu.gy);
  float gyroZ = imu.calcGyro(imu.gz);
  float magX = imu.calcMag(imu.mx);
  float magY = imu.calcMag(imu.my);
  float magZ = imu.calcMag(imu.mz);
  float quatX = q30_to_float(imu.qx);
  float quatY = q30_to_float(imu.qy);
  float quatZ = q30_to_float(imu.qz);
  float quatW = q30_to_float(imu.qw);
  
//  SerialPort.println("Accel: " + String(accelX) + ", " +
//              String(accelY) + ", " + String(accelZ) + " g");
//  SerialPort.println("Gyro: " + String(gyroX) + ", " +
//              String(gyroY) + ", " + String(gyroZ) + " dps");
//  SerialPort.println("Mag: " + String(magX) + ", " +x
//              String(magY) + ", " + String(magZ) + " uT");
//  SerialPort.println("Time: " + String(imu.time) + " ms");
//  SerialPort.println();

  SerialPort.print("{ ");
  SerialPort.print("\"acc\": { \"x\": " + String(accelX) + ", \"y\": " + String(accelY) + ", \"z\": " + String(accelZ) + " }, ");
  SerialPort.print("\"gyro\": { \"x\": " + String(gyroX) + ", \"y\": " + String(gyroX) + ", \"z\": " + String(gyroX) + " }, ");
  SerialPort.print("\"mag\": { \"x\": " + String(magX) + ", \"y\": " + String(magY) + ", \"z\": " + String(magZ) + " }, ");
  SerialPort.print("\"quat\": { \"x\": " + String(quatX) + ", \"y\": " + String(quatY) + ", \"z\": " + String(quatZ) + ", \"w\": " + String(quatW) + " }");
  SerialPort.println("}");
}

