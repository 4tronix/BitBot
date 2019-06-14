# BitBot Package for Microsoft PXT

Based off [initial work](https://github.com/srs/pxt-bitbot) by [Sten Roger Sandvik](https://github.com/srs), updated/expanded by [Gareth Davies](https://github.com/4tronix) and [Andrew Mulholland](https://github.com/gbaman). 

This library provides a Microsoft PXT package for BitBot, see
https://4tronix.co.uk/bitbot/.

## Driving the robot    
The simplest way to drive robot is by using the `driveMilliseconds(...)` and `driveTurnMilliseconds(...)` blocks.   
Note with `driveMilliseconds(...)`, you can specify a negative speed to reverse.   
```blocks
// Drive forward for 2000 ms
bitbot.driveMilliseconds(1023, 2000)

// Drive backwards for 2000 ms
bitbot.driveMilliseconds(-1023, 2000)

// Turn left for 200 ms
bitbot.driveTurnMilliseconds(BBRobotDirection.Left, 1023, 200)

// Turn right for 200 ms
bitbot.driveTurnMilliseconds(BBRobotDirection.Right, 1023, 200)
```   

These blocks are also available in non blocking version. The following example performs the same operation as above.   
```blocks
bitbot.drive(1023)
basic.pause(1000)

bitbot.drive(0)
basic.pause(1000)

bitbot.driveTurn(BBRobotDirection.Left, 1023)
basic.pause(250)

bitbot.driveTurn(BBRobotDirection.Right, 1023)
basic.pause(250)

bitbot.drive(0)
```

## Stopping
When the motor speed is set to zero then it stops. However, we can also use the motor itself to create a reverse generated current to brake much quicker.
This helps when aiming for more accurate manoeuvres. Use the `bitbot.stop(...)` command to stop with braking, or coast to a halt
```blocks
bitbot.robot_stop(BBStopMode.Coast) # slowly coast to a stop
bitbot.robot_stop(BBStopMode.Brake) # rapidly brake
```

## Driving the motor

If you want more fine grain control of individal motors, use `bitbot.motor(..)` to drive motor either forward or reverse. The value
indicates speed and is between `-1023` to `1023`. Minus indicates reverse.

```blocks
// Drive 1000 ms forward
bitbot.motor(BBMotor.All, 1023);
basic.pause(1000);

// Drive 1000 ms reverse
bitbot.motor(BBMotor.All, -1023);
basic.pause(1000);

// Drive 1000 ms forward on left and reverse on right
bitbot.motor(BBMotor.Left, 1023);
bitbot.motor(BBMotor.Right, -1023);
basic.pause(1000);
```

## Buzz sound

To use the buzzer, just use `bitbot.buzz(..)` function with either `1`
(sound) or `0` (no-sound).

```blocks
// Buzz for 100 ms
bitbot.buzz(1);
basic.pause(100);
bitbot.buzz(0);
```

## Read line sensor

The BitBot has two line-sensors: left and right. To read the value of the
sensors, use `bitbot.readLine(..)` function.

```blocks
// Read left and right line sensor
let left = bitbot.readLine(BBLineSensor.Left);
let right = bitbot.readLine(BBLineSensor.Right);
```

## Read light sensor

Light sensors can be read using `bitbot.readLight(..)` function.

```blocks
// Read left and right light sensor
let left = bitbot.readLight(BBLightSensor.Left);
let right = bitbot.readLight(BBLightSensor.Right);
```

## Read sonar value

If you have mounted the optional sonar sensor for the BitBot you can
also use the `bitbot.sonar(..)` function to read the distance to obstacles.

```blocks
// Read sonar values
let v1 = bitbot.sonar(BBPingUnit.MicroSeconds);
let v2 = bitbot.sonar(BBPingUnit.Centimeters);
let v3 = bitbot.sonar(BBPingUnit.Inches);
```

## NeoPixel helpers

The BitBot has 12 NeoPixels mounted. This library defines some helpers
for using the NeoPixels.

```blocks
// Show all leds
bitbot.neoSetColor(neopixel.colors(NeoPixelColors.Red));
bitbot.neoShow();

// Clear all leds
bitbot.neoClear();
bitbot.neoShow();

// Show led at position 1
bitbot.neoSetPixelColor(0, neopixel.colors(NeoPixelColors.Red));
bitbot.neoShow();

// Show led rainbow
bitbot.neoRainbow();
bitbot.neoShow();

// Show led rainbow and shift
bitbot.neoRainbow();
bitbot.neoShift();
bitbot.neoShow();

// Show led rainbow and rotate
bitbot.neoRainbow();
bitbot.neoRotate();
bitbot.neoShow();

// Set brightness of leds
bitbot.neoBrightness(100);
bitbot.neoShow();

// Use neo() variable
bitbot.neo().clear();
bitbot.neo().show();
```

## Supported targets

* for PXT/microbit

## License

MIT
