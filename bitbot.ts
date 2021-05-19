
/**
  * Eyeball directions
  */
enum eyePos
{
    //% block="forward"
    Forward,
    //% block="down"
    Down,
    //% block="up"
    Up,
    //% block="left"
    Left,
    //% block="right"
    Right,
    //% block="down-left"
    DownLeft,
    //% block="down-right"
    DownRight,
    //% block="up-left"
    UpLeft,
    //% block="up-right"
    UpRight
}

enum eyeSize
{
    //% block="small"
    Small,
    //% block="large"
    Large
}

enum bfEyes
{
    //% block="left"
    Left,
    //% block="right"
    Right,
    //% block="both"
    Both
}

enum bfMouth
{
    //% block="smile"
    Smile,
    //% block="grin"
    Grin,
    //% block="sad"
    Sad,
    //% block="frown"
    Frown,
    //% block="straight"
    Straight,
    //% block="oooh"
    Oooh,
    //% block="eeeh"
    Eeeh
}

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
  * Enumeration of forward/reverse directions
  */
enum BBDirection
{
    //% block="forward"
    Forward,
    //% block="reverse"
    Reverse
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
  * Stop modes. Coast or Brake
  */
enum BBStopMode
{
    //% block="no brake"
    Coast,
    //% block="brake"
    Brake
}

/**
  * Enable/Disable for Bluetooth and FireLeds
  */
enum BBBluetooth
{
    //% block="Enable"
    btEnable,
    //% block="Disable"
    btDisable
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

enum BBServos
{
    P1,
    P2
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
  * Model Types of BitBot
  * Classic or XL
  */
enum BBModel
{
    Classic,
    XL,
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
//% groups='["Basic","Advanced","Special","Ultrasonic","Line Sensor","5x5 Matrix","BitFace","OLED 128x64"]'
namespace bitbot
{
    let fireBand: fireled.Band;
    let _updateMode = BBMode.Auto;
    let btDisabled = true;
    let matrix5: fireled.Band;
    let bitface: fireled.Band;
    let mouthSmile: number[] = [0,1,2,3,4,5];
    let mouthGrin: number[] = [0,1,2,3,4,5,10,11,12,13];
    let mouthSad: number[] = [0,5,6,7,8,9];
    let mouthFrown: number[] = [0,5,6,7,8,9,10,11,12,13];
    let mouthStraight: number[] = [0,5,10,11,12,13];
    let mouthOooh: number[] = [1,2,3,4,6,7,8,9,10,13];
    let mouthEeeh: number[] = [0,1,2,3,4,5,6,7,8,9];
    let oled: firescreen.Screen;

    let leftBias = 0;
    let rightBias = 0;
    let calibration: number[] = [0, 0, 0];
    let leftCalib = 0;
    let rightCalib = 0;

    let _model = BBModel.Auto;
    let i2caddr = 28;	// i2c address of I/O Expander
    let EEROM = 0x50;	// i2c address of EEROM
    let versionCode = -1;
    let lMotorD0: DigitalPin;
    let lMotorD1: DigitalPin;
    let lMotorA0: AnalogPin;
    let lMotorA1: AnalogPin;
    let rMotorD0: DigitalPin;
    let rMotorD1: DigitalPin;
    let rMotorA0: AnalogPin;
    let rMotorA1: AnalogPin;
    let _deadband = 2;
    let _p1Trim = 0;
    let _p2Trim = 0;

    function clamp(value: number, min: number, max: number): number
    {
        return Math.max(Math.min(max, value), min);
    }

// Block to enable Bluetooth and disable FireLeds.
    /**
      * Enable/Disable Bluetooth support by disabling/enabling FireLeds
      * @param enable enable or disable Blueetoth
    */
    //% blockId="BBEnableBluetooth"
    //% block="%enable|Bluetooth"
    //% blockGap=8
    export function bbEnableBluetooth(enable: BBBluetooth)
    {
        if (enable == BBBluetooth.btEnable)
            btDisabled = false;
        else
            btDisabled = true;
    }

// Blocks for selecting BitBot Model
    /**
      * Force Model of BitBot (Determines Pins used)
      * @param model Model of BitBot; Classic or XL
      */
    //% blockId="bitbot_model" block="select BitBot model%model"
    //% weight=100
    //% subcategory=BitBot_Model
    export function select_model(model: BBModel): void
    {
        if((model==BBModel.Classic) || (model==BBModel.XL) || (model==BBModel.Auto))
        {
            _model = model;
            if (_model == BBModel.Classic)
            {
                lMotorD0 = DigitalPin.P0;
                lMotorD1 = DigitalPin.P8;
                lMotorA0 = AnalogPin.P0;
                lMotorA1 = AnalogPin.P8;
                rMotorD0 = DigitalPin.P1;
                rMotorD1 = DigitalPin.P12;
                rMotorA0 = AnalogPin.P1;
                rMotorA1 = AnalogPin.P12;
            }
            else
            {
                lMotorD0 = DigitalPin.P16;
                lMotorD1 = DigitalPin.P8;
                lMotorA0 = AnalogPin.P16;
                lMotorA1 = AnalogPin.P8;
                rMotorD0 = DigitalPin.P14;
                rMotorD1 = DigitalPin.P12;
                rMotorA0 = AnalogPin.P14;
                rMotorA1 = AnalogPin.P12;
            }
        }
    }

    /**
      * get Model of BitBot (Classic or XL)
      */
    //% blockId="bb_model" block="BitBot model"
    //% weight=90
    //% subcategory=BitBot_Model
    export function getModel(): BBModel
    {
        getVersionCode();
        if (_model == BBModel.Auto)
        {
            if (versionCode == 0)
            {
                select_model(BBModel.Classic);
            }
            else
            {
                select_model(BBModel.XL);
                pins.digitalWritePin(DigitalPin.P0, 0);
            }
        }
        return _model;
    }

    /**
      * Get numeric value of BitBot Model
      *
      * @param model BitBot Model eg: BBModel.Classic
      */
    //% blockId="bb_models" block=%model
    //% weight=80
    //% subcategory=BitBot_Model
    export function BBModels(model: BBModel): number
    {
        return model;
    }

    /**
      * Get versionCode
      */
    //% blockId="getVersionCode"
    //% block="version Code"
    //% weight=80
    //% subcategory=BitBot_Model
    //% deprecated=true
    export function getVersionCode(): number
    {
        if (versionCode == -1)	// first time requesting
            versionCode = (pins.i2cReadNumber(i2caddr, NumberFormat.Int8LE, false) >> 4) & 0x0f;
        return versionCode;
    }

// "DRIVE STRAIGHT" BLOCKS

