
/**
  * Enumeration of motors.
  */
enum BBMotor
{
    //% block="left"
    Left,
    //% block="right"
    Right,
    //% block="both"
    Both
}

/**
  * Enumeration of directions.
  */
enum BBRobotDirection
{
    //% block="left"
    Left,
    //% block="right"
    Right
}

/**
  * Values for buzzer. On or Off
  */
enum BBBuzz
{
    //% block="on"
    On,
    //% block="off"
    Off
}

/**
  * Enumeration of line sensors.
  */
enum BBLineSensor
{
    //% block="left"
    Left,
    //% block="right"
    Right
}

/**
  * Enumeration of light sensors.
  */
enum BBLightSensor
{
    //% block="left"
    Left,
    //% block="right"
    Right
}

/**
 * Ping unit for sensor.
 */
enum BBPingUnit
{
    //% block="cm"
    Centimeters,
    //% block="inches"
    Inches,
    //% block="μs"
    MicroSeconds
}

/**
  * Update mode for LEDs
  * setting to Manual requires show LED changes blocks
  * setting to Auto will update the LEDs everytime they change
  */
enum BBMode
{
    Manual,
    Auto
}

/**
  * Pre-Defined LED colours
  */
enum BBColors
{
    //% block=red
    Red = 0xff0000,
    //% block=orange
    Orange = 0xffa500,
    //% block=yellow
    Yellow = 0xffff00,
    //% block=green
    Green = 0x00ff00,
    //% block=blue
    Blue = 0x0000ff,
    //% block=indigo
    Indigo = 0x4b0082,
    //% block=violet
    Violet = 0x8a2be2,
    //% block=purple
    Purple = 0xff00ff,
    //% block=white
    White = 0xffffff,
    //% block=black
    Black = 0x000000
}

/**
 * Custom blocks
 */
//% weight=50 color=#e7660b icon="\uf1b9"
namespace bitbot
{
    let neoStrip: neopixel.Strip;
    let _updateMode = BBMode.Auto;
    let leftSpeed = 0;
    let rightSpeed = 0;

// Motor Blocks

    // slow PWM frequency for slower speeds to improve torque
    function setPWM(): void
    {
        if ((leftSpeed < 200) || (rightSpeed < 200))
            pins.analogSetPeriod(AnalogPin.P0, 60000);
        else if ((leftSpeed < 300) || (rightSpeed < 300))
            pins.analogSetPeriod(AnalogPin.P0, 40000);
        else
            pins.analogSetPeriod(AnalogPin.P0, 30000);
    }

    /**
      * Drive robot forward (or backward) at speed.
      * @param speed speed of motor between -1023 and 1023. eg: 600
      */
    //% blockId="bitbot_motor_forward" block="drive at speed %speed"
    //% speed.min=-1023 speed.max=1023
    //% weight=100
    //% subcategory=Motors
    export function drive(speed: number): void
    {
        motor(BBMotor.Both, speed);
    }

    /**
      * Drive robot forward (or backward) at speed for milliseconds.
      * @param speed speed of motor between -1023 and 1023. eg: 600
      * @param milliseconds duration in milliseconds to drive forward for, then stop. eg: 400
      */
    //% blockId="bitbot_motor_forward_milliseconds" block="drive at speed %speed| for %milliseconds|(ms)"
    //% speed.min=-1023 speed.max=1023
    //% weight=95
    //% subcategory=Motors
    export function driveMilliseconds(speed: number, milliseconds: number): void
    {
        drive(speed);
        basic.pause(milliseconds);
        drive(0);
    }

    /**
      * Turn robot in direction at speed.
      * @param direction direction to turn.
      * @param speed speed of motor between 0 and 1023. eg: 600
      */
    //% blockId="bitbot_turn" block="spin %direction|at speed %speed"
    //% speed.min=0 speed.max=1023
    //% weight=90
    //% subcategory=Motors
    export function driveTurn(direction: BBRobotDirection, speed: number): void
    {
        if (speed < 0)
            speed = 0;
        if (direction == BBRobotDirection.Left)
        {
            motor(BBMotor.Left, -speed);
            motor(BBMotor.Right, speed);
        }
        else if (direction == BBRobotDirection.Right)
        {
            motor(BBMotor.Left, speed);
            motor(BBMotor.Right, -speed);
        }
    }

    /**
      * Spin robot in direction at speed for milliseconds.
      * @param direction direction to turn.
      * @param speed speed of motor between 0 and 1023. eg: 600
      * @param milliseconds duration in milliseconds to turn for, then stop. eg: 400
      */
    //% blockId="bitbot_turn_milliseconds" block="spin %direction|at speed %speed| for %milliseconds|(ms)"
    //% speed.min=0 speed.max=1023
    //% weight=85
    //% subcategory=Motors
    export function driveTurnMilliseconds(direction: BBRobotDirection, speed: number, milliseconds: number): void
    {
        driveTurn(direction, speed)
        basic.pause(milliseconds)
        motor(BBMotor.Both, 0)
    }

