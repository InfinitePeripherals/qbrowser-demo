/**
 * @file - QBrowser.js
 * @version - Version 1.0.1
 * 
 * @author - Created by Infinite Peripherals
 * @copyright - Copyright © 2020 Infinite Peripherals Inc. All rights reserved.
 * 
 * @see - {@link https://github.com/InfinitePeripherals/qbrowser-demo|Demo Project}
 */
var QBrowser = new function()
{
    this.ERR_UNSUPPORTED = 1;
    this.ERR_USER_CANCEL = 2;
    this.ERR_TIMEOUT = 3;
    this.ERR_FAILED = 4;

    this.OrientationMasks = {
        Portrait: 6,
        PortraitHomeDown: 2,
        PortraitHomeUp: 4,
        Landscape: 24,
        LandscapeRight: 8,
        LandscapeLeft: 16,
        All: 30
    };

    /**
     * @class Settings
     * @classdesc Functions to get/set QBrowser settings
     */
    this.Settings = new function()
    {
        /* QBrowser Settings
         - defaultURL(string) - the URL that will be opened when QBrowser starts, set to blank to open the demonstration page
         - showNavigation(boolean) - enables or disables the navigation bar
         - enablePrint(boolean) - enables or disables print button on the navigation bar
         - busyLoader(boolean) - enables or disables the busy loader spinner
         - keyboardDisplayRequiresUserAction(boolean) - enables or disables keyboard display requires user touch input. Default is Enable. If enable, .focus() will not work.
         - mediaPlaybackRequiresUserAction(boolean) - enables or disables media playback needs user interaction. Default is Enable.
         - allowsInlineMediaPlayback(boolean) - enables or disables inline media playback. Default is Disable.
         - zoomMode(string) - the preferred zoom mode
         - inactivityReloadsHome(string) - the time out to reload homescreen
         - barcodeFunction(string) - javascript function that will be called, when barcode is scanned
         - emulateKeystrokes(boolean) - enables or disables keystroke emulation of the scanned barcode
         - submitForm(boolean) - enables or disables submitting the form after barcode have been scanned
         - emulateCR(boolean) - enables or disables sending carriage return command after barcode is scanned
         - emulateLF(boolean) - enables or disables sending line feed command after barcode is scanned
         - emulateTab(boolean) - enables or disables sending tab command after barcode is scanned
         - barcodeInNamedField(string) - if set, barcode data will be filled into the specified field name
         - barcodeInIDField(string) - if set, barcode data will be filled into the specified field ID
         - msrFunction(string) - javascript function that will be called, when magnetic card is swiped.
         - msrEncryptedFunction(string) - javascript function that will be called, when encrypted magnetic card is swiped.
         - bluetoothDiscoveryFunction(string) - javascript function that will be called, when a bluetooth device is discovered by the scanner.
         - passThrough(boolean) - enables or disables usb passthru when plug into computer usb port
         - usbCurrent(string) - the current that the device should draw from external cable. 0 = 500mA, 1 = 1000mA, 2 = 2400mA
         - externalCharging(boolean) - if enabled and Linea is attached, then Linea battery will be used to charge the iOS device battery
         - maxTTLMode(boolean) - controls charging mode. If enabled, Linea will charge often the iOS device to keep it full, this allows for longer life of both devices, but results in frequent charge phases. If disabled, the Linea will charge the iOS device only when its battery reaches 30%
         - bounceScroll(boolean) - enables or disables bounce when scroll to top or bottom edges
         - supportOpenWith(boolean) - enables or disables open documents with native apps on device
         - beepUponScan(boolean) - enables or disables beep sound after a scan
         - supportHTTPAuthentication(boolean) - enables or disables requires HTTP authentication
         - trustServer(boolean) - enables or disables trust server's certifcate
         - clearCookies(boolean) - enables or disables clearing out cookies when app launches
         - isSpeakerControl(boolean) - enables or disables Infinea IX built-in speaker control
         - isEnabledExternalSpeaker - enables or disables Infinea IX built-in speaker
         */

        /**
         * Requests QBrowser settings be sent to the provided callback function
         * @memberof Settings
         * @param {Function} settingsRead - Callback function that receives settings. Parameters:
         * - settings(array) - Array of settings
         * @example
         * // Example callback function to display all settings
         * function SettingsReceived(settings) {
         *     document.body.innerHTML += "<b>QBrowser settings:</b><br/>";
         *     for (var i in settings) {
         *         document.body.innerHTML += "<b>" + i + ": </b>" + settings[i].toString() + "<br/>";
         *     }
         * }
         */
        this.get = function(settingsRead)
        {
            NativeCall("settings.get", null, [settingsRead]);
        }

        /**
         * Sets QBrowser settings
         * @memberof Settings
         * @param {Object} settings - Object containing desired QBrowser settings. You can set one or multiple settings with a single call.
         * @example
         * // Example function to change some settings
         * QBrowser.Settings.set({showNavigation:true, barcodeFunction:"BarcodeReceived"});
         */
        this.set = function(settings)
        {
            NativeCall("settings.set", null, null, settings);
        }
        
        /**
         * Sets iOS screen orientation
         * @memberof Settings
         * @param {number} anOrientation - Desired orientation. Use constant from QBrowser.OrientationMasks.
         */
        this.setOrientation = function(anOrientation)
        {
            if (anOrientation >= 2 && anOrientation <= 30)
                NativeCall("settings.setOrientation", [anOrientation], null, null);
        }

        /**
         * Gets IPC device battery level
         * @memberof Settings
         * @param {Function} batteryLevelFunction - Callback function that receives battery level. Parameters:
         * - batteryLevel(string) - Battery level in format "capacity - voltage"
         * @param {Function} errorBatteryLevelFunction - Error callback function. Parameters:
         * - errorMessage(string) - Textual description of the error
         */
        this.getBatteryLevel = function(batteryLevelFunction, errorBatteryLevelFunction)
        {
            NativeCall("settings.getBatteryLevel", null, [batteryLevelFunction, errorBatteryLevelFunction], null);
        }

        /**
         * Clears the given cache, removing all URL response objects that it stores.
         * @memberof Settings
         */
        this.clearCache = function()
        {
            NativeCall("settings.clearCache", null, null, null);
        }

        /**
         * Sends debug log
         * @memberof Settings
         */
        this.sendLog = function()
        {
            NativeCall("settings.sendLog", null, null, null);
        }

        /**
         * Allows location tracking request. Default is False.
         * @memberof Settings
         * @param {boolean} isEnabled - Location tracking enabled or disabled
         */
        this.locationEnabled = function(isEnabled)
        {
            NativeCall("settings.locationEnabled", [isEnabled], null, null);
        }
    };

    this.Folder = {
        NONE: 0,
        TEMP: 1,
        DOCUMENTS: 2,
    };

    /**
     * @class Notify
     * @classdesc Functions to give various notifications to the user (i.e. alerts, vibrations, beeps etc.)
     */
    this.Notify = new function()
    {
        /**
         * Shows a pop-up message box on the device and returns the user response
         * @memberof Notify
         * @param {string} title - Title of message (this can be null)
         * @param {string} message - Message body
         * @param {Array} buttons - Array of button names. Ex: {"Accept", "Decline"}. This parameter can be null, in which case a single "Ok" button is displayed.
         * @param {Function} onDismiss - Callback function that receives the user response. Parameters:
         * - buttonIndex(number) - Button pressed to dismiss message.
         * @example
         * // Example function to display a pop-up
         * QBrowser.Notify.message("Traffic Ahead", "Do you wish to reroute?", ["Reroute", "Dismiss"], MessageDismissed);
         * 
         * // Example callback function
         * function MessageDismissed(buttonIndex) {
         *     PrintOutput("Option " + buttonIndex + " selected");
         * }
         */
        this.message = function(title, message, buttons, onDismiss)
        {
            NativeCall("notify.message", [title, message, buttons], [onDismiss]);
        };

        /**
         * Vibrates the device
         * @memberof Notify
         */
        this.vibrate = function()
        {
            NativeCall("notify.vibrate", null);
        };

        /**
         * Plays a short beep on the device
         * @memberof Notify
         */
        this.beep = function()
        {
            NativeCall("notify.beep", null);
        };

        /**
         * Sets a custom beep to play after successful scan
         * @memberof Notify
         * @param {number} volume - Value from 0 - 100
         * @param {Array} beepData - Array of integer values specifying pairs of tone(Hz) and duration(ms)
         * @example
         * // Sample beep sequence consisting of 2 tones, each with 400ms duration, first one 2000Hz and second one 5000Hz
         * QBrowser.Notify.beepSequence(100, [2000, 400, 5000, 400]);
         */
         this.beepSequence = function(volume, beepData)
        {
            NativeCall("notify.beepSequence", [volume, beepData]);
        };

        /**
         * Shows a modal activity indicator indicating a long running function is in progress
         * @memberof Notify
         */
        this.showActivityIndicator = function()
        {
            NativeCall("notify.showActivityIndicator");
        }
        
        /**
         * Hides the modal activity indicator
         * @memberof Notify
         */
        this.hideActivityIndicator = function()
        {
            NativeCall("notify.hideActivityIndicator");
        }

        /**
         * Downloads a sound file and plays it on the device. If the file is already present on the device it uses the local copy.
         * @memberof Notify
         * @param {string} url - File url
         * @param {number} folder - Folder index for where to store sound file. Use constant from QBrowser.Folder.
         * - Folder.NONE - Sound file will not be stored locally. Every time you play it, it will be downloaded again.
         * - Folder.TEMP - Sound file will be stored in a temporaly folder which gets emptied once every 3 days or when the device runs out of space
         * - Folder.DOCUMENTS - Sound file will be stored in the documents folder permanently
         * @param {Function} onFailure - Callback function if call failed. Parameters:
         * - errorCode(number) - Error code
         * - errorDescription(string) - Textual description of the error
         * @example
         * QBrowser.Notify.play("http://www.soundjay.com/button/beep-1.wav", QBrowser.Folder.NONE, PlayFailed);
         */
        this.play = function(url, folder, onFailure)
        {
            NativeCall("notify.play", [url, folder], [onFailure]);
        };

        /**
         * Enables or disables external speaker
         * @memberof Notify
         * @param {boolean} enabled - Enable or disable external speaker
         * @param {Function} successFunction - Callback function if successful
         * @param {Function} errorFunction - Error callback function. Parameters:
         * - errorMessage(string) - Textual description of the error
         */
        this.enableLineaSpeaker = function(enabled, successFunction, errorFunction)
        {
            NativeCall("notify.enableLineaSpeaker", [enabled], [successFunction, errorFunction]);
        }

        /**
         * Enables or disables controllable LEDs on the device based on bit mask
         * @memberof Notify
         * @param {number} bitmask - Bit mask of the enabled LEDs [Disabled = 0, Green = 1, Red = 2, Orange = 3, Blue = 4]
         * @param {Function} successFunction - Callback function if successful
         * @param {Function} errorFunction - Error callback function. Parameters:
         * - errorMessage(string) - Textual description of the error
         */
        this.controlLEDsWithBitMask = function(bitmask, successFunction, errorFunction)
        {
            NativeCall("notify.controlLEDsWithBitMask", [bitmask], [successFunction, errorFunction]);
        }

        /**
         * Vibrates device for a specified amount of time
         * @memberof Notify
         * @param {number} time - The amount of time the vibration will be active
         */
        this.externalVibrationForTime = function(time)
        {
            NativeCall("notify.externalVibrationForTime", [time]);
        }
    };

    this.SocketEvents = {
        OpenCompleted: 1,
        BytesAvailable: 2,
        SpaceAvailable: 4,
        ErrorOccured: 8,
        EndEncountered: 16
    };

    /**
     * @class Socket
     * @classdesc Functions to read/write to web sockets
     */
    this.Socket = new function()
    {
        /**
         * Open a new socket connection
         * @memberof Socket
         * @param {string} socketName - Name to identify this socket connection
         * @param {string} host - Hostname to which the socket streams should connect
         * @param {string} port -  TCP port number
         * @param {Function} statusFunction - Callback function that receives status updates
         */
        this.open = function(socketName, host, port, statusFunction)
        {
            NativeCall("socket.open", [socketName, host, port], [statusFunction]);
        }

        /**
         * Close socket connection
         * @memberof Socket
         * @param {string} socketName - Name of socket connection
         */
        this.close = function(socketName)
        {
            NativeCall("socket.close", [socketName]);
        }

        /**
         * Read from socket
         * @memberof Socket
         * @param {string} socketName - Name of socket connection
         * @param {number} maxLength - Maximum number of bytes to read.
         * @param {Function} readFunction - Callback function for a successful read
         * @param {Function} failFunction - Callback function if read failed
         */
        this.read = function(socketName, maxLength, readFunction, failFunction)
        {
            NativeCall("socket.read", [socketName, maxLength], [readFunction, failFunction]);
        }

        /**
         * Write to socket
         * @memberof Socket
         * @param {string} socketName - Name of socket connection
         * @param {string} data - Data string to send
         * @param {Function} failFunction - Callback function if write failed
         */
        this.write = function(socketName, data, failFunction)
        {
            setTimeout(function()
            {
                NativeCall("socket.write", [socketName, data], [failFunction]);
            }, 0); // locks unless in a thread.
        }
    }

    /**
     * @class Crypto
     * @classdesc Functions that allow encrypting and decrypting
     */
    this.Crypto = new function()
    {
        /**
         * Binary In, Base64 Encrypt Out
         * @memberof Crypto
         * @param {string} key - Encryption key
         * @param {string} data - Data string to encrypt
         * @param {Function} cbSuccess - Callback function that receives output
         * @param {Function} cbFail - Callback function if call failed
         */
        this.tripleDesEncrypt = function(key, data, cbSuccess, cbFail)
        {
            NativeCall("crypto.tripleDesEncrypt", [key, data], [cbSuccess, cbFail]);
        };

        /**
         * Base64 Encrypt In, Binary Out
         * @memberof Crypto
         * @param {string} key - Encryption key
         * @param {string} data - Base64 string to decrypt
         * @param {Function} cbSuccess - Callback function that receives output
         * @param {Function} cbFail - Callback function if call failed
         */
        this.tripleDesDecrypt = function(key, data, cbSuccess, cbFail)
        {

            NativeCall("crypto.tripleDesDecrypt", [key, data], [cbSuccess, cbFail]);
        };
        
        /**
         * Binary In, Base64 Encrypt Out
         * @memberof Crypto
         * @param {string} key - Encryption key
         * @param {string} data - Data string to encrypt
         * @param {Function} cbSuccess - Callback function that receives output
         * @param {Function} cbFail - Callback function if call failed
         */
        this.aesEncrypt = function(key, data, cbSuccess, cbFail)
        {
            NativeCall("crypto.aesEncrypt", [key, data], [cbSuccess, cbFail]);
        };

        /**
         * Base64 Encrypt In, Binary Out
         * @memberof Crypto
         * @param {string} key - Encryption key
         * @param {string} data - Base64 string to decrypt
         * @param {Function} cbSuccess - Callback function that receives output
         * @param {Function} cbFail - Callback function if call failed
         */
        this.aesDecrypt = function(key, data, cbSuccess, cbFail)
        {
            NativeCall("crypto.aesDecrypt", [key, data], [cbSuccess, cbFail]);
        };
    };

    /**
     * @class TTS
     * @classdesc Functions to narrate text into speech
     */
    this.TTS = new function()
    {
        /**
         * Narrates normal language text into speech
         * @memberof TTS
         * @param {string} whatToSay - String of what to narrate
         * @param {number} volume - Volume of speech (0 - 100). Default = 100.
         * @param {number} rate - Rate of speech. Default = 0.3 with greater values getting faster.
         * @param {string} voice - Voice of speech. Ex: en-US (U.S. English), fr-CA (French Canadian). Default = en-US.
         */
        this.say = function(whatToSay, volume, rate, voice)
        {
            NativeCall("TTS.say", [whatToSay, volume, rate, voice]);
        }
    }

    this.ImageSource = {
        PHOTOLIBRARY: 0,
        SAVEDPHOTOALBUM: 1
    };

    /**
     * @class Image
     * @classdesc Functions to take, import and handle images
     */
    this.Image = new function()
    {
        /**
         * Uses device's camera to capture an image and send it back
         * @memberof Image
         * @param {Function} onImage - JavaScript function that receives the image data. Parameters:
         * - image(string) - Base64 encoded image data.
         * @param {Function} onFailure - JavaScript function called if an error occurs. Parameters:
         * - errorCode(number) - Error code
         * - errorDescription(string) - Textual description of the error.
         * @param {Object} settings - Optional object of settings you can pass. Supported settings:
         * - quality(number) - Controls image quality. The higher the quality, the bigger the resulting image. Valid values: 10 - 100, default is 75.
         * @example
         * // Example callback function that receives image data
         * function ImageSuccess(picture) {
         *     document.body.innerHTML+="<img name=\"importedImage\" src=\"data:image/jpeg;base64,"+picture+"\" alt=\"1231232.jpg\" /><br/>";
         * }
         * 
         * // Example callback function if failure
         * function ImageError(errorCode, errorDescription) {
         *     alert("Image failed ("+errorCode+"): "+errorDescription);
         * }
         * 
         * // Example function call
         * QBrowser.Image.fromCamera(ImageSuccess, ImageError, {quality:50});
         */
        this.fromCamera = function(onImage, onFailure, settings)
        {
            NativeCall("image.fromCamera", null, [onImage, onFailure], settings);
        };

        /**
         * Presents an interface for the user to select an image from the device's photo album
         * @memberof Image
         * @param {number} imageSource - Source album to use. Use constant from QBrowser.ImageSource.
         * @param {Function} onImage - JavaScript function that receives the image data. Parameters:
         * - image(string) - Base64 encoded image data.
         * @param {Function} onFailure - JavaScript function called if an error occurs. Parameters:
         * - errorCode(number) - Error code
         * - errorDescription(string) - Textual description of the error.
         * @param {Object} settings - Optional object of settings you can pass. Supported settings:
         * - quality(number) - Controls image quality. The higher the quality, the bigger the resulting image. Valid values: 10 - 100, default is 75.
         * @example
         * // Example function call
         * QBrowser.Image.fromAlbum(QBrowser.ImageSource.PHOTOLIBRARY, ImageSuccess, ImageError);
         */
        this.fromAlbum = function(imageSource, onImage, onFailure, settings)
        {
            NativeCall("image.fromAlbum", [imageSource], [onImage, onFailure], settings);
        };

        /**
         * @todo - Not yet supported
         */
        this.fromFile = function(source, onImage, onFailure, settings)
        {
            NativeCall("image.fromFile", [source], [onImage, onFailure], settings);
        };

        /**
         * Returns a TIFF CCITT B&W compressed image
         * @memberof Image
         * @param {number} width - Image width in pixels
         * @param {number} height - Image height in pixels
         * @param {string} data - Base64 encoded image data
         * @param {Function} onSuccess - JavaScript function that receives the image data. Parameters:
         * - image(string) - Base64 encoded image data.
         * @param {Function} onFailure - JavaScript function called if an error occurs. Parameters:
         * - errorCode(number) - Error code
         * - errorDescription(string) - Textual description of the error.
         */
        this.getTiff = function(width, height, data, onSuccess, onFailure)
        {
            NativeCall("image.getTiff", [width, height, data], [onSuccess, onFailure]);
        }

        /**
         * Helper function that provides a sample image for testing purposes
         * @memberof Image
         * @param {Function} onImage - JavaScript function that receives the image data. Parameters:
         * - image(string) - Base64 encoded image data.
         * @param {Object} settings - Optional object of settings you can pass. Supported settings:
         * - quality(number) - Controls image quality. The higher the quality, the bigger the resulting image. Valid values: 10 - 100, default is 75.
         * @example
         * // Example callback function that receives image data
         * function ImageSuccess(picture) {
         *     document.body.innerHTML+="<img name=\"importedImage\" src=\"data:image/jpeg;base64,"+picture+"\" alt=\"1231232.jpg\" /><br/>";
         * }
         * 
         * // Example function call
         * QBrowser.Image.fromCamera(ImageSuccess, {quality:50});
         */
        this.simulate = function(onImage, settings)
        {
            NativeCall("image.simulate", null, [onImage], settings);
        };
    };

    /**
     * @class Navigation
     * @classdesc Functions to handle GPS navigation
     */
    this.Navigation = new function()
    {
        /**
         * Uses Apple Maps to provide turn by turn directions from your current location to the provided address
         * @memberof Navigation
         * @param {string} toAddress - The destination address
         * @param {Function} successFunction - JavaScript function called if successful
         * @param {Function} errorFunction - JavaScript function called if an error occurs
         */
        this.navigateTo = function(toAddress, successFunction, errorFunction)
        {
            NativeCall("navigation.navigateTo", [toAddress], [successFunction, errorFunction]);
        }
    }

    /**
     * @class RFID
     * @classdesc Functions for reading RFID cards
     */
    this.RFID = new function()
    {
        /**
         * Initializes and powers on the RF card reader module. Call this function before any other RF card functions. The module power consumption is highly optimized, so it can be left on for extended periods of time.
         * @memberof RFID
         * @param {Function} successFunction - JavaScript function called if successful
         * @param {Function} errorFunction - JavaScript function called if an error occurs
         */
        this.rfInit = function(successFunction, errorFunction)
        {
            NativeCall("rfid.rfInit", null, [successFunction, errorFunction]);
        }

        /**
         * Powers down RF card reader module. Call this function after you are done with the reader.
         * @memberof RFID
         * @param {Function} successFunction - JavaScript function called if successful
         * @param {Function} errorFunction - JavaScript function called if an error occurs
         */
        this.rfClose = function(successFunction, errorFunction)
        {
            NativeCall("rfid.rfClose", null, [successFunction, errorFunction]);
        }

        /**
         * Sets the callback function for when an RFID card is detected
         * @memberof RFID
         * @param {Function} detectFunction - JavaScript function called when an RFID card is detected
         */
        this.onRFCardDetected = function(detectFunction)
        {
            NativeCall("rfid.onRFCardDetected", null, [detectFunction]);
        }

        /**
         * Sets the callback function for when an RFID card is removed
         * @memberof RFID
         * @param {Function} removeFunction - JavaScript function called when an RFID card is removed
         */
        this.onRFCardRemoved = function(removeFunction)
        {
            NativeCall("rfid.onRFCardRemoved", null, [removeFunction]);
        }

        /**
         * Call this function once you are done with the card, a delegate call rfCardRemoved will be called when the card leaves the RF field and new card is ready to be detected
         * @memberof RFID
         * @param {number} cardIndex - Index of the card as sent by onRFCardDetected delegate call
         * @param {Function} onSuccessFunction - JavaScript function called if successful
         * @param {Function} onErrorFunction - JavaScript function called if an error occurs
         */
        this.rfRemoveCard = function(cardIndex, onSuccessFunction, onErrorFunction)
        {
            NativeCall("rfid.rfRemoveCard", [cardIndex], [onSuccessFunction, onErrorFunction]);
        }

        /**
         * Authenticate mifare card block with direct key data. This is less secure method, as it requires the key to be present in the program, the prefered way is to store a key once in a secure environment and then authenticate using the stored key.
         * @memberof RFID
         * @param {number} cardIndex - Index of the card as sent by onRFCardDetected delegate call
         * @param {number} address - Address of the block to authenticate
         * @param {string} key - 6 byte key
         * @param {Function} onSuccessFunction - JavaScript function called if successful
         * @param {Function} onErrorFunction - JavaScript function called if an error occurs
         */
        this.mfAuthByKey = function(cardIndex, address, key, onSuccessFunction, onErrorFunction)
        {
            NativeCall("rfid.mfAuthByKey", [cardIndex, address, key], [onSuccessFunction, onErrorFunction]);
        }

        /**
         * Authenticate mifare card block with previously stored key. This the prefered method, as no key needs to reside in application.
         * @memberof RFID
         * @param {number} cardIndex - Index of the card as sent by onRFCardDetected delegate call
         * @param {string} type - Key type, either 'A' or 'B'
         * @param {number} address - Address of the block to authenticate
         * @param {number} keyIndex - Index of the stored key, you can have up to 8 keys stored (0-7)
         * @param {Function} onSuccessFunction - JavaScript function called if successful
         * @param {Function} onErrorFunction - JavaScript function called if an error occurs
         */
        this.mfAuthByStoredKey = function(cardIndex, type, address, keyIndex, onSuccessFunction, onErrorFunction)
        {
            NativeCall("rfid.mfAuthByStoredKey", [cardIndex, type, address, keyIndex], [onSuccessFunction, onErrorFunction]);
        }

        /**
         * Reads one more more blocks of data from Mifare Classic/Ultralight cards. A single read operation gets 16 bytes of data, so you can pass 32 on length to read 2 blocks, etc.
         * @memberof RFID
         * @param {number} cardIndex - Index of the card as sent by onRFCardDetected delegate call 
         * @param {number} address - Address of the block to read
         * @param {number} length - Number of bytes to read, this must be multiple of block size (16 bytes)
         * @param {Function} onSuccessFunction - JavaScript function called if successful
         * @param {Function} onErrorFunction - JavaScript function called if an error occurs
         */
        this.mfRead = function(cardIndex, address, length, onSuccessFunction, onErrorFunction)
        {
            NativeCall("rfid.mfRead", [cardIndex, address, length], [onSuccessFunction, onErrorFunction]);
        }

        /**
         * Store key in the internal module memory for later use
         * @memberof RFID
         * @param {number} keyIndex - Index of the stored key, you can have up to 8 keys stored (0-7)
         * @param {string} type - Key type, either 'A' or 'B'
         * @param {string} key - 6 byte key
         * @param {Function} onSuccessFunction - JavaScript function called if successful
         * @param {Function} onErrorFunction - JavaScript function called if an error occurs
         */
        this.mfStoreKeyIndex = function(keyIndex, type, key, onSuccessFunction, onErrorFunction)
        {
            NativeCall("rfid.mfStoreKeyIndex", [keyIndex, type, key], [onSuccessFunction, onErrorFunction]);
        }

        /**
         * Performs 3DES authentication of Mifare Ultralight C card using the given key
         * @memberof RFID
         * @param {number} cardIndex - Index of the card as sent by onRFCardDetected delegate call 
         * @param {string} key - 16 bytes 3DES key to authenticate with
         * @param {Function} onSuccessFunction - JavaScript function called if successful
         * @param {Function} onErrorFunction - JavaScript function called if an error occurs
         */
        this.mfUlcAuthByKey = function(cardIndex, key, successFunction, errorFunction)
        {
            NativeCall("rfid.mfUlcAuthByKey", [cardIndex, key], [successFunction, errorFunction]);
        }

        /**
         * Sets the 3DES key of Mifare Ultralight C cards
         * @memberof RFID
         * @param {number} cardIndex - Index of the card as sent by onRFCardDetected delegate call 
         * @param {string} key - 16 bytes 3DES key to set
         * @param {Function} onSuccessFunction - JavaScript function called if successful
         * @param {Function} onErrorFunction - JavaScript function called if an error occurs
         */
        this.mfUlcSetKey = function(cardIndex, key, onSuccessFunction, onErrorFunction)
        {
            NativeCall("rfid.mfUlcSetKey", [cardIndex, key], [onSuccessFunction, onErrorFunction]);
        }

        /**
         * Writes one more more blocks of data to Mifare Classic/Ultralight cards. A single write operation stores 16 bytes of data, so you can pass 32 on length to write 2 blocks, etc
         * @memberof RFID
         * @param {number} cardIndex - Index of the card as sent by onRFCardDetected delegate call 
         * @param {number} address - Address of the block to write
         * @param {string} data - Data to write, must be multiple of the block size (16 bytes)
         * @param {Function} onSuccessFunction - JavaScript function called if successful
         * @param {Function} onErrorFunction - JavaScript function called if an error occurs
         */
        this.mfWrite = function(cardIndex, address, data, onSuccessFunction, onErrorFunction)
        {
            NativeCall("rfid.mfWrite", [cardIndex, address, data], [onSuccessFunction, onErrorFunction]);
        }
    }

    /**
     * @class Controller
     * @classdesc Allows a secondary non-visual page that can build functions and UI on top of any loaded page
     */
    this.Controller = new function()
    {
        /**
         * Loads a webpage
         * @memberof Controller
         * @param {string} url - URL of the webpage to load
         */
        this.loadPage = function(url)
        {
            NativeCall("controller.loadPage", [url]);
        }

        /**
         * Navigates forward if possible
         * @memberof Controller
         */
        this.goForward = function()
        {
            NativeCall("controller.forward");
        }

        /**
         * Navigates backward if possible
         * @memberof Controller
         */
        this.goBack = function()
        {
            NativeCall("controller.back");
        }

        /**
         * Navigates to the home page
         * @memberof Controller
         */
        this.goHome = function()
        {
            NativeCall("controller.home");
        }

        /**
         * Runs a JS script
         * @memberof Controller
         * @param {string} script - The script to run
         */
        this.runJavascript = function(script)
        {
            NativeCall("controller.runJavascript", [script]); // This is where we can add and extend loaded webpages!  Deceptively powerful.
        }
    }

    /**
     * @class GPS
     * @classdesc Functions for location tracking.
     */
    this.GPS = new function()
    {
        /**
         * Sets the listening function
         * @memberof GPS
         * @param {Function} listenerFunction - Callback function that receives location updates.
         */
        this.setListener = function(listenerFunction)
        {
            NativeCall("gps.setListener", null, [listenerFunction], null);
        }

        /**
         * Starts the generation of updates that report the user’s current location
         * @memberof GPS
         * @param {number} locationAccuracy - Accuracy of the location data that your app wants to receive
         * @param {number} distanceFilter - Minimum distance (measured in meters) a device must move horizontally before an update event is generated
         */
        this.startMonitoring = function(locationAccuracy, distanceFilter)
        {
            NativeCall("gps.startMonitoring", [locationAccuracy, distanceFilter], null, null);
        }

        /**
         * Starts the generation of updates based on significant location changes
         * @memberof GPS
         */
        this.startMonitoringSignificant = function()
        {
            NativeCall("gps.startMonitoringSignificant", null, null, null);
        }

        /**
         * Stops the generation of location updates
         * @memberof GPS
         */
        this.stopMonitoring = function()
        {
            NativeCall("gps.stopMonitoring", null, null, null);
        }
    }

    this.BarcodeScanType = {
        UPCA: 1,
        CODABAR: 2,
        CODE25_NI2OF5: 3,
        CODE25_I2OF5: 4,
        CODE39: 5,
        CODE93: 6,
        CODE128: 7,
        CODE11: 8,
        CPCBINARY: 9,
        DUN14: 10,
        EAN2: 11,
        EAN5: 12,
        EAN8: 13,
        EAN13: 14,
        EAN128: 15,
        GS1DATABAR: 16,
        ITF14: 17,
        LATENT_IMAGE: 18,
        PHARMACODE: 19,
        PLANET: 20,
        POSTNET: 21,
        INTELLIGENT_MAIL: 22,
        MSI_PLESSEY: 23,
        POSTBAR: 24,
        RM4SCC: 25,
        TELEPEN: 26,
        UK_PLESSEY: 27,
        PDF417: 28,
        MICROPDF417: 29,
        DATAMATRIX: 30,
        AZTEK: 31,
        QRCODE: 32,
        MAXICODE: 33,
        UPCA_2: 39,
        UPCA_5: 40,
        UPCE: 41,
        UPCE_2: 42,
        UPCE_5: 43,
        EAN13_2: 44,
        EAN13_5: 45,
        EAN8_2: 46,
        EAN8_5: 47,
        CODE39_FULL: 48,
        ITA_PHARMA: 49,
        CODABAR_ABC: 50,
        CODABAR_CX: 51,
        SCODE: 52,
        MATRIX_2OF5: 53,
        IATA: 54,
        KOREAN_POSTAL: 55,
        CCA: 56,
        CCB: 57,
        CCC: 58
    };

    /**
     * @class Barcode
     * @classdesc Functions to handle and control compatible barcode scanners attached to the device.
     * <br><br>
     * QBrowser automatically sends barcodes to the function, specified in app settings (barcodeFunction). The format of this function is: function BarcodeData(barcode, type, typeText)<br><br>
     * Parameters:
     * - barcode(string) - barcode data
     * - type(integer) - barcode type number, as returned by the barcode engine (i.e. 13 - refer to QBrowser.BarcodeScanType for complete listing)
     * - typeText(string) - barcode type converted to string for easy display (i.e. "EAN-13")
     */
    this.Barcode = new function()
    {
        /**
         * Helper function to simulate a barcode scan for testing purposes. The simulated barcode is sent just like normal a scanned one will be.
         * @memberof Barcode
         * @param {string} barcode - Optional barcode string, you can pass null for default one
         * @param {number} type - Optional barcode type or null for EAN-13
         */
        this.simulate = function(barcode, type)
        {
            NativeCall("scanner.simulate", [barcode, type]);
        };

        /**
         * Sets a callback function to receive updates on the scanner's status
         * @memberof Barcode
         * @param {Function} scannerStatus - Callback function that updates the scanner status in realtime. Parameters:<br><br>
         * info(object)
         * - info.connected(boolean) - indicates if supported reader is connected
         * - info.name(string) - reader name
         * - info.version(string) - reader firmware version
         * @example
         * // Example callback function
         * function BarcodeStatus(info)
         * {
         *     if (info.connected)
         *         document.body.innerHTML += "Connected barcode reader <b>" + info.name + " " + info.version + "</b>";
         *     else
         *         document.body.innerHTML += "Barcode reader disconnected<br/>";
         * }
         */
        this.monitorStatus = function(scannerStatus)
        {
            NativeCall("scanner.monitorStatus", null, [scannerStatus]);
        };

        /**
         * Starts the hardware scanner
         * @memberof Barcode
         */
        this.startScan = function()
        {
            NativeCall("scanner.startScan", null, null);
        }

        /**
         * Stops the hardware scanner
         * @memberof Barcode
         */
        this.stopScan = function()
        {
            NativeCall("scanner.stopScan", null, null);
        }
    };

    /**
     * @class MagStripe
     * @classdesc Functions to monitor and control compatible magnetic card readers attached to the device.
     * <br><br>
     * QBrowser automatically sends magnetic card data to the function, specified in the settings (msrFunction). The format of the function is: function MagneticCardData(card)<br><br>
     * Parameters:
     * - card.tracks(array) - an array with card track data. Every track is returned as a string or null if the track was not read
     * - card.cardholderName(string) - in case of valid financial card and correctly parsed track 1, cardholder name is stored here
     * - card.accountNumber(string) - in case of valid financial card and correctly parsed track 1 or 2, account number is stored here
     * - card.expirationMonth(number) - in case of valid financial card and correctly parsed track 1 or 2, expiration month is stored here
     * - card.expirationYear(number) - in case of valid financial card and correctly parsed track 1 or 2, expiration year is stored here
     * <br><br>
     * In the case of encrypted card data, QBrowser will send the data to the function, specified in settings (msrEncryptedFunction). Format: EncryptedMagneticCardData(encryption, tracks, data)<br><br>
     * Parameters:
     * - encryption - the encryption type
     * - tracks - number of tracks
     * - data - the encrypted card data in hex
     */
    this.MagStripe = new function()
    {
        /**
         * Helper function to simulate magnetic card scan for testing purposes. The simulated magnetic card data is sent to the function in QBrowsers settings.
         * @memberof MagStripe
         */
        this.simulate = function()
        {
            NativeCall("msreader.simulate");
        };

        /**
         * Helper function to monitor the status of the supported magnetic card readers. This function is used to receive realtime notifications when supported a reader becomes available.
         * @memberof MagStripe
         * @param {Function} readerStatus - Callback function that updates the card reader status in real time. Parameters: info(object) 
         * - info.connected(boolean) - indicates if supported reader is connected
         * - info.name(string) - reader name
         * - info.version(string) - reader firmware version
         * @example
         * function MSStatus(info)
         * {
         *     if (info.connected)
         *         document.body.innerHTML+="Connected magnetic card reader <b>"+info.name+" "+info.version+"</b>, find me some cards!<br/>";
         *     else
         *         document.body.innerHTML+="Hey I want my magnetic card reader back!<br/>";
         * }
         */
        this.monitorStatus = function(readerStatus)
        {
            NativeCall("msreader.monitorStatus", null, [readerStatus]);
        };

        /**
         * Config the mask card data
         * @memberof MagStripe
         * @param {boolean} boolExpiration - show expiration
         * @param {number} unmaskedDigitsAtStart - number of unmasked digits at start, max is 6
         * @param {number} unmaskedDigitsAtEnd - number of unmasked digits at end, max is 6
         * @param {function} successFunction - Callback function on success
         * @param {function} errorFunction - Error function
         * @example
         * QBrowser.MagStripe.setEMSRMaskedData(true, 4, 4, EMSRSuccess, EMSRFailed);
         */
        this.setEMSRMaskedData = function(boolExpiration, unmaskedDigitsAtStart, unmaskedDigitsAtEnd, successFunction, errorFunction)
        {
            var isExpiration = boolExpiration ? 1 : 0;
            NativeCall("msreader.setEMSRMaskedData", [isExpiration, unmaskedDigitsAtStart, unmaskedDigitsAtEnd], [successFunction, errorFunction]);
        }

        /**
         * Set the active head for scanner
         * @memberof MagStripe
         * @param {number} headIndex - Currently real head is on index 0, emulated head is on 1
         * @param {function} successFunction - Callback function on success
         * @param {function} errorFunction - Error function
         */
        this.setActiveHead = function(headIndex, successFunction, errorFunction)
        {
            NativeCall("msreader.setActiveHead", [headIndex], [successFunction, errorFunction]);
        }

        /**
         * Set the encryption type
         * @memberof MagStripe
         * @param {number} encryptionIndex - index of encryption type. Use 3 for IDTECH 3
         * @param {function} successFunction - Callback function on success
         * @param {function} errorFunction - Error function
         * @example
         * QBrowser.MagStripe.setEMSREncryption(2, EMSRSuccess, EMSRFailed);
         */
        this.setEMSREncryption = function(encryptionIndex, successFunction, errorFunction)
        {
            NativeCall("msreader.setEMSREncryption", [encryptionIndex], [successFunction, errorFunction]);
        }
    };

    this.BarcodePrintType = {
        /*
         * Prints UPC-A barcode
         */
        UPCA: 0,
        /**
         * Prints UPC-E barcode
         */
        UPCE: 1,
        /**
         * Prints EAN-13 barcode
         */
        EAN13: 2,
        /**
         * Prints EAN-8 barcode
         */
        EAN8: 3,
        /**
         * Prints CODE39 barcode
         */
        CODE39: 4,
        /**
         * Prints ITF barcode
         */
        ITF: 5,
        /**
         * Prints CODABAR barcode
         */
        CODABAR: 6,
        /**
         * Prints CODE93 barcode
         */
        CODE93: 7,
        /**
         * Prints CODE128 barcode
         */
        CODE128: 8,
        /**
         * Prints 2D PDF-417 barcode
         */
        PDF417: 9,
        /**
         * Prints CODE128 optimized barcode. Supported only on DPP-250, DPP-350 and PP-60 printers,
         * it makes the barcode lot smaller especially when numbers only are used
         */
        CODE128AUTO: 10,
        /**
         * Prints EAN128 optimized barcode. Supported only on DPP-250, DPP-350 and PP-60 printers,
         * it makes the barcode lot smaller especially when numbers only are used
         */
        EAN128AUTO: 11
    };

    this.BarcodeHRIPosition = {
        /**
         * Disables HRI text
         */
        NONE: 0,
        /**
         * Prints HRI above the barcode
         */
        ABOVE: 1,
        /**
         * Prints HRI below the barcode
         */
        BELOW: 2,
        /**
         * Prints HRI both above and below the barcode
         */
        BOTH: 3
    };

    this.Align = {
        /**
         * Left aligning
         */
        LEFT: 0,
        /**
         * Center aligning
         */
        CENTER: 1,
        /**
         * Right aligning
         */
        RIGHT: 2,
    };

    this.PrinterInfo = {
        /**
         * Battery Voltage
         */
        INFO_BATVOLT: 0,
        /**
         * Battery Percent
         */
        INFO_BATPERCENT: 1,
        /**
         * Printer Head Temperature Celsius
         */
        INFO_TEMPC: 2,
        /**
         * Printer Head Temperature Fahrenheit
         */
        INFO_TEMPFR: 3,
        /**
         * Printer Version
         */
        INFO_PRINTERVERSION: 4,
        /**
         * Printer Model
         */
        INFO_PRINTERMODEL: 5,
        /**
         * Printer Paper Width
         */
        INFO_PAPERWIDTH: 6,
        /**
         * Printer Page Height
         */
        INFO_PAGEHEIGHT: 7
    }

    /**
     * @class Printer
     * @classdesc Functions to print text, graphics and barcodes to the supported printers.
     */
    this.Printer = new function()
    {
        /**
         * Prints text on the printer with various styles and font sizes.
         * @memberof Printer
         * @param {string} text - Text to print. The text string can contain control symbols that define styles, font sizes, alignment. Available styles:
         * - {==} - reverts all settings to their defaults. That includes font size, style, intensity, aligning
         * - {=Fx} - selects font size. x ranges from 0 to 7 as follows:
         * - * 0 - FONT_9X16
         * - * 1 - FONT_9X32
         * - * 2 - FONT_18X32
         * - * 3 - FONT_12X24
         * - * 4 - FONT_24X24
         * - * 5 - FONT_12X48
         * - * 6 - FONT_24X48
         * - {=L} - left text aligning
         * - {=C} - center text aligning
         * - {=R} - right text aligning
         * - {=Rx} - text rotation as follows:
         * - * 0 - not rotated
         * - * 1 - rotated 90 degrees
         * - * 2 - rotated 180 degrees
         * - {=Ix} - sets intensity level as follows:
         * - * 0 - intensity 70%
         * - * 1 - intensity 80%
         * - * 2 - intensity 90%
         * - * 3 - intensity 100%
         * - * 4 - intensity 120%
         * - * 5 - intensity 150%
         * - {+/-B} - sets or unsets bold font style
         * - {+/-I} - sets or unsets italic font style
         * - {+/-U} - sets or unsets underline font style
         * - {+/-V} - sets or unsets inverse font style
         * - {+/-W} - sets or unsets text word-wrapping
         * @param {function} onFailure - Error function. Format: onFailure(errorCode, errorDescription)
         * @example
         * QBrowser.Printer.printText("{=C}FONT SIZES\n{=L}{=F0}Font 9x16\n{=F1}Font 18x16\n{=F2}Font 9x32\n{=F3}Font 18x32\n",PrintFailed);
         * QBrowser.Printer.printText("{=F4}Font 12x24\n{=F5}Font 24x24\n{=F6}Font 12x48\n{=F7}Font 24x48\n\n",PrintFailed);
         * 
         * QBrowser.Printer.printText("{=C}FONT STYLES\n{=L}Normal\n{+B}Bold\n{+I}Bold Italic{-I}{-B}\n{+U}Underlined{-U}\n{+V}Inversed{-V}\n\n",PrintFailed);
         * QBrowser.Printer.printText("{=C}FONT ROTATION\n{=L}{=R1}Rotated 90 degrees\n{=R2}Rotated 180 degrees\n\n",PrintFailed);
         * 
         * QBrowser.Printer.printText("{+W}{=F0}This function demonstrates the use of the built-in word-wrapping capability\n",PrintFailed);
         */
        this.printText = function(text, onFailure)
        {
            NativeCall("printer.printText", [text], [onFailure]);
        };

        /**
         * Forces data still in the sdk buffer to be sent directly to the printer
         * @memberof Printer
         * @param {function} onFailure - Error function. Format: onFailure(errorCode, errorDescription)
         */
        this.flushCache = function(onFailure)
        {
            NativeCall("printer.flushCache", null, [onFailure]);
        }

        /**
         * Prints a barcode on the printer with various styles and sizes.
         * @memberof Printer
         * @param {number} type - Barcode type to print, please do not confuse this with the barcode type from scanning functions. Available print barcode types:
         * - QBrowser.BarcodePrintType.UPCA - prints UPC-A barcode
         * - QBrowser.BarcodePrintType.UPCE - prints UPC-E barcode
         * - QBrowser.BarcodePrintType.EAN13 - prints EAN-13 barcode
         * - QBrowser.BarcodePrintType.EAN8 - prints EAN-8 barcode
         * - QBrowser.BarcodePrintType.CODE39 - Prints Code 39 barcode
         * - QBrowser.BarcodePrintType.ITF - prints ITF barcode
         * - QBrowser.BarcodePrintType.CODABAR - prints CODABAR barcode
         * - QBrowser.BarcodePrintType.CODE93 - prints Code 93 barcode
         * - QBrowser.BarcodePrintType.CODE128 - prints CODE128 barcode
         * - QBrowser.BarcodePrintType.PDF417 - Prints 2D PDF-417 barcode
         * - QBrowser.BarcodePrintType.CODE128AUTO - prints CODE128 optimized barcode, supported only on DPP-250, DPP-350 and PP-60 printers, it makes the barcode lot smaller especially when numbers only are used
         * - QBrowser.BarcodePrintType.EAN128AUTO - prints EAN128 optimized barcode, supported only on DPP-250, DPP-350 and PP-60 printers, it makes the barcode lot smaller especially when numbers only are used
         * @param {string} barcode - Barcode data to print. Please note, that every barcode have specific requirements about the data - be that length, symbols that can be printed, tables to pick from, etc, consult barcode type documentation if some barcode refuses to print
         * @param {function} onFailure - Error function. Format: onFailure(errorCode, errorDescription)
         * @param {object} settings - Additional optional barcode settings. Supported settings are:
         * - align(number) - barcode horizontal alignment, one of:
         * - > QBrowser.Align.LEFT - left alignment
         * - > QBrowser.Align.CENTER - centered
         * - > QBrowser.Align.RIGHT - right alignment
         * - height(number) - barcode height in millimeters, default is 9
         * - hri(number) - HRI position
         */
        this.printBarcode = function(type, barcode, onFailure, settings)
        {
            NativeCall("printer.printBarcode", [type, barcode], [onFailure], settings);
        };

        /**
         * Feeds the paper to leave blank space between prints or to allow the paper to be teared.
         * @memberof Printer
         * @param {number} amountmm - Amount of millimeters to feed the paper. Passing 0 will feed the paper the nessesary amount so it can be teared by the user.
         * @param {function} onFailure - Error function. Format: onFailure(errorCode, errorDescription)
         * @example
         * // Feeds the paper 1cm
         * QBrowser.Printer.feedPaper(10, PrintFailed);
         * 
         * // Feeds the paper so it can be teared
         * QBrowser.Printer.feedPaper(0, PrintFailed);
         */
        this.feedPaper = function(amountmm, onFailure)
        {
            NativeCall("printer.feedPaper", [amountmm], [onFailure]);
        };

        /**
         * Prints image. The image is converted to black & white using dithering to preserve image quality.
         * @memberof Printer
         * @param {object} image - Image to print
         * @param {function} onFailure - Error function. Format: onFailure(errorCode, errorDescription)
         * @example
         * QBrowser.Printer.printImage(document.getElementsByName("Image")[0], PrintFailed);
         */
        this.printImage = function(image, onFailure)
        {
            _printImageData = getBase64Image(image);
            NativeCall("printer.printImage", null, [onFailure]);
        };

        /**
         * Prints Base64 encoded image
         * @memberof Printer
         * @param {object} image - Image to print
         * @param {function} onFailure - Error function. Format: onFailure(errorCode, errorDescription)
         */
        this.printBase64Image = function(image, onFailure)
        {
            _printImageData = image.replace(/^data:image\/(png|jpg);base64,/, "");
            NativeCall("printer.printImage", null, [onFailure]);
        }

        /**
         * Prints tiff image
         * @memberof Printer
         * @param {object} image - Image to print 
         * @param {function} onFailure - Error function. Format: onFailure(errorCode, errorDescription)
         */
        this.tiffImage = function(image, onFailure)
        {
            _printImageData = getBase64Image(image);
            NativeCall("printer.tiffTest", null, [onFailure]);
        }
        
        /**
         * Prints the logo, previously stored in the printer. If the printer does not support, of have no logo set, nothing is printed.
         * @memberof Printer
         * @param {function} onFailure - Error function. Format: onFailure(errorCode, errorDescription)
         */
        this.printLogo = function(onFailure)
        {
            NativeCall("printer.printLogo", null, [onFailure]);
        };

        /**
         * Helper function to monitor the status of the supported printers. This function is used to receive realtime notifications when supported printer becomes available.
         * @memberof Printer
         * @param {function} printerStatus - Callback function that receives the printers status updates, that includes if printers paper is out, or battery is low. Parameters: info(object)
         *  - info.connected(boolean) - indicates if supported printer is connected
         *  - info.name(string) - printer name
         *  - info.version(string) - printer firmware version
         *  - info.outOfPaper(boolean) - true if printer is out of paper, false otherwise
         *  - info.lowBattery(boolean) - true if printers battery level is dangerously low
         * @example
         * function PrinterStatus(info)
         * {
         *     if(info.connected==true)
         *         document.body.innerHTML+="Connected printer <b>"+info.name+" "+info.version+"</b><br/>";
         *     if(info.connected==false)
         *         document.body.innerHTML+="Printer disconnected<br/>";
         *     if(info.outOfPaper==true)
         *         document.body.innerHTML+="Out of paper<br/>";
         *     if(info.outOfPaper==false)
         *         document.body.innerHTML+="Printer paper loaded<br/>";
         *     if(info.lowBattery==true)
         *         document.body.innerHTML+="Low battery<br/>";
         *     if(info.lowBattery==false)
         *         document.body.innerHTML+="Battery levels good<br/>";
         * }
         * 
         * QBrowser.Printer.monitorStatus(PrinterStatus);
         */
        this.monitorStatus = function(printerStatus)
        {
            NativeCall("printer.monitorStatus", null, [printerStatus]);
        };

        /**
         * @todo Not yet implemented
         */
        this.getInfo = function(infoCmd, infoStatus)
        {
            NativeCall("printer.getInfo", [infoCmd], [infoStatus]);
        };

        /**
         * Provides blackmark sensor calibration by scaning 200mm of paper for possible black marks and adjust the sensor treshold. Make sure you have put the right paper before calling this function.
         * @memberof Printer
         * @param {function} successFunction - Success function
         * @param {function} errorFunction - Error function
         */
        this.advanceBlackMark = function(successFunction, errorFunction)
        {
            NativeCall("printer.calibrateBlackMark", null, [successFunction, errorFunction]);
        };
    };

    /**
     * @class AddressBook
     * @classdesc Functions to operate with device Address Book.
     */
    this.AddressBook = new function()
    {
        /**
         * Presents an interface on the device to select a contact from the Address Book and returns its details
         * @memberof AddressBook
         * @param {function} onContact - Callback function called when the user selects contact. The format of the function is: onContact(contact) Available fields:
         * - contact.firstName
         * - contact.lastName
         * - contact.middleName
         * - contact.prefix
         * - contact.suffix
         * - contact.organization
         * - contact.jobTitle
         * - contact.department
         * - contact.note
         * 
         * - contact.phone.mobile
         * - contact.phone.iPhone
         * - contact.phone.main
         * - contact.phone.homeFax
         * - contact.phone.workFax
         * - contact.phone.pager
         * - contact.phone.work
         * - contact.phone.home
         * 
         * - contact.email.work
         * - contact.email.home
         * 
         * - contact.address.work.street
         * - contact.address.work.city
         * - contact.address.work.state
         * - contact.address.work.zip
         * - contact.address.work.country
         * - contact.address.work.countryCode
         * 
         * - contact.address.home.street
         * - contact.address.home.city
         * - contact.address.home.state
         * - contact.address.home.zip
         * - contact.address.home.country
         * - contact.address.home.countryCode
         * @param {function} onFailure - Failure function. Format: onFailure(errorCode, errorDescription)
         */
        this.pickContact = function(onContact, onFailure)
        {
            NativeCall("addressbook.pickContact", null, [onContact, onFailure]);
        };
    };

    /**
     * @class Phone
     * @classdesc Functions to access phone functionality - dial a number and send an SMS.
     */
    this.Phone = new function()
    {
        /**
         * Dials a phone number on the device. On iPhone dialing a number makes the program exit and the phone program is launched with the number. The user have to confirm the call, then return back to the program. There are restrictions about special symbols like # when dialing programatically.
         * @memberof Phone
         * @param {string} number - Phone number to dial
         * @param {function} onSuccess - Success function
         * @param {function} onFailure - Failure function. Format: onFailure(errorCode, errorDescription)
         */
        this.dial = function(number, onSuccess, onFailure)
        {
            NativeCall("phone.dial", [number], [onSuccess, onFailure]);
        };

        /**
         * Presents a dialog, filled with the SMS information - numbers to send the message to and message itself. The user have to confirm the sending.
         * @memberof Phone
         * @param {array} numbers - Array of numbers for message to be sent to
         * @param {string} message - Message body
         * @param {function} onSuccess - Success function
         * @param {function} onFailure - Failure function. Format: onFailure(errorCode, errorDescription)
         * @example
         * QBrowser.Phone.sendSMS(["123456","654321"], "Message body", PhoneSuccess, PhoneError);
         */
        this.sendSMS = function(numbers, message, onSuccess, onFailure)
        {
            NativeCall("phone.sendSMS", [numbers, message], [onSuccess, onFailure]);
        };
    };

    /**
     * @class Device
     * @classdesc Functions to get device specific information
     */
    this.Device = new function()
    {
        /**
         * Returns information about the current device such as its name, model, system version
         * @memberof Device
         * @param {function} deviceInfo - Javascript function that will be called with the detailed device information. The format of the function is: deviceInfo(info). Available fields are:
         * - info.name(string) - devices user name
         * - info.serial(string) - unique device serial number
         * - info.systemName(string) - devices system name
         * - info.systemVersion(string) - firmware version
         * - info.model(string) - model string
         * @example
         * function DeviceInfo(info)
         * {
         *     // Loop through the information and display it
         *     var infoStr="";
         *     for(var i in info)
         *     {
         *         infoStr+=i+": "+info[i]+"\n";
         *     }
         * 
         *     alert(infoStr)
         * }
         */
        this.getInformation = function(deviceInfo)
        {
            NativeCall("device.getInformation", null, [deviceInfo]);
        };
    };

    /**
     * @class Bluetooth
     * @classdesc Functions that allow the us of the Linea bluetooth stack
     */
    this.Bluetooth = new function()
    {
        /**
         * Check if bluetooth is enabled
         * @memberof Bluetooth
         * @param {function} statusFunction - The callback that will get bluetooth status passing back
         * @param {function} errorFunction - The callback that will receive error
         */
        this.getEnabled = function(statusFunction, errorFunction)
        {
            NativeCall("bluetooth.getEnabled", null, [statusFunction, errorFunction]);
        };

        /**
         * Enables or disables scanner's bluetooth
         * @memberof Bluetooth
         * @param {boolean} enabled - Enable or disable bluetooth
         * @param {function} statusFunction - The callback that will get bluetooth status passing back
         * @param {function} errorFunction - The callback that will receive error
         */
        this.setEnabled = function(enabled, statusFunction, errorFunction)
        {
            NativeCall("bluetooth.setEnabled", [enabled], [statusFunction, errorFunction]);
        };

        /**
         * Monitor the status of bluetooth. The callback function will get called anytime there is a change to bluetooth status.
         * @memberof Bluetooth
         * @param {function} bluetoothStatus - The callback that will receive bluetooth status updates. Format: bluetoothStatus(function)
         * - 1 = Connected
         * - 2 = Data Ready to Read
         * - 8 = Error
         * - 16 = Disconnected
         */
        this.monitorStatus = function(bluetoothStatus)
        {
            NativeCall("bluetooth.monitorStatus", null, [bluetoothStatus]);
        };

        /**
         * Sets the callback function for device discovery
         * @memberof Bluetooth
         * @param {function} deviceDiscovered - Callback function called when device is discovered
         */
        this.monitorDeviceDiscovered = function(deviceDiscovered)
        {
            NativeCall("bluetooth.monitorDeviceDiscovered", null, [deviceDiscovered]);
        };

        /**
         * Sets the callback function for monitor discovery
         * @memberof Bluetooth
         * @param {function} discoveryComplete - Callback function called when bluetooth discovery is complete
         */
        this.monitorDiscoveryComplete = function(discoveryComplete)
        {
            NativeCall("bluetooth.monitorDiscoveryComplete", null, [discoveryComplete]);
        };

        /**
         * Performs background discovery of supported printers. The discovery status and devices found will be sent via delegate notifications.
         * @memberof Bluetooth
         * @param {number} maxDevices - Maximum results to return
         * @param {number} maxTimeout - Max time to discover, in seconds. Actual time may vary.
         * @param {function} errorFunction - Error function
         */
        this.discoverPrinters = function(maxDevices, maxTimeout, errorFunction)
        {
            NativeCall("bluetooth.discoverPrinters", [maxDevices, maxTimeout], [errorFunction]);
        };

        /**
         * Performs background discovery of the nearby bluetooth devices. The discovery status and devices found will be sent via delegate notifications.
         * @memberof Bluetooth
         * @param {number} maxDevices - Maximum results to return
         * @param {number} maxTimeout - Max time to discover, in seconds. Actual time may vary.
         * @param {number} codTypes - Bluetooth Class Of Device to look for or 0 to search for all bluetooth devices
         * @param {function} errorFunction - Error function
         */
        this.discoverDevices = function(maxDevices, maxTimeout, codTypes, errorFunction)
        {
            NativeCall("bluetooth.discoverDevices", [maxDevices, maxTimeout, codTypes], [errorFunction]);
        };

        /**
         * Attempts to connect to remote printer
         * @memberof Bluetooth
         * @param {string} address - Bluetooth address
         * @param {string} pin - PIN code if needed, or null to try unencrypted connection
         * @param {function} successFunction - Success function
         * @param {function} errorFunction - Error function
         */
        this.printerConnect = function(address, pin, successFunction, errorFunction)
        {
            NativeCall("bluetooth.printerConnect", [address, pin], [successFunction, errorFunction]);
        };

        /**
         * Attempts to connect to remote device
         * @memberof Bluetooth
         * @param {string} address - Bluetooth address
         * @param {string} pin - PIN code if needed, or null to try unencrypted connection
         * @param {function} successFunction - Success function
         * @param {function} errorFunction - Error function
         */
        this.connect = function(address, pin, successFunction, errorFunction)
        {
            NativeCall("bluetooth.connect", [address, pin], [successFunction, errorFunction]);
        };

        /**
         * Disconnects from remote device
         * @memberof Bluetooth
         * @param {string} address - Bluetooth address returned from discoverDevices/discoverPrinters
         * @param {function} successFunction - Success function
         * @param {function} errorFunction - Error function
         */
        this.disconnect = function(address, successFunction, errorFunction)
        {
            NativeCall("bluetooth.disconnect", [address], [successFunction, errorFunction]);
        };

        /**
         * Sends data to the connected remote device
         * @memberof Bluetooth
         * @param {string} data - Data to write
         * @param {function} errorFunction - Error function
         */
        this.write = function(data, errorFunction)
        {
            NativeCall("bluetooth.write", [data], [errorFunction]);
        };

        /**
         * Writes the contents of a provided data buffer to the receiver
         * @memberof Bluetooth
         * @param {string} data - Data to write
         * @param {function} errorFunction - Error function
         */
        this.writeStream = function(data, errorFunction)
        {
            NativeCall("bluetooth.writeStream", [data], [errorFunction]);
        };

        /**
         * Writes the contents of a provided data buffer to the receiver
         * @memberof Bluetooth
         * @param {string} data - Data to write
         * @param {function} errorFunction - Error function
         */
        this.writeStreamData = function(data, errorFunction)
        {
            NativeCall("bluetooth.writeStreamData", [data], [errorFunction]);
        }

        /**
         * Tries to read data from the connected remote device for specified timeout
         * @memberof Bluetooth
         * @param {number} maxLength - Maximum amount of bytes to wait for
         * @param {number} maxTimeout - Maximum timeout in seconds to wait for data
         * @param {function} receiveFunction - Function that receives read data
         * @param {function} errorFunction - Error function
         */
        this.read = function(maxLength, maxTimeout, receiveFunction, errorFunction)
        {
            NativeCall("bluetooth.read", [maxLength, maxTimeout], [receiveFunction, errorFunction]);
        };
    };
    
    /**
     * @class URL
     * @classdesc Functions to handle sending HTTP requests
     */
    this.URL = new function()
    {
        /**
         * Sends a synchronous HTTP request
         * @memberof URL
         * @param {string} url - URL to send to
         * @param {string} postData - Post data. If this is null the request becomes a GET.
         * @param {string} uid - UID
         * @param {string} pwd - PWD
         * @param {function} cbSuccess - Callback function if successful
         * @param {function} cbFailure - Callback function if failed
         */
        this.requestSync = function(url, postData, uid, pwd, cbSuccess, cbFailure)
        {
            NativeCall("url.requestSync", [url, postData, uid, pwd], [cbSuccess, cbFailure]);
        }

        /**
         * Sends an asynchronous HTTP request
         * @memberof URL
         * @param {string} url - URL to send to
         * @param {string} postData - Post data. If this is null the request becomes a GET.
         * @param {string} uid - UID
         * @param {string} pwd - PWD
         * @param {function} cbSuccess - Callback function if successful
         * @param {function} cbFailure - Callback function if failed
         */
        this.requestAsync = function(url, postData, uid, pwd, cbSuccess, cbFailure)
        {
            NativeCall("url.requestAsync", [url, postData, uid, pwd], [cbSuccess, cbFailure]);
        }
    }

    /**
     * @class Licensing
     * @classdesc Functions to deal with licensing QBrowser
     */
    this.Licensing = new function()
    {
        /**
         * Pops up a dialog with current license information, registration status, expiration date.
         * @memberof Licensing
         */
        this.display = function()
        {
            NativeCall("license.display", null, null);
        };

        /**
         * Returns information about QBrowser's license such as key, expiration date, is registered, etc.
         * @memberof Licensing
         * @param {function} licenseInfo - JavaScript function that will be called with the detailed license information. The format of the function is: function licenseInfo(info). Available fields are:
         * - info.registered(boolean) - true if QBrowser is registered, false otherwise
         * - info.key(string) - QBrowser key, if any
         * - info.enterpriseID(number) - enterprise ID, if any
         * - info.expirationDate(Date) - expiration date
         * @example
         * // Example callback function
         * function LicenseInfo(info)
         * {
         *     // Loop through the information and display it
         *     var infoStr = "";
         *     for(var i in info)
         *     {
         *         infoStr += i + ": " + info[i] + "\n";
         *     }
         *     alert(infoStr)
         * }
         * 
         * function GetLicenseInfo()
         * {
         *     QBrowser.Licensing.getInformation(LicenseInfo);
         * }
         */
        this.getInformation = function(licenseInfo)
        {
            NativeCall("license.getInformation", null, [licenseInfo]);
        };

        /**
         * Sets/updates QBrowser's activation key
         * @memberof Licensing
         * @param {string} key - Activation key
         */
        this.setKey = function(key)
        {
            NativeCall("license.setKey", [key], null);
        };

        /**
         * Navigates to the MobileVision web page, where you can easily register your device.
         * @memberof Licensing
         */
        this.registerOnline = function()
        {
            NativeCall("license.registerOnline", null, null);
        };

        /**
         * Navigates to the MobileVision web page and unregisters your device
         * @memberof Licensing
         */
        this.releaseOnline = function()
        {
            NativeCall("license.releaseOnline", null, null);
        };

        /**
         * Pops up a dialog box, where you can enter your key data. The key is generated by logging in with your enterprise account on the MobileVision web page and entering the device ID there.
         * @memberof Licensing
         */
        this.registerOffline = function()
        {
            NativeCall("license.registerOffline", null, null);
        };

        /**
         * Pops a dialog box, where you can enter your key data. To get the release key you have to log with your enterprise account on the MobileVision web page and enter the device ID there.
         * @memberof Licensing
         */
        this.releaseOffline = function()
        {
            NativeCall("license.releaseOffline", null, null);
        };
    };
};