    // Uses bottom 3 bytes of EEROM for motor bias data
    // Bias values from -100 to +100. Negative values decrease Left speed, Positive decrease right speed
    // Byte 0 = Bias at 30, 1 = Bias at 60, 2 = Bias at 90

    /**
      * Write a byte of data to EEROM at selected address
      * @param address Location in EEROM to write to
      * @param data Byte of data to write
      */
    //% blockId="writeEEROM"
    //% block="write%data|to address%address"
    //% data.min = -128 data.max = 127
    //% weight=100
    //% deprecated=true
    export function writeEEROM(data: number, address: number): void
    {
        wrEEROM(data, address);
    }

    function wrEEROM(data: number, address: number): void
    {
        if (getVersionCode() == 5)
        {
            let i2cData = pins.createBuffer(3);

            i2cData[0] = address >> 8;	// address MSB
            i2cData[1] = address & 0xff;	// address LSB
            i2cData[2] = data & 0xff;
            pins.i2cWriteBuffer(EEROM, i2cData, false);
            basic.pause(3);			// needs a short pause. 3ms ok?
        }
    }

    /**
      * Read a byte of data from EEROM at selected address
      * @param address Location in EEROM to read from
      */
    //% blockId="readEEROM"
    //% block="read EEROM address%address"
    //% weight=90
    //% deprecated=true
    export function readEEROM(address: number): number
    {
        return rdEEROM(address);
    }

    // Uses bottom 3 bytes of EEROM for motor calibration. No user access
    function rdEEROM(address: number): number
    {
        if (getVersionCode() == 5)
        {
            let i2cRead = pins.createBuffer(2);

            i2cRead[0] = address >> 8;	// address MSB
            i2cRead[1] = address & 0xff;	// address LSB
            pins.i2cWriteBuffer(EEROM, i2cRead, false);
            basic.pause(1);
            return pins.i2cReadNumber(EEROM, NumberFormat.Int8LE);
        }
        else
            return 0;
    }

    /**
      * Load Calibration data from EEROM
      */
    //% blockId="loadCalibration"
    //% block="Load calibration from EEROM"
    //% weight=80
    //% deprecated=true
    export function loadCalibration(): void
    {
	for (let i=0; i<3; i++)
            calibration[i] = rdEEROM(i);
    }

    /**
      * Save Calibration data to EEROM
      */
    //% blockId="saveCalibration"
    //% block="Save calibration to EEROM"
    //% weight=70
    //% deprecated=true
    export function saveCalibration(): void
    {
	for (let i=0; i<3; i++)
            wrEEROM(calibration[i],i);
    }

    /**
      * Check Calibration Values for given speed
      * @param speed selected speed 0 to 100. eg: 60
      * @param side selected motor Left or Right
      */
    //% blockId="checkCalibration"
    //% block="Check side%side bias for speed%speed"
    //% weight=60
    //% deprecated=true
    export function checkCalibration(side: BBMotor, speed: number): number
    {
        let calibVal = 0;
        leftCalib = 0;
        rightCalib = 0;
        if (speed < 60)
            calibVal = calibration[1] - ((60 - speed)/30) * (calibration[1] - calibration[0]);
        else
            calibVal = calibration[2] - ((90 - speed)/30) * (calibration[2] - calibration[1]);
        if (calibVal < 0)
            leftCalib = Math.abs(calibVal);
        else
            rightCalib = calibVal;
        if (side == BBMotor.Left)
            return leftCalib;
        else
            return rightCalib;
    }

// New Style Motor Blocks
    // slow PWM frequency for slower speeds to improve torque
    function setPWM(speed: number): void
    {
        if (speed < 200)
            pins.analogSetPeriod(AnalogPin.P0, 60000);
        else if (speed < 300)
            pins.analogSetPeriod(AnalogPin.P0, 40000);
        else
            pins.analogSetPeriod(AnalogPin.P0, 30000);
    }

    /**
      * Move robot forward (or backward) at speed.
      * @param direction Move Forward or Reverse
      * @param speed speed of motor between 0 and 100. eg: 60
      */
    //% blockId="BBGo" block="go%direction|at speed%speed|\\%"
    //% speed.min=0 speed.max=100
    //% weight=100
    //% subcategory=Motors
    export function go(direction: BBDirection, speed: number): void
    {
        move(BBMotor.Both, direction, speed);
    }

    /**
      * Move robot forward (or backward) at speed for milliseconds
      * @param direction Move Forward or Reverse
      * @param speed speed of motor between 0 and 100. eg: 60
      * @param milliseconds duration in milliseconds to drive forward for, then stop. eg: 400
      */
    //% blockId="BBGoms" block="go%direction|at speed%speed|\\% for%milliseconds|ms"
    //% speed.min=0 speed.max=100
    //% weight=90
    //% subcategory=Motors
    export function goms(direction: BBDirection, speed: number, milliseconds: number): void
    {
        go(direction, speed);
        basic.pause(milliseconds);
        stop(BBStopMode.Coast);
    }

    /**
      * Rotate robot in direction at speed
      * @param direction direction to turn
      * @param speed speed of motors (0 to 100). eg: 60
      */
    //% blockId="BBRotate" block="spin%direction|at speed%speed|\\%"
    //% speed.min=0 speed.max=100
    //% weight=80
    //% subcategory=Motors
    export function rotate(direction: BBRobotDirection, speed: number): void
    {
        if (direction == BBRobotDirection.Left)
        {
            move(BBMotor.Left, BBDirection.Reverse, speed);
            move(BBMotor.Right, BBDirection.Forward, speed);
        }
        else if (direction == BBRobotDirection.Right)
        {
            move(BBMotor.Left, BBDirection.Forward, speed);
            move(BBMotor.Right, BBDirection.Reverse, speed);
        }
    }

    /**
      * Rotate robot in direction at speed for milliseconds.
      * @param direction direction to spin
      * @param speed speed of motor between 0 and 100. eg: 60
      * @param milliseconds duration in milliseconds to spin for, then stop. eg: 400
      */
    //% blockId="BBRotatems" block="spin%direction|at speed%speed|\\% for%milliseconds|ms"
    //% speed.min=0 speed.max=100
    //% weight=70
    //% subcategory=Motors
    export function rotatems(direction: BBRobotDirection, speed: number, milliseconds: number): void
    {
        rotate(direction, speed);
        basic.pause(milliseconds);
        stop(BBStopMode.Coast);
    }

