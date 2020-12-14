
/*** Settings ***/

function SettingsReceived(settings) {
    // Show Navigation switch reflects app settings
    document.getElementById("navSwitch").checked = settings["showNavigation"];
}

function ToggleNav() {
    QBrowser.Settings.set({
        showNavigation: document.getElementById("navSwitch").checked
    });
}

/*** Connect Application ***/

function Connect() {
    var url = document.getElementById("url").value;
    
    if (document.getElementById("defaultURLSwitch").checked) {
        QBrowser.Settings.set({
            defaultURL: url
        });
    } else {
        QBrowser.Controller.loadPage(url);
    }
}

/*** Notification Functions ***/

function MessageDismissed(response) {
    PrintOutput("Option " + response + " selected<br/>");
}

function NotifyMessage() {
    QBrowser.Notify.message("Alert", "This is a demo message", ["Accept", "Decline"], MessageDismissed);
}

function NotifyVibrate() {
    QBrowser.Notify.vibrate();
}

function NotifyBeep() {
    QBrowser.Notify.beep();
}

/*** Image Functions ***/

function ImageSuccess(picture) {
    PrintOutput("<img name=\"importedImage\" src=\"data:image/jpeg;base64," + picture + "\" alt=\"1231232.jpg\" /><br/>");
}

function ImageError(errorCode, errorDescription) {
    alert("Operation failed (" + errorCode + "): " + errorDescription);
}

function ImageFromCamera() {
    QBrowser.Image.fromCamera(ImageSuccess, ImageError);
}

function ImageFromAlbum() {
    QBrowser.Image.fromAlbum(QBrowser.ImageSource.PHOTOLIBRARY, ImageSuccess, ImageError);
}

function ImageSimulate() {
    QBrowser.Image.simulate(ImageSuccess);
}

/*** Phone Functions ***/

function PhoneSuccess() {}

function PhoneError(errorCode, errorDescription) {
    alert("Operation failed (" + errorCode + "): " + errorDescription);
}

function PhoneDial() {
    QBrowser.Phone.dial("123456", PhoneSuccess, PhoneError);
}

function PhoneSMS() {
    QBrowser.Phone.sendSMS(["123456", "654321"], "Message body", PhoneSuccess, PhoneError);
}

/*** Barcode Functions ***/

// Default function that receives barcodes. You can change it via App Settings.
function BarcodeData(barcode, type, typeText) {
    PrintOutput("Type(" + type + "): " + typeText + " Barcode: " + barcode + "<br/>");
}

function BarcodeStatus(info) {
    if (info.connected) {
        PrintOutput("Barcode reader connected: <b>" + info.name + " " + info.version + "</b></br>");
    }
    else {
        PrintOutput("Barcode scanner disconnected<br/>");
    }
}

function BarcodeSimulate() {
    // You can use various ways
    //QBrowser.Barcode.simulate("123456789", 14);
    //QBrowser.Barcode.simulate("123456789");
    QBrowser.Barcode.simulate();
}

/*** MSR Functions ***/

function MagneticCardData(card) {
    for (var i = 0; i < 3; i++) {
        if (card.tracks[i]) {
            PrintOutput("Track" + (i + 1) + ": " + card.tracks[i] + "<br/>");
        }
    }

    if (card.cardholderName) {
        PrintOutput("Cardholder Name: " + card.cardholderName + "<br/>");
    }

    if (card.accountNumber) {
        PrintOutput("Account Number: " + card.accountNumber + "<br/>");
    }

    if (card.expirationMonth && card.expirationYear) {
        PrintOutput("Expires: " + card.expirationMonth + "/" + card.expirationYear + "<br/>");
    }
}

function EncryptedMagneticCardData(encryption, tracks, hexData, escapedString) {
    alert(tracks);
}

function MSStatus(info) {
    if (info.connected) {
        PrintOutput("Magnetic card reader connected: <b>" + info.name + " " + info.version + "</b></br>");
    }
    else {
        PrintOutput("Magnetic card reader disconnected<br/>");
    }
}

function MSSimulate() {
    QBrowser.MagStripe.simulate();
}

/*** Peripheral Functions ***/

function DeviceInfo(info) {
    var infoStr = "";
    for (var i in info) {
        infoStr += i + ": " + info[i] + "\n";
    }
    //alert(infoStr);
    QBrowser.Notify.message("Device Info", infoStr);
}

function GetDeviceInfo() {
    QBrowser.Device.getInformation(DeviceInfo);
}

function EnableCharging() {
    QBrowser.Settings.set({
        externalCharging: true,
        maxTTLMode: true
    });
}

function DisableCharging() {
    QBrowser.Settings.set({
        externalCharging: false
    });
}

function getBatteryInfo() {
    QBrowser.Settings.getBatteryLevel(
        function(capacity, voltage) {
            //alert("Capacity: " + capacity + "\nVoltage: " + voltage);
            QBrowser.Notify.message("Battery Info", "Capacity: " + capacity + "\nVoltage: " + voltage);
        },
        function(error) {
            alert(error);
        }
    );
}

/*** Printer Functions ***/

// When printing errors out, sets this variable so multiple errors don't pop up
var printError = false;

function PrinterStatus(info) {
    if (info.connected == true)
        PrintOutput("Printer connected: <b>" + info.name + " " + info.version + "</b><br/>");
    if (info.connected == false)
        PrintOutput("Printer disconnected<br/>");
    if (info.outOfPaper == true)
        PrintOutput("Printer status: Out of paper<br/>");
    if (info.lowBattery == true)
        PrintOutput("Printer status: Low battery<br/>");
}

function PrintFailed(errorCode, errorDescription) {
    if (!printError)
        alert("Printing failed (" + errorCode + "): " + errorDescription);

    printError = true;
}