    /**
      * Drive motor(s) forward or reverse.
      * @param motor motor to drive.
      * @param speed speed of motor (-1023 to 1023). eg: 600
      */
    //% blockId="bitbot_motor" block="drive %motor|motor(s) at speed %speed"
    //% weight=80
    //% subcategory=Motors
    export function motor(motor: BBMotor, speed: number): void
    {
        let forward = (speed >= 0);
        let absSpeed = Math.abs(speed);
        if ((motor == BBMotor.Left) || (motor == BBMotor.Both))
            leftSpeed = absSpeed;
        if ((motor == BBMotor.Right) || (motor == BBMotor.Both))
            rightSpeed = absSpeed;
        setPWM();

        if (speed > 1023)
            speed = 1023;
        else if (speed < -1023)
            speed = -1023;

        let realSpeed = speed;
        if (!forward)
        {
            if (realSpeed >= -200)
                realSpeed = Math.idiv(realSpeed * 19, 6);
            else if (realSpeed >= -400)
                realSpeed = realSpeed * 2;
            else if (realSpeed >= -600)
                realSpeed = Math.idiv(realSpeed * 3, 2);
            else if (realSpeed >= -800)
                realSpeed = Math.idiv(realSpeed * 5, 4);
            realSpeed = 1023 + realSpeed; // realSpeed is negative!
        }

        if ((motor == BBMotor.Left) || (motor == BBMotor.Both))
        {
            pins.analogWritePin(AnalogPin.P0, realSpeed);
            pins.digitalWritePin(DigitalPin.P8, forward ? 0 : 1);
        }

        if ((motor == BBMotor.Right) || (motor == BBMotor.Both))
        {
            pins.analogWritePin(AnalogPin.P1, realSpeed);
            pins.digitalWritePin(DigitalPin.P12, forward ? 0 : 1);
        }
    }

// Sensors and Addons

    /**
      * Sound a buzz.
      * @param flag state of buzzer (On or Off)
      */
    //% blockId="bitbot_buzz" block="turn buzzer %flag"
    //% weight=95
    //% subcategory=Sensors
    export function buzz(flag: BBBuzz): void
    {
        if (flag==BBBuzz.Off)
            pins.digitalWritePin(DigitalPin.P14, 0);
        else
            pins.digitalWritePin(DigitalPin.P14, 1);
    }

    /**
    * Read distance from sonar module connected to accessory connector.
    * @param unit desired conversion unit
    */
    //% blockId="bitbot_sonar" block="read sonar as %unit"
    //% weight=90
    //% subcategory=Sensors
    export function sonar(unit: BBPingUnit): number
    {
        // send pulse
        let trig = DigitalPin.P15;
        let echo = DigitalPin.P15;
        let maxCmDistance = 500;
        let d=10;
        pins.setPull(trig, PinPullMode.PullNone);
        for (let x=0; x<10; x++)
        {
            pins.digitalWritePin(trig, 0);
            control.waitMicros(2);
            pins.digitalWritePin(trig, 1);
            control.waitMicros(10);
            pins.digitalWritePin(trig, 0);
            // read pulse
            d = pins.pulseIn(echo, PulseValue.High, maxCmDistance * 58);
            if (d>0)
                break;
        }
        switch (unit)
        {
            case BBPingUnit.Centimeters: return d / 58;
            case BBPingUnit.Inches: return d / 148;
            default: return d;
        }
    }

    /**
      * Read line sensor.
      * @param sensor Line sensor to read.
      */
    //% blockId="bitbot_read_line" block="%sensor|line sensor"
    //% weight=85
    //% subcategory=Sensors
    export function readLine(sensor: BBLineSensor): number
    {
        if (sensor == BBLineSensor.Left)
            return pins.digitalReadPin(DigitalPin.P11);
        else
            return pins.digitalReadPin(DigitalPin.P5);
    }

    /**
      * Read light sensor.
      * @param sensor Light sensor to read.
      */
    //% blockId="bitbot_read_light" block="%sensor|light sensor"
    //% weight=80
    //% subcategory=Sensors
    export function readLight(sensor: BBLightSensor): number
    {
        if (sensor == BBLightSensor.Left)
        {
            pins.digitalWritePin(DigitalPin.P16, 0);
            return pins.analogReadPin(AnalogPin.P2);
        }
        else
        {
            pins.digitalWritePin(DigitalPin.P16, 1);
            return pins.analogReadPin(AnalogPin.P2);
        }
    }