    /**
      * Stop robot by coasting slowly to a halt or braking
      * @param mode Brakes on or off
      */
    //% blockId="BBstop" block="stop with%mode"
    //% weight=60
    //% subcategory=Motors
    export function stop(mode: BBStopMode): void
    {
        getModel();
        let stopMode = 0;
        if (mode == BBStopMode.Brake)
            stopMode = 1;
        pins.digitalWritePin(lMotorD0, stopMode);
        pins.digitalWritePin(lMotorD1, stopMode);
        pins.digitalWritePin(rMotorD0, stopMode);
        pins.digitalWritePin(rMotorD1, stopMode);
    }

    function createCalib(speed: number): void
    {
        if (getVersionCode() == 5)
        {        
            let calibVal = 0;
            if (speed < 60)
                calibVal = calibration[1] - ((60 - speed)/30) * (calibration[1] - calibration[0]);
            else
                calibVal = calibration[2] - ((90 - speed)/30) * (calibration[2] - calibration[1]);
            leftCalib = 0;
            rightCalib = 0;
            if (calibVal < 0)
                leftCalib = Math.abs(calibVal);
            else
                rightCalib = calibVal;
        }
    }

    /**
      * Move individual motors forward or reverse
      * @param motor motor to drive
      * @param direction select forwards or reverse
      * @param speed speed of motor between 0 and 100. eg: 60
      */
    //% blockId="BBMove" block="move%motor|motor(s)%direction|at speed%speed|\\%"
    //% weight=50
    //% speed.min=0 speed.max=100
    //% subcategory=Motors
    export function move(motor: BBMotor, direction: BBDirection, speed: number): void
    {
        let lSpeed = 0;
        let rSpeed = 0;
        getModel();
        speed = clamp(speed, 0, 100);
	createCalib(speed); // sets bias values for "DriveStraight" if available (versionCode == 5 only)
        speed = speed * 10.23
        setPWM(speed);
        if (getVersionCode() == 5 && leftBias == 0 && rightBias == 0)
        {
            lSpeed = Math.round(speed * (100 - leftCalib) / 100);
            rSpeed = Math.round(speed * (100 - rightCalib) / 100);
        }
        else
        {
            lSpeed = Math.round(speed * (100 - leftBias) / 100);
            rSpeed = Math.round(speed * (100 - rightBias) / 100);
        }
        if ((motor == BBMotor.Left) || (motor == BBMotor.Both))
        {
            if (direction == BBDirection.Forward)
            {
                pins.analogWritePin(lMotorA0, lSpeed);
                pins.analogWritePin(lMotorA1, 0);
            }
            else
            {
                pins.analogWritePin(lMotorA0, 0);
                pins.analogWritePin(lMotorA1, lSpeed);
            }
        }
        if ((motor == BBMotor.Right) || (motor == BBMotor.Both))
        {
            if (direction == BBDirection.Forward)
            {
                pins.analogWritePin(rMotorA0, rSpeed);
                pins.analogWritePin(rMotorA1, 0);
            }
            else
            {
                pins.analogWritePin(rMotorA0, 0);
                pins.analogWritePin(rMotorA1, rSpeed);
            }
        }
    }

    /**
      * Set left/right bias to match motors
      * @param direction direction to turn more (if robot goes right, set this to left)
      * @param bias percentage of speed to bias with eg: 10
      */
    //% blockId="BBBias" block="bias%direction|by%bias|\\%"
    //% bias.min=0 bias.max=80
    //% weight=40
    //% subcategory=Motors
    export function BBBias(direction: BBRobotDirection, bias: number): void
    {
        bias = clamp(bias, 0, 80);
        if (direction == BBRobotDirection.Left)
        {
            leftBias = bias;
            rightBias = 0;
        }
        else
        {
            leftBias = 0;
            rightBias = bias;
        }
    }

// Old Motor Blocks - kept for compatibility
    /**
      * Drive motor(s) forward or reverse.
      * @param motor motor to drive.
      * @param speed speed of motor (-1023 to 1023). eg: 600
      */
    //% blockId="bitbot_motor" block="drive%motor|motor(s) at speed%speed"
    //% speed.min=-1023 speed.max=1023
    //% weight=80
    //% subcategory=Motors
    //% group="Old style blocks"
    //% blockGap=8
    //% deprecated=true
    export function motor(motor: BBMotor, speed: number): void
    {
        speed = clamp(speed, -1023, 1023);
        let speed0 = 0;
        let speed1 = 0;
        setPWM(Math.abs(speed));
        if (speed > 0)
        {
            speed0 = speed;
            speed1 = 0;
        }
        else
        {
            speed0 = 0;
            speed1 = 0 - speed;
        }
        if ((motor == BBMotor.Left) || (motor == BBMotor.Both))
        {
            if (getModel() == BBModel.Classic)
            {
                pins.analogWritePin(AnalogPin.P0, speed0);
                pins.analogWritePin(AnalogPin.P8, speed1);
            }
            else
            {
                pins.analogWritePin(AnalogPin.P16, speed0);
                pins.analogWritePin(AnalogPin.P8, speed1);
            }
        }

        if ((motor == BBMotor.Right) || (motor == BBMotor.Both))
        {
            if (getModel() == BBModel.Classic)
            {
                pins.analogWritePin(AnalogPin.P1, speed0);
                pins.analogWritePin(AnalogPin.P12, speed1);
            }
            else
            {
                pins.analogWritePin(AnalogPin.P14, speed0);
                pins.analogWritePin(AnalogPin.P12, speed1);
            }
        }
    }

    /**
      * Drive robot forward (or backward) at speed.
      * @param speed speed of motor between -1023 and 1023. eg: 600
      */
    //% blockId="bitbot_motor_forward" block="drive at speed%speed"
    //% speed.min=-1023 speed.max=1023
    //% weight=100
    //% subcategory=Motors
    //% group="Old style blocks"
    //% blockGap=8
    //% deprecated=true
    export function drive(speed: number): void
    {
        motor(BBMotor.Both, speed);
    }

    /**
      * Drive robot forward (or backward) at speed for milliseconds.
      * @param speed speed of motor between -1023 and 1023. eg: 600
      * @param milliseconds duration in milliseconds to drive forward for, then stop. eg: 400
      */
    //% blockId="bitbot_motor_forward_milliseconds" block="drive at speed%speed| for%milliseconds|ms"
    //% speed.min=-1023 speed.max=1023
    //% weight=95
    //% subcategory=Motors
    //% group="Old style blocks"
    //% blockGap=8
    //% deprecated=true
    export function driveMilliseconds(speed: number, milliseconds: number): void
    {
        drive(speed);
        basic.pause(milliseconds);
        stop(BBStopMode.Coast);
    }