function PrintText() {
    printError = false;

    QBrowser.Printer.printText("{=C}FONT SIZES\n{=L}{=F0}Font 9x16\n{=F1}Font 18x16\n{=F2}Font 9x32\n{=F3}Font 18x32\n", PrintFailed);
    QBrowser.Printer.printText("{=F4}Font 12x24\n{=F5}Font 24x24\n{=F6}Font 12x48\n{=F7}Font 24x48\n\n", PrintFailed);

    QBrowser.Printer.printText("{=C}FONT STYLES\n{=L}Normal\n{+B}Bold\n{+I}Bold Italic{-I}{-B}\n{+U}Underlined{-U}\n{+V}Inversed{-V}\n\n", PrintFailed);
    QBrowser.Printer.printText("{=C}FONT ROTATION\n{=L}{=R1}Rotated 90 degrees\n{=R2}Rotated 180 degrees\n\n", PrintFailed);

    QBrowser.Printer.printText("{+W}{=F0}This function demonstrates the use of the built-in word-wrapping capability\n", PrintFailed);
    QBrowser.Printer.printText("{+W}{=F1}This function demonstrates the use of the built-in word-wrapping capability\n", PrintFailed);
    QBrowser.Printer.printText("{+W}{=F4}This function demonstrates the use of the built-in word-wrapping capability\n", PrintFailed);
    QBrowser.Printer.printText("{+W}{=F5}This function demonstrates the use of the built-in word-wrapping capability\n", PrintFailed);

    QBrowser.Printer.feedPaper(0, PrintFailed);
}

function PrintBarcode() {
    printError = false;

    QBrowser.Printer.printText("{=C}POSITION\n", PrintFailed);

    // Left aligned
    QBrowser.Printer.printBarcode(QBrowser.BarcodePrintType.EAN13, "123456789012", PrintFailed);

    // Centered
    QBrowser.Printer.printBarcode(QBrowser.BarcodePrintType.EAN13, "123456789012", PrintFailed, {
        align: QBrowser.Align.CENTER
    });

    // Right aligned
    QBrowser.Printer.printBarcode(QBrowser.BarcodePrintType.EAN13, "123456789012", PrintFailed, {
        align: QBrowser.Align.RIGHT
    });

    QBrowser.Printer.feedPaper(10, PrintFailed);
    QBrowser.Printer.printText("{=C}SIZE & SCALE\n", PrintFailed);

    // Change vertical size
    QBrowser.Printer.printBarcode(QBrowser.BarcodePrintType.EAN13, "123456789012", PrintFailed, {
        height: 30
    });

    // Change horizontal and vertical
    QBrowser.Printer.printBarcode(QBrowser.BarcodePrintType.EAN13, "123456789012", PrintFailed, {
        height: 30,
        scale: 2
    });

    QBrowser.Printer.printBarcode(QBrowser.BarcodePrintType.EAN13, "123456789012", PrintFailed, {
        height: 30,
        scale: 3
    });

    QBrowser.Printer.printBarcode(QBrowser.BarcodePrintType.EAN13, "123456789012", PrintFailed, {
        height: 30,
        scale: 4
    });

    QBrowser.Printer.feedPaper(10, PrintFailed);
    QBrowser.Printer.printText("{=C}HRI POSITION\n", PrintFailed);

    // Change HRI position
    QBrowser.Printer.printBarcode(QBrowser.BarcodePrintType.EAN13, "123456789012", PrintFailed, {
        hri: QBrowser.BarcodeHRIPosition.BOTH
    });

    QBrowser.Printer.feedPaper(0, PrintFailed);
}

function PrinterConnect() {
    QBrowser.Bluetooth.printerConnect('68AAD2016C57', '0000', function() {
        alert('Printer Connected');
    }, function(e, e1) {
        alert('Printer Connection Failed:' + e1);
    });
}

function PrintImage() {
    alert("Printing Image...");

    pics = document.getElementsByName('importedImage');
    i = pics[pics.length - 1]; // last image
    printError = false;

    QBrowser.Printer.printImage(i, PrintFailed);
    QBrowser.Printer.feedPaper(0, PrintFailed);
}

/*** Demo App DOM Manipulation ***/

var OUTPUT_MODAL = false;

/**
 * Opens connect application modal
 */
function openConnect() {
    let connectModal = document.getElementById('connect');
    connectModal.classList.add('connect-open');
    
    let body = document.querySelector('body');
    body.style.overflow = 'hidden';
}

/**
 * Closes connect application modal
 */
function closeConnect() {
    let connectModal = document.getElementById('connect');
    connectModal.classList.remove('connect-open');
    
    let body = document.querySelector('body');
    body.style.overflow = 'auto';
}

/**
 * Toggles output modal
 */
function toggleOutput() {
    let outputModal = document.querySelector('#output');
    if (OUTPUT_MODAL) {
        outputModal.querySelector('button').innerText = 'Show Demo Output'
        outputModal.classList.remove('output-open');
    } else {
        outputModal.querySelector('button').innerText = 'Hide Demo Output'
        outputModal.classList.add('output-open');
    }
    
    OUTPUT_MODAL = !OUTPUT_MODAL;
}

/**
 * Prints message to output window
 */
function PrintOutput(message) {
    document.getElementById('output').innerHTML += message;
    document.getElementById('output').scrollTo(0, document.body.scrollHeight);
}

/**
 * Monitor device statuses
 */
window.onload = (e => {
    // Assign callback functions to handle device status changes
    QBrowser.Barcode.monitorStatus(BarcodeStatus);
    QBrowser.MagStripe.monitorStatus(MSStatus);
    QBrowser.Printer.monitorStatus(PrinterStatus);
    
    // Pull settings to update HTML
    QBrowser.Settings.get(SettingsReceived);
});