    /**
      * Adjust opening of Talon attachment
      * @param degrees Degrees to open Talon (0 to 80). eg: 30
      */
    //% blockId="bitbot_set_talon" block="open talon %degrees|degrees"
    //% weight=75
    //% degrees.min=0 degrees.max=80
    //% subcategory=Sensors
    export function setTalon(degrees: number): void
    {
        pins.servoWritePin(AnalogPin.P15, degrees);
    }

// LED Blocks

    // create a neopixel strip if not got one already. Default to brightness 40
    function neo(): neopixel.Strip
    {
        if (!neoStrip)
        {
            neoStrip = neopixel.create(DigitalPin.P13, 12, NeoPixelMode.RGB);
            neoStrip.setBrightness(40);
        }
        return neoStrip;
    }

    // update LEDs if _updateMode set to Auto
    function updateLEDs(): void
    {
        if (_updateMode == BBMode.Auto)
            neo().show();
    }

    /**
      * Show LED changes
      */
    //% blockId="bitbot_neo_show" block="show LED changes"
    //% weight=100
    //% subcategory=Leds
    export function neoShow(): void
    {
        neo().show();
    }

    /**
      * Sets all LEDs to a given color (range 0-255 for r, g, b).
      * @param rgb RGB color of the LED
      */
    //% blockId="bitbot_neo_set_color" block="set all LEDs to %rgb=bb_colours"
    //% weight=95
    //% subcategory=Leds
    export function neoSetColor(rgb: number)
    {
        neo().showColor(rgb);
        updateLEDs();
    }

    /**
      * Clear all leds.
      */
    //% blockId="bitbot_neo_clear" block="clear all LEDs"
    //% weight=90
    //% subcategory=Leds
    export function neoClear(): void
    {
        neo().clear();
        updateLEDs();
    }

    /**
     * Set LED to a given color (range 0-255 for r, g, b).
     *
     * @param ledId position of the LED (0 to 11)
     * @param rgb RGB color of the LED
     */
    //% blockId="bitbot_neo_set_pixel_color" block="set LED at %ledId|to %rgb=bb_colours"
    //% weight=85
    //% subcategory=Leds
    export function neoSetPixelColor(ledId: number, rgb: number): void
    {
        neo().setPixelColor(ledId, rgb);
        updateLEDs();
    }

    /**
      * Shows a rainbow pattern on all LEDs.
      */
    //% blockId="bitbot_neo_rainbow" block="set led rainbow"
    //% weight=80
    //% subcategory=Leds
    export function neoRainbow(): void
    {
        neo().showRainbow(1, 360);
        updateLEDs()
    }

    /**
     * Rotate LEDs forward.
     */
    //% blockId="bitbot_neo_rotate" block="rotate LEDs"
    //% weight=75
    //% subcategory=Leds
    export function neoRotate(): void
    {
        neo().rotate(1);
        updateLEDs()
    }

    /**
     * Shift LEDs forward and clear with zeros.
     */
    //% blockId="bitbot_neo_shift" block="shift LEDs"
    //% weight=70
    //% subcategory=Leds
    export function neoShift(): void
    {
        neo().shift(1);
        updateLEDs()
    }

    // Advanced blocks

    /**
      * Set LED update mode (Manual or Automatic)
      * @param updateMode setting automatic will show LED changes automatically
      */
    //% blockId="bitbot_set_updateMode" block="set %updateMode|update mode"
    //% weight=65
    //% advanced=true
    export function setUpdateMode(updateMode: BBMode): void
    {
        _updateMode = updateMode;
    }

    /**
     * Set the brightness of the LEDs
     * @param brightness a measure of LED brightness in 0-255. eg: 40
     */
    //% blockId="bitbot_neo_brightness" block="set LED brightness %brightness"
    //% brightness.min=0 brightness.max=255
    //% weight=60
    //% advanced=true
    export function neoBrightness(brightness: number): void
    {
        neo().setBrightness(brightness);
        updateLEDs();
    }

    /**
      * Get numeric value of colour
      *
      * @param color Standard RGB Led Colours
      */
    //% blockId="bb_colours" block=%color
    //% weight=55
    //% advanced=true
    export function BBColours(color: BBColors): number
    {
        return color;
    }

    /**
      * Convert from RGB values to colour number
      *
      * @param red Red value of the LED (0 to 255)
      * @param green Green value of the LED (0 to 255)
      * @param blue Blue value of the LED (0 to 255)
      */
    //% blockId="bitbot_convertRGB" block="convert from red %red| green %green| blue %blue"
    //% weight=50
    //% advanced=true
    export function convertRGB(r: number, g: number, b: number): number
    {
        return ((r & 0xFF) << 16) | ((g & 0xFF) << 8) | (b & 0xFF);
    }

}