    /**
      * Turn robot in direction at speed.
      * @param direction direction to turn.
      * @param speed speed of motor between 0 and 1023. eg: 600
      */
    //% blockId="bitbot_turn" block="spin%direction|at speed%speed"
    //% speed.min=0 speed.max=1023
    //% weight=90
    //% subcategory=Motors
    //% group="Old style blocks"
    //% blockGap=8
    //% deprecated=true
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
    //% blockId="bitbot_turn_milliseconds" block="spin%direction|at speed%speed| fo %milliseconds|ms"
    //% speed.min=0 speed.max=1023
    //% weight=85
    //% subcategory=Motors
    //% group="Old style blocks"
    //% blockGap=8
    //% deprecated=true
    export function driveTurnMilliseconds(direction: BBRobotDirection, speed: number, milliseconds: number): void
    {
        driveTurn(direction, speed)
        basic.pause(milliseconds)
        stop(BBStopMode.Coast);
    }


// Inbuilt FireLed Blocks

    // create a FireLed band if not got one already. Default to brightness 40
    function fire(): fireled.Band
    {
        if (!fireBand)
        {
            fireBand = fireled.newBand(DigitalPin.P13, 12);
            fireBand.setBrightness(40);
        }
        return fireBand;
    }

    // update FireLeds if _updateMode set to Auto
    function updateLEDs(): void
    {
        if (_updateMode == BBMode.Auto)
            ledShow();
    }

    /**
      * Sets all LEDs to a given color (range 0-255 for r, g, b).
      * @param rgb RGB color of the LED
      */
    //% blockId="bitbot_set_led_color" block="set all LEDs to%rgb=bb_colours"
    //% weight=100
    //% subcategory=FireLeds
    //% group=Basic
    //% blockGap=8
    export function setLedColor(rgb: number)
    {
        fire().setBand(rgb);
        updateLEDs();
    }

    /**
      * Clear all leds.
      */
    //% blockId="bitbot_led_clear" block="clear all LEDs"
    //% weight=90
    //% subcategory=FireLeds
    //% group=Basic
    //% blockGap=8
    export function ledClear(): void
    {
        fire().clearBand();
        updateLEDs();
    }

    /**
     * Set single LED to a given color (range 0-255 for r, g, b).
     *
     * @param ledId position of the LED (0 to 11)
     * @param rgb RGB color of the LED
     */
    //% blockId="bitbot_set_pixel_color" block="set LED at%ledId|to%rgb=bb_colours"
    //% weight=80
    //% subcategory=FireLeds
    //% group=Basic
    //% blockGap=8
    export function setPixelColor(ledId: number, rgb: number): void
    {
        fire().setPixel(ledId, rgb);
        updateLEDs();
    }

    /**
      * Shows a rainbow pattern on all LEDs.
      */
    //% blockId="bitbot_rainbow" block="set LED rainbow"
    //% weight=70
    //% subcategory=FireLeds
    //% group=Basic
    //% blockGap=8
    export function ledRainbow(): void
    {
        fire().setRainbow();
        updateLEDs()
    }

    /**
     * Shift LEDs forward and clear with zeros.
     */
    //% blockId="bitbot_led_shift" block="shift LEDs"
    //% weight=60
    //% subcategory=FireLeds
    //% group=Basic
    //% blockGap=8
    export function ledShift(): void
    {
        fire().shiftBand();
        updateLEDs()
    }

    /**
     * Rotate LEDs forward.
     */
    //% blockId="bitbot_led_rotate" block="rotate LEDs"
    //% weight=50
    //% subcategory=FireLeds
    //% group=Basic
    //% blockGap=8
    export function ledRotate(): void
    {
        fire().rotateBand();
        updateLEDs()
    }

    // Advanced blocks

    /**
     * Set the brightness of the LEDs
     * @param brightness a measure of LED brightness in 0-255. eg: 40
     */
    //% blockId="bitbot_led_brightness" block="set LED brightness%brightness"
    //% brightness.min=0 brightness.max=255
    //% weight=100
    //% subcategory=FireLeds
    //% group=Advanced
    //% blockGap=8
    export function ledBrightness(brightness: number): void
    {
        fire().setBrightness(brightness);
        updateLEDs();
    }

    /**
      * Set LED update mode (Manual or Automatic)
      * @param updateMode setting automatic will show LED changes automatically
      */
    //% blockId="bitbot_set_updateMode" block="set%updateMode|update mode"
    //% weight=90
    //% subcategory=FireLeds
    //% group=Advanced
    //% blockGap=8
    export function setUpdateMode(updateMode: BBMode): void
    {
        _updateMode = updateMode;
    }

    /**
      * Show LED changes
      */
    //% blockId="BBledShow" block="show FireLed changes"
    //% weight=80
    //% subcategory=FireLeds
    //% group=Advanced
    //% blockGap=8
    export function ledShow(): void
    {
        if (btDisabled)
            fire().updateBand();
    }

    /**
      * Get numeric value of colour
      * @param color Standard RGB Led Colours eg: #ff0000
      */
    //% blockId="bb_colours" block=%color
    //% blockHidden=false
    //% weight=70
    //% subcategory=FireLeds
    //% group=Advanced
    //% blockGap=8
    //% shim=TD_ID colorSecondary="#e7660b"
    //% color.fieldEditor="colornumber"
    //% color.fieldOptions.decompileLiterals=true
    //% color.defl='#ff0000'
    //% color.fieldOptions.colours='["#FF0000","#659900","#18E600","#80FF00","#00FF00","#FF8000","#D82600","#B24C00","#00FFC0","#00FF80","#FFC000","#FF0080","#FF00FF","#B09EFF","#00FFFF","#FFFF00","#8000FF","#0080FF","#0000FF","#FFFFFF","#FF8080","#80FF80","#40C0FF","#999999","#000000"]'
    //% color.fieldOptions.columns=5
    //% color.fieldOptions.className='rgbColorPicker'
    export function BBColours(color: number): number
    {
        return color;
    }