/*
 * Helper function that gets the function's name
 */
function GetFunctionName(name)
{
    if (name && typeof name == "function")
    {
        name = name.toString()
        name = name.substr("function ".length);
        name = name.substr(0, name.indexOf("("));
    }
    else
    {
        if (!name)
            name = "";
    }

    return name;
}

/*
 * Main function that sends function calls from QBrowser.js to the native browser
 */
function NativeCall(functionName, args, callbacks, settings)
{
    for (var i = 0; callbacks && i < callbacks.length; i++)
    {
        if (callbacks[i] == null) callbacks[i] = "function(){}"; // Empty Function

        if (callbacks[i].toString().indexOf("function (") == 0 || callbacks[i].toString().indexOf("function(") == 0)
        {
            // Anonymous Function Blocks
            callbacks[i] = "(" + callbacks[i].toString() + ")";
        }
        else callbacks[i] = GetFunctionName(callbacks[i]); // Named function
    }

    var setArray = [];
    if (settings)
    {
        var index = 0;
        for (var i in settings)
        {
            setArray[index++] = i;
            setArray[index++] = GetFunctionName(settings[i]);
        }
    }

    window.webkit.messageHandlers.scriptMessageHandler.postMessage(
    {
        "message": "js-frame:" + functionName + ":" + encodeURIComponent(JSON.stringify(callbacks)) + ":" + encodeURIComponent(JSON.stringify(args)) + ":" + encodeURIComponent(JSON.stringify(setArray))
    });
};

var _printImageData;

/*
 * Helper function that converts image data to Base64
 */
function getBase64Image(img)
{
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    var dataURL = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}
