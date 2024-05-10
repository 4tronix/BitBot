# MakeCode Package for 4tronix BitBot Robot

This library provides a Microsoft Makecode package for [4tronix BitBot, BitBot XL and BitBot PRO](https://shop.4tronix.co.uk/products/bitbotpro.html)


## Selecting the Model of BitBot
You can now use a classic BitBot or a BitBot XL or a BitBot PRO. The pins used for motors and sensors are different
so it is necessary to select the correct model. This will be done automatically. Or, you can force the selection using:

```sig
bitbot.select_model(BBModel.Auto);
bitbot.select_model(BBModel.Classic)
bitbot.select_model(BBModel.XL)
```

In almost all cases, you can leave the BitBot to automatically decide and not use this command at all. It will do this at the start of the program so it requires the BitBot to be switched on
to make the correct selection. If you do it automatically then you can use the same hex code for all models.
You can check what model is being used by:

```block
bitbot.getModel()
```

## BitBot PRO
These commands described below are the standard blocks for BitBot and BitBot XL. The [new blocks specifically for BitBot PRO are described here](https://4tronix.co.uk/bitbotpro)

## Driving the robot    
The simplest way to drive the robot is by using the `go(...)` or `goms(...)` blocks.
With each of these blocks you specify Forward or Reverse, and a speed from 0 to 100.
Both motors will be driven at the selected speed and direction.

Move forward at speed 60 forever:

```block
bitbot.go(BBDirection.Forward, 60)
```

Move backward at speed 100 for 2000 ms:

```block
bitbot.goms(BBDirection.Reverse, 100, 2000)
```

You can also spin/rotate the robot with the `rotate(...)` or `rotatems(...)` blocks

Rotate left at speed 70:

```block
bitbot.rotate(BBRobotDirection.Left, 70)
```

Rotate right at speed 50 for 400ms:

```block
bitbot.rotatems(BBRobotDirection.Right, 50, 400)
```   

## Stopping
When the motor speed is set to zero then it stops. However, we can also use the motor itself to create a reverse generated current to brake much quicker.
This helps when aiming for more accurate manoeuvres. Use the `stop(...)` command to stop with braking, or coast to a halt.

Slowly coast to a stop:

```block
bitbot.stop(BBStopMode.Coast)
```

Rapidly brake:

```block
bitbot.stop(BBStopMode.Brake) // rapidly brake
```

## Driving the motors individually

If you want more fine grain control of individal motors, use `bitbot.move(...)` to drive each motor either forward or reverse.
You can specify the direction (Forward or Reverse) and speed between 0 and 100.
If the left motor turns slower than the right motor, the robot will turn to the left

Drive both motors forward at speed 60. Equivalent to bitbot.go(BBDirection.Forward, 60):

```block
bitbot.move(BBMotor.Both, BBDirection.Forward, 60)
```

Drive left motor in reverse at speed 30:

```block
bitbot.move(BBMotor.Left, BBDirection.Reverse, 30)
```

Drive forward in a leftward curve:

```blocks
bitbot.move(BBMotor.Left, BBDirection.Forward, 40)
bitbot.move(BBMotor.Right, BBDirection.Forward, 70)
```

## Making the Robot Drive Straight (BitBot XL Only)

The small DC motors used in the BitBot and many other small robots are not guaranteed to go at the same speed as each other.
This can cause the robot to veer off the straight line, either to left or to right, even when both motors are programmed to go
at the same speed.
We can partially correct for this by adding a direction bias to the motor speed settings.
If your robot is veering to the right, then set the bias to the left.
Conversely, if your robot is turning to the left, then set the bias to the right.
It varies with speed and battery condition etc, but an approximation is that a 10% bias will result in about 15cm (6 inches)
change of course over about 2m (6 feet).
Note that the bias setting does not affect the old style motor blocks.
Set the bias values in the Start block at the very beginning of the program, before starting to use the normal commands

eg. robot leaves straight line to the right by about 10cm over 2m, so bias it to the left by 5%:

```block
bitbot.BBBias(BBRobotDirection.Left, 5)
```

eg. robot leaves straight line to left by 25cm, so bias it to the right by 15%:

```block
bitbot.BBBias(BBRobotDirection.Right, 15)
```

## Buzz sound

To use the buzzer, just use `bitbot.buzz(..)` function with either `1`
(sound) or `0` (no-sound).

Buzz for 100 ms:

```blocks
bitbot.buzz(true);
basic.pause(100);
bitbot.buzz(false);
```

## Read line sensor

The BitBot has two line-sensors: left and right. To read the value of the
sensors, use `bitbot.readLine(..)` function.

Read left and right line sensor:

```blocks
let left = bitbot.readLine(BBLineSensor.Left);
let right = bitbot.readLine(BBLineSensor.Right);
```

## Read light sensor

Light sensors can be read using `bitbot.readLight(..)` function.

Read left and right light sensor:

```blocks
let left = bitbot.readLight(BBLightSensor.Left);
let right = bitbot.readLight(BBLightSensor.Right);
```

## Read sonar value

If you have mounted the optional sonar sensor for the BitBot you can
also use the `bitbot.sonar(..)` function to read the distance to obstacles.

Read sonar value in cm:

```block
let distance = bitbot.sonar(BBPingUnit.MicroSeconds)
```

Read sonar value in centimetres:

```block
let distance = bitbot.sonar(BBPingUnit.Centimeters)
```

Read sonar value in inches:

```block
let distance = bitbot.sonar(BBPingUnit.Inches)
```

## FireLed Functions

The BitBot has 12 FireLeds fitted.
By default, the FireLeds are automatically updated after every setting. This makes it easy to understand.
However, it can slow down some effects so there is a block provided to switch the update mode to
Manual or Automatic:

Set all FireLeds to Green (hard-coded RGB color):

```block
bitbot.setLedColor(0x00FF00)
```

Set all FireLeds to Green (built-in colour selection):

```block
bitbot.setLedColor(BBColors.Green)
```

Clear all leds:

```block
bitbot.ledClear()
```

Set the FireLed at position 0 to 11 to selected colour.
eg. set Fireled 3 to Red:

```block
bitbot.setPixelColor(3, 0xff0000)
```

Set all the FireLeds to Rainbow (uses the colour wheel from Red to Purple):

```block
bitbot.ledRainbow()
```

Shift FireLeds up one place, blanking the first FireLed:

```block
bitbot.ledShift()
```

Rotate FireLeds by shifting up one and replace the first with the last:

```block
bitbot.ledRotate()
```

There are some more advanced blocks that allow you to select colours using separate RGB values
and select the brightness of the FireLeds.
The brightness is set to 40 by default, but can go as high as 255
You should be careful not to look directly at them when they are bright as they can damage eyes.

Switch FireLeds Update Mode to Manual or Automatic:

```block
bitbot.setUpdateMode(BBMode.Manual)
```

Select colour from separate Red, Green and Blue values
Each of the Red, Green and Blue values can range from 0 to 255.
This example produces a pale blue colour:

```block
bitbot.convertRGB(50, 100, 200);
```

Set brightness of FireLeds to 100:

```block
bitbot.ledBrightness(100);
```

## Supported targets

* for PXT/microbit

## License

MIT