    /**
      * Convert from RGB values to colour number
      * @param red Red value of the LED (0 to 255)
      * @param green Green value of the LED (0 to 255)
      * @param blue Blue value of the LED (0 to 255)
      */
    //% blockId="bitbot_convertRGB" block="convert from red%red|green%green|blue%blue"
    //% weight=60
    //% subcategory=FireLeds
    //% group=Advanced
    //% blockGap=8
    export function convertRGB(r: number, g: number, b: number): number
    {
        return ((r & 0xFF) << 16) | ((g & 0xFF) << 8) | (b & 0xFF);
    }

// Built-in Sensors - Inputs and Outputs

    /**
      * Sound a buzz.
      * @param flag state of buzzer (On or Off)
      */
    //% blockId="bitbot_buzz" block="turn buzzer%flag"
    //% flag.shadow="toggleOnOff"
    //% weight=100
    //% subcategory="Inputs & Outputs"
    export function buzz(flag: boolean): void
    {
        let buzz = flag ? 1 : 0;
        if (getModel() == BBModel.Classic)
            pins.digitalWritePin(DigitalPin.P14, buzz);
        else
            pins.digitalWritePin(DigitalPin.P0, buzz);
    }

    /**
    * Read distance from sonar module connected to accessory connector.
    * @param unit desired conversion unit
    */
    //% blockId="bitbot_sonar" block="read sonar as%unit"
    //% weight=90
    //% subcategory="Inputs & Outputs"
    export function sonar(unit: BBPingUnit): number
    {
        // send pulse
        let trig = DigitalPin.P15;
        let echo = DigitalPin.P15;
        let maxDistance = 2000*37; // 2m
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
            d = pins.pulseIn(echo, PulseValue.High, maxDistance);
            if (d>0)
                break;
        }
        switch (unit)
        {
            case BBPingUnit.Centimeters: return Math.round(d / 37);
            case BBPingUnit.Inches: return Math.round(d / 94);
            default: return d;
        }
    }

    /**
      * Read line sensor.
      * @param sensor Line sensor to read.
      */
    //% blockId="bitbot_read_line" block="%sensor|line sensor"
    //% weight=80
    //% subcategory="Inputs & Outputs"
    export function readLine(sensor: BBLineSensor): number
    {
        if (getModel() == BBModel.Classic)
        {
            if (sensor == BBLineSensor.Left)
                return pins.digitalReadPin(DigitalPin.P11);
            else
                return pins.digitalReadPin(DigitalPin.P5);
        }
        else
        {
            let value = pins.i2cReadNumber(i2caddr, NumberFormat.Int8LE, false);
            if (sensor == BBLineSensor.Left)
                return value & 0x01;
            else
                return (value & 0x02) >> 1;
        }
    }

    /**
      * Read light sensor.
      * @param sensor Light sensor to read.
      */
    //% blockId="bitbot_read_light" block="%sensor|light sensor"
    //% weight=70
    //% subcategory="Inputs & Outputs"
    export function readLight(sensor: BBLightSensor): number
    {
        if (getModel() == BBModel.Classic)
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
        else
        {
            if (sensor == BBLightSensor.Left)
                return pins.analogReadPin(AnalogPin.P2);
            else
                return pins.analogReadPin(AnalogPin.P1);
        }
    }

    /**
      * Adjust opening of Talon attachment
      * @param degrees Degrees to open Talon (0 to 80). eg: 30
      */
    //% blockId="bitbot_set_talon" block="open talon%degrees|degrees"
    //% weight=60
    //% degrees.min=0 degrees.max=80
    //% subcategory="Inputs & Outputs"
    export function setTalon(degrees: number): void
    {
        degrees = clamp(degrees, 0, 80);
        if (getModel() == BBModel.Classic)
            pins.servoWritePin(AnalogPin.P15, degrees);
        else
            pins.servoWritePin(AnalogPin.P2, degrees);
    }

    /**
      * Position Servos on P1 and P2 (XL Only)
      * @param servo servo to control. P1 or P2
      * @param degrees Degrees to turn servo (0 to 180). eg: 90
      */
    //% blockId="BBSetServo" block="set servo%servo|to%degrees|degrees"
    //% weight=50
    //% degrees.min=0 degrees.max=180
    //% subcategory="Inputs & Outputs"
    export function bbSetServo(servo: BBServos, degrees: number): void
    {
        degrees = clamp(degrees, 0, 180);
        if (getModel() == BBModel.XL)
        {
            if (servo == BBServos.P1)
                pins.servoWritePin(AnalogPin.P1, degrees);
            else
                pins.servoWritePin(AnalogPin.P2, degrees);
        }
    }

    /**
      * Set speed and direction for continuous rotation Servos on P1 and P2 (XL Only)
      * @param servo servo to control. P1 or P2
      * @param direction rotate Forward or Reverse
      * @param speed rotational speed  (0 to 100). eg: 50
      */
    //% blockId="BB360Servo" block="continuous servo%servo|%direction at%speed|\\%"
    //% weight=40
    //% speed.min=0 speed.max=100
    //% subcategory="Inputs & Outputs"
    export function bb360Servo(servo: BBServos, direction: BBDirection, speed: number)
    {
        speed = clamp(speed, 0, 100);
        let dir = (direction == BBDirection.Forward) ? 1 : -1;
        let degrees = 90 + dir * speed * 90 / 100
        if (getModel() == BBModel.XL)
        {
            if (servo == BBServos.P1)
            {
                degrees = clamp(degrees - _p1Trim, 0, 180);
                if (speed <= _deadband)
                    pins.digitalWritePin(DigitalPin.P1, 0);
                else
                    pins.servoWritePin(AnalogPin.P1, degrees);
            }
            else
            {
                degrees = clamp(degrees - _p2Trim, 0, 180);
                if (speed <= _deadband)
                    pins.digitalWritePin(DigitalPin.P2, 0);
                else
                    pins.servoWritePin(AnalogPin.P2, degrees);
            }
        }
    }

    /**
      * Set deadband for continuous rotation Servos on P1 and P2 (XL Only)
      * @param deadband speed below which servos are off eg: 5
      */
    //% blockId="BBServoDeadband" block="continuous servo deadband%deadband|\\%"
    //% weight=30
    //% deadband.min=0 deadband.max=10
    //% subcategory="Inputs & Outputs"
    export function bbServoDeadband(deadband: number)
    {
        _deadband = clamp(deadband, 0, 5);
    }

    /**
      * Set trim for continuous rotation Servos on P1 and P2 (XL Only)
      * @param servo servo to slow down. P1 or P2
      * @param trim speed reduction eg: 5
      */
    //% blockId="BBServoTrim" block="continuous servo%servo|trim by%trim|\\%"
    //% weight=30
    //% trim.min=0 trim.max=50
    //% subcategory="Inputs & Outputs"
    export function bbServoTrim(servo: BBServos, trim: number)
    {
        if (servo == BBServos.P1)
        {
            _p1Trim = clamp(trim, 0, 50);
            _p2Trim = 0;
        }
        else
        {
            _p1Trim = 0;
            _p2Trim = clamp(trim, 0, 50);
        }
    }

    /**
      * Disable servos (Talon for both Classic & XL, P1 and P2 for XL only)
      */
    //% blockId="BBStopServos" block="disable all servos"
    //% weight=20
    //% subcategory="Inputs & Outputs"
    export function bbStopServos(): void
    {
        if (getModel() == BBModel.XL)
        {
            pins.digitalWritePin(DigitalPin.P1, 0);
            pins.digitalWritePin(DigitalPin.P2, 0);
        }
        else
            pins.digitalWritePin(DigitalPin.P15, 0);
    }

// Addon Boards

// 5x5 FireLed Matrix 

    /* create a FireLed band for the Matrix if not got one already. Default to brightness 40 */
    function mat5(): fireled.Band
    {
        if (!matrix5)
        {
            matrix5 = fireled.newBand(DigitalPin.P15, 25);
            matrix5.setBrightness(40);
        }
        return matrix5;
    }

    // update Matrix if _updateMode set to Auto
    function matUpdate(): void
    {
        if (_updateMode == BBMode.Auto)
            matShow();
    }

    /**
      * Clear all Matrix leds
      */
    //% blockId="matClear" block="Matrix clear"
    //% weight=100
    //% subcategory=Addons
    //% group="5x5 Matrix"
    //% blockGap=8
    export function matClear(): void
    {
        mat5().clearBand();
        matUpdate();
    }

    /**
      * Sets all Matrix LEDs to a given color
      * @param rgb RGB color of the LED
      */
    //% blockId="setMatrix" block="Matrix all pixels to%rgb=bb_colours"
    //% weight=90
    //% subcategory=Addons
    //% group="5x5 Matrix"
    //% blockGap=8
    export function setMatrix(rgb: number)
    {
        rawSetMatrix(rgb);
        matUpdate();
    }

    function rawSetMatrix(rgb: number)
    {
        mat5().setBand(rgb);
    }

    /**
     * Set single Matrix LED to a given color
     * @param ledId linear position of the LED (0 to 24)
     * @param rgb RGB color of the LED
     */
    //% blockId="setPixel" block="Matrix LED at%ledId|to%rgb=bb_colours"
    //% weight=80
    //% subcategory=Addons
    //% group="5x5 Matrix"
    //% blockGap=8
    export function setPixel(ledId: number, rgb: number): void
    {
        // need to map to match Microbit: top left is 0, bottom right is 24
        let x = 4 - ledId % 5;
        let y = 4 - Math.idiv(ledId, 5);
        mat5().setPixel(x + y*5, rgb);
        matUpdate();
    }

    /**
     * Set x, y position to a given color
     * @param x left/right position of the LED (0 to 4). Left is 0
     * @param y up/down position of the LED (0 to 4). Top is 0
     * @param rgb RGB color of the LED
     */
    //% blockId="setArrayPixel" block="Matrix LED at x,y%x|,%y|to%rgb=bb_colours"
    //% weight=70
    //% subcategory=Addons
    //% group="5x5 Matrix"
    //% blockGap=8
    export function setArrayPixel(x: number, y: number, rgb: number): void
    {
        rawArrayPixel(x, y, rgb);
        matUpdate();
    }

    function rawArrayPixel(x: number, y: number, rgb: number): void
    {
        mat5().setPixel((4-x) + (4-y)*5, rgb);
    }

    /**
      * Shows a rainbow pattern on all Matrix LEDs
      */
    //% blockId="matRainbow" block="Matrix rainbow"
    //% weight=60
    //% subcategory=Addons
    //% group="5x5 Matrix"
    //% blockGap=8
    export function matRainbow(): void
    {
        // TODO Fix so it uses top left to bottom right
        mat5().setRainbow();
        matUpdate();
    }

    /**
      * Draw Rectangle on Matrix
      * @param x1 x position to start
      * @param y1 y position to start
      * @param x2 x position to end
      * @param y2 y position to end
      * @param rgb colour to draw with
      * @param fill selct to fill in area
      */
    //% blockId="matRectangle"
    //% block="Matrix rectangle from x,y%x1|,%y1|to x,y%x2|,%y2 in%rgb=bb_colours|fill%fill"
    //% subcategory=Addons
    //% group="5x5 Matrix"
    //% weight=50
    //% inlineInputMode=inline
    //% fill.shadow="toggleYesNo"
    //% blockGap=8
    export function matRectangle(x1: number, y1: number, x2: number, y2: number, rgb: number, fill: boolean)
    {
        for (let x=x1; x <= x2; x++)
        {
            for (let y=y1; y <= y2; y++)
            {
                if (inRange(x, y) && (x==x1 || x==x2 || y==y1 || y==y2 || fill))
                    rawArrayPixel(x, y, rgb);
            }
        }
        matUpdate();
    }

    /* check x, y is within range */
    function inRange(x: number, y: number): boolean
    {
        return (x>=0 && x<5 && y>=0 && y<5);
    }

    /**
      * Shows an Eyeball on the Matrix
      * @param pos position of pupil (up, down, left, etc)
      * @param rgb colour of image
      * @param size size of pupil. Small or Large
      */
    //% blockId="matShowEyeball" block="Matrix eyeball%pos|in%rgb=bb_colours|%size"
    //% weight=50
    //% subcategory=Addons
    //% group="5x5 Matrix"
    //% blockGap=8
    export function matShowEyeball(pos: eyePos, rgb: number, size: eyeSize): void
    {
        rawSetMatrix(rgb);
        // Clear corners to make a circle-ish
        rawArrayPixel(0, 0, 0);
        rawArrayPixel(0, 4, 0);
        rawArrayPixel(4, 0, 0);
        rawArrayPixel(4, 4, 0);
        // draw pupil
        switch(pos)
        {
            case eyePos.Forward:
                (size==eyeSize.Small) ? rawArrayPixel(2,2,0) : pupil5(2,2); break;
            case eyePos.Down:
                (size==eyeSize.Small) ? rawArrayPixel(2,3,0) : pupil5(2,3); break;
            case eyePos.Up:
                (size==eyeSize.Small) ? rawArrayPixel(2,1,0) : pupil5(2,1); break;
            case eyePos.Left:
                (size==eyeSize.Small) ? rawArrayPixel(3,2,0) : pupil5(3,2); break;
            case eyePos.Right:
                (size==eyeSize.Small) ? rawArrayPixel(1,2,0) : pupil5(1,2); break;
            case eyePos.DownLeft:
                (size==eyeSize.Small) ? rawArrayPixel(3,3,0) : pupil4(2,2); break;
            case eyePos.DownRight:
                (size==eyeSize.Small) ? rawArrayPixel(1,3,0) : pupil4(1,2); break;
            case eyePos.UpLeft:
                (size==eyeSize.Small) ? rawArrayPixel(3,1,0) : pupil4(2,1); break;
            case eyePos.UpRight:
                (size==eyeSize.Small) ? rawArrayPixel(1,1,0) : pupil4(1,1); break;
        }
        matUpdate();
    }
 
     function pupil5(x: number, y: number)
     {
        rawArrayPixel(x, y, 0);
        rawArrayPixel(x+1, y, 0);
        rawArrayPixel(x-1, y, 0);
        rawArrayPixel(x, y+1, 0);
        rawArrayPixel(x, y-1, 0);
    }

     function pupil4(x: number, y: number)
     {
         rawArrayPixel(x, y, 0);
         rawArrayPixel(x+1, y, 0);
         rawArrayPixel(x, y+1, 0);
         rawArrayPixel(x+1, y+1, 0);
     }

    /**
      * Shows an Image on the Matrix
      * @param myImage image to show
      * @param rgb colour of image
      */
    //% blockId="showImage" block="Matrix image%myImage|in%rgb=bb_colours"
    //% weight=40
    //% subcategory=Addons
    //% group="5x5 Matrix"
    //% blockGap=8
    export function matShowImage(myImage: Image, rgb: number): void
    {
        //myImage.showImage(0);
        for (let i=0; i<5; i++)
        {
            for (let j=0; j<5; j++)
            {
                if (myImage.pixel(i, j))
                    rawArrayPixel(i, j, rgb);
            }
        }
        matUpdate();
    }


    /**
      * Show changes on Matrix
      */
    //% blockId="matShow" block="Matrix show changes"
    //% weight=30
    //% subcategory=Addons
    //% group="5x5 Matrix"
    //% blockGap=8
    export function matShow(): void
    {
        if (btDisabled)
            mat5().updateBand();
    }

    /**
     * Set the brightness of the Matrix
     * @param brightness a measure of LED brightness in 0-255. eg: 40
     */
    //% blockId="matBrightness" block="set Matrix brightness%brightness"
    //% brightness.min=0 brightness.max=255
    //% weight=20
    //% subcategory=Addons
    //% group="5x5 Matrix"
    //% blockGap=8
    export function matBrightness(brightness: number): void
    {
        mat5().setBrightness(brightness);
        matUpdate();
    }

// BitFace Addon
    /* create a FireLed band for the BitFace if not got one already. Default to brightness 40 */
    function bitf(): fireled.Band
    {
        if (!bitface)
        {
            bitface = fireled.newBand(DigitalPin.P15, 17);
            bitface.setBrightness(40);
        }
        return bitface;
    }

    function bitfUpdate(): void
    {
        if (btDisabled)
            bitf().updateBand();
    }

    function drawMouth(myList: number[], rgb: number)
    {
        for (let i=0; i<14; i++)
            bitf().setPixel(i, 0);
        for (let i=0; i<myList.length; i++)
            bitf().setPixel(myList[i], rgb);
    }

    /**
      * Sets all Bitface LEDs to a given color
      * @param rgb RGB color of the LED
      */
    //% blockId="setBitFace"
    //% block="set BitFace to%rgb=bb_colours"
    //% weight=100
    //% subcategory=Addons
    //% group="BitFace"
    //% blockGap=8
    export function setBitface(rgb: number)
    {
        bitf().setBand(rgb);
        bitfUpdate();
    }

    /**
      * Set BitFace eye(s) to selected colour
      * @param eye select the eye(s) to set
      * @param rgb colour to set
      */
    //% blockId="setBitEye"
    //% block="set BitFace%eye|eye(s) to%rgb=bb_colours"
    //% weight=90
    //% subcategory=Addons
    //% group="BitFace"
    //% blockGap=8
    export function setBitEye(eye: bfEyes, rgb: number)
    {
        if (eye == bfEyes.Left || eye == bfEyes.Both)
            bitf().setPixel(15, rgb);
        if (eye == bfEyes.Right || eye == bfEyes.Both)
            bitf().setPixel(16, rgb);
        bitfUpdate();
    }

    /**
      * Set BitFace nose to selected colour
      * @param rgb colour to set
      */
    //% blockId="setBitNose"
    //% block="set BitFace nose to%rgb=bb_colours"
    //% weight=80
    //% subcategory=Addons
    //% group="BitFace"
    //% blockGap=8
    export function setBitNose(rgb: number)
    {
        bitf().setPixel(14, rgb);
        bitfUpdate();
    }

    /**
      * Set BitFace mouth to selected style and colour
      * @param mouth style of mouth. eg: smile
      * @param rgb colour to set
      */
    //% blockId="setBitMouth"
    //% block="set BitFace mouth to%mouth|with%rgb=bb_colours"
    //% weight=70
    //% subcategory=Addons
    //% group="BitFace"
    //% blockGap=8
    export function setBitMouth(mouth: bfMouth, rgb: number)
    {
        switch (mouth)
        {
            case bfMouth.Smile: drawMouth(mouthSmile, rgb); break;
            case bfMouth.Grin: drawMouth(mouthGrin, rgb); break;
            case bfMouth.Sad: drawMouth(mouthSad, rgb); break;
            case bfMouth.Frown: drawMouth(mouthFrown, rgb); break;
            case bfMouth.Straight: drawMouth(mouthStraight, rgb); break;
            case bfMouth.Oooh: drawMouth(mouthOooh, rgb); break;
            case bfMouth.Eeeh: drawMouth(mouthEeeh, rgb); break;
        }
        bitfUpdate();
    }

    /**
     * Set the brightness of the BitFace
     * @param brightness a measure of LED brightness in 0-255. eg: 40
     */
    //% blockId="bitBrightness" block="set BitFace brightness%brightness"
    //% brightness.min=0 brightness.max=255
    //% weight=60
    //% subcategory=Addons
    //% group="BitFace"
    //% blockGap=8
    export function bitBrightness(brightness: number): void
    {
        bitf().setBrightness(brightness);
        bitfUpdate();
    }

// OLED 128x64 Addon

    /* create a new OLED object if needed */
    function oScreen(): firescreen.Screen
    {
        if (!oled)
        {
            oled = firescreen.newScreen(0x3c);
        }
        return oled;
    }

    /**
      * Show Text on OLED
      * @param text text string to display eg: 'Hello!'
      * @param x x position to start
      * @param y y position to start
      * @param inv inverse or normal text eg: false
      */
    //% blockId="OledText"
    //% block="OLED text%text|at x,y%x|,%y|inverse%inv"
    //% subcategory=Addons
    //% group="OLED 128x64"
    //% weight=100
    //% inlineInputMode=inline
    //% inv.shadow="toggleYesNo"
    //% blockGap=8
    export function oledText(text: string, x: number, y: number, inv: boolean)
    {
        oScreen().doText(text, x, y, inv);
    }

    /**
      * Show Number on OLED
      * @param num number to display eg: 100
      * @param x x position to start
      * @param y y position to start
      * @param inv inverse or normal text eg: false
      */
    //% blockId="OledNumber"
    //% block="OLED number%num|at x,y%x|,%y|inverse%inv"
    //% subcategory=Addons
    //% group="OLED 128x64"
    //% weight=90
    //% inlineInputMode=inline
    //% inv.shadow="toggleYesNo"
    //% blockGap=8
    export function oledNumber(num: number, x: number, y: number, inv: boolean)
    {
        oScreen().doNumber(num, x, y, inv);
    }

    /**
      * Update OLED from buffer
      */
    //% blockId="OledUpdate"
    //% block="OLED update"
    //% subcategory=Addons
    //% group="OLED 128x64"
    //% weight=80
    //% blockGap=8
    export function oledUpdate()
    {
        oScreen().updateScreen();
    }

    /**
      * Set Oled all White or all Black
      * @param set all OLED pixels on or off. eg: false
      */
    //% blockId="OledSet"
    //% block="OLED all pixels%set"
    //% set.shadow="toggleOnOff"
    //% subcategory=Addons
    //% group="OLED 128x64"
    //% weight=80
    //% blockGap=8
    export function oledSet(set: boolean)
    {
        oScreen().setScreen(set);
    }

    /**
      * Invert display colours Black <-> White
      * @param inv inverse video: eg: true
      */
    //% blockId="OledInvert" block="OLED invert text%inv"
    //% inv.shadow="toggleOnOff"
    //% subcategory=Addons
    //% group="OLED 128x64"
    //% weight=70
    //% blockGap=8
    export function oledInvert(inv: boolean)
    {
        oScreen().invertOled(inv);
    }

    /**
      * Zoom display
      * @param zoom zoomed text: eg: true
      */
    //% blockId="OledZoom" block="OLED zoom%zoom"
    //% zoom.shadow="toggleYesNo"
    //% subcategory=Addons
    //% group="OLED 128x64"
    //% weight=60
    //% blockGap=8
    export function oledZOOM(zoom: boolean)
    {
        oScreen().zoomOled(zoom);
    }

    /**
      * Plot pixel on OLED
      * @param x x position to plot
      * @param y y position to plot
      * @param doSet on or off. eg: true
      * @param update set true to show immediately on screen. requires updateOled otherwise. eg: true
      */
    //% blockId="OledPlotPixel"
    //% block="OLED pixel at x,y%x|,%y|to%doSet|with update%update"
    //% doSet.shadow="toggleOnOff"
    //% update.shadow="toggleYesNo"
    //% subcategory=Addons
    //% group="OLED 128x64"
    //% weight=50
    //% inlineInputMode=inline
    //% blockGap=8
    export function oledPlotPixel(x: number, y: number, doSet: boolean, update: boolean)
    {
        oScreen().plotPixel(x, y, doSet, update);
    }

    /**
      * draw a line from x1,y1 to x2,y2
      * @param x1 x start
      * @param y1 y start
      * @param x2 x end
      * @param y2 y end
      * @param doSet set or clear. eg: true
      * @param update set true to show immediately on screen. requires updateOled otherwise. eg: true
      */
    //% blockId="OledLine" block="OLED line from x,y%x1|,%y1|to x,y%x2|,%y2|set%doSet|update%update"
    //% inlineInputMode=inline
    //% doSet.shadow="toggleOnOff"
    //% update.shadow="toggleYesNo"
    //% subcategory=Addons
    //% group="OLED 128x64"
    //% weight=45
    //% inlineInputMode=inline
    //% blockGap=8
    export function oledLine(x1: number, y1: number, x2: number, y2: number, doSet: boolean, update: boolean)
    {
        oScreen().oledLine(x1, y1, x2, y2, doSet, update);
    }

    /**
      * draw a rectangle
      * @param x1 x start
      * @param y1 y start
      * @param x2 x finish
      * @param y2 y finish
      * @param doSet set or clear. eg: true
      * @param update set true to show immediately on screen. requires updateOled otherwise. eg: true
      */
    //% blockId="OledRectangle" block="OLED rectangle from x,y%x1|,%y1|to x,y%x2|,%y2|set%doSet|update%update"
    //% inlineInputMode=inline
    //% doSet.shadow="toggleOnOff"
    //% update.shadow="toggleYesNo"
    //% subcategory=Addons
    //% group="OLED 128x64"
    //% weight=30
    //% inlineInputMode=inline
    //% blockGap=8
    export function oledRectangle(x1: number, y1: number, x2: number, y2: number, doSet: boolean, update: boolean)
    {
        oScreen().oledRect(x1, y1, x2, y2, doSet, update);
    }

    /**
      * draw a circle
      * @param x x centre. eg: 60
      * @param y y centre. eg: 30
      * @param r radius. eg: 20
      * @param doSet set or clear. eg: true
      * @param update set true to show immediately on screen. Requires updateOled otherwise. eg: true
      */
    //% blockId="OledCircle" block="OLED circle at x,y%x|,%y|radius%r|set%doSet|update%update"
    //% inlineInputMode=inline
    //% doSet.shadow="toggleOnOff"
    //% update.shadow="toggleYesNo"
    //% subcategory=Addons
    //% group="OLED 128x64"
    //% weight=30
    //% inlineInputMode=inline
    //% blockGap=8
    export function oledCircle (x: number, y: number, r: number, doSet: boolean, update: boolean)
    {
        oScreen().oledCircle(x, y, r, doSet, update);
    }

}
