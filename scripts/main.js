// DEFINIËRING VAN ELEMENTEN ----------------------------------------------------------------------------------------

// VISUELE ELEMENTEN IN GRID
var gridStedin = document.querySelector('main .grid-stedin');
var gridSchouten = document.querySelector('main .grid-schouten');
var gridTransformer = document.querySelector('main .grid-transformer');
var gridCharger = document.querySelector('main .grid-charger');
var gridSolar = document.querySelector('main .grid-solar');
var gridWind = document.querySelector('main .grid-wind');
var gridBattery = document.querySelector('main .grid-battery');

var batteryPercentageBar = document.querySelector('main .grid-battery ul li > span > span');
var batteryPercentageIndicator = document.querySelector('main .grid-battery ul li > strong');

// ZWEVENDE INTERACTIEVE BALK
var timeSelector = document.querySelector('aside #time');
var energyPriceLow = document.querySelector('aside #energy-price-low');
var energyPriceMid = document.querySelector('aside #energy-price-mid');
var energyPriceHigh = document.querySelector('aside #energy-price-high');
var chargerAmount = document.querySelector('aside #charger');
var windCheckbox = document.querySelector('aside #wind');
var solarCheckbox = document.querySelector('aside #solar');

var visualizeButton = document.querySelector('aside button');
visualizeButton.addEventListener("click", scenario);



// DEFINIËRING VAN VARIABELEN ----------------------------------------------------------------------------------------
var time;
var stedin;
var transformer;
var schouten;
var solar;
var wind;
var charger;
var energyPrice;
var batteryPercentage;




// TIJDELIJK
// energyPrice = 0.20;


// UITWERKEN VAN VERSCHILLENDE SCENARIO'S ----------------------------------------------------------------------------------------
function scenario() {

    // DYNAMISCHE ELEMENTEN / WAARDES AANROEPEN
    var timeSelectorValue = timeSelector.value;
    console.log('Gekozen tijd: ' + timeSelectorValue);

    var energyPriceLowValue = energyPriceLow.value;
    var energyPriceMidValue = energyPriceMid.value;
    var energyPriceHighValue = energyPriceHigh.value;

    charger = chargerAmount.value;
    console.log('Laadpalen: ' + charger);

    wind = false;
    if (windCheckbox.checked) {
        wind = true;
    }
    console.log('Windmolen: ' + wind);

    solar = false;
    if (solarCheckbox.checked) {
        solar = true;
    }
    console.log('Zonnepanelen: ' + solar);


    // IF STATEMENT - VASTGESTELDE WAARDES BIJ DE SCENARIO'S OP BASIS VAN TIJD
    if (timeSelectorValue == '02:00') {
        stedin = false;
        schouten = false;
        batteryPercentage = 100;
        energyPrice = energyPriceHighValue;
    }
    if (timeSelectorValue == '14:00') {
        stedin = true;
        schouten = false;
        batteryPercentage = 47;
        energyPrice = energyPriceLowValue;
    }
    if (timeSelectorValue == '16:00') {
        stedin = true;
        schouten = true;
        batteryPercentage = 68;
        energyPrice = energyPriceLowValue;
    }
    if (timeSelectorValue == '17:00') {
        stedin = false;
        schouten = true;
        batteryPercentage = 100;
        energyPrice = energyPriceHighValue;
        // solar = false;
        // wind = true;
        // charger = 1;
    }
    

    // UITVOEREN VAN VISUALISERING
    visualizeScenario();
}



// VISUALISEREN VAN ACTIEVE SCENARIO ----------------------------------------------------------------------------------------
function visualizeScenario() {

    // VERSCHILLENDE SCNENARIO'S UITBEELDEN A.D.H.V. DE GESELECTEERDE / INGEVOERDE WAARDES --------------------
    // ALS ZONNEPANELEN OF WIND ENERGIE BESCHIKBAAR IS -->
    if ((solar == true) || (wind == true)) { 
        // PRIORITEIT IN DIT SCENARIO:
        // 1. LAADPALEN
        // 2. SCHOUTEN
        // 3. ACCU OPLADEN
        // 4. TERUGLEVEREN

        gridCharger.classList.remove('guide-line-active');
        gridCharger.classList.remove('active');
        gridSchouten.classList.remove('active');
        gridBattery.classList.remove('active');
        gridBattery.classList.remove('grid-line-flipped');
        gridStedin.classList.remove('active');
        gridTransformer.classList.remove('active');
        gridStedin.classList.remove('grid-line-flipped');
        gridSchouten.classList.remove('guide-line-active');
        
        if (charger >= 1) {
            // ALS LAADPALEN ACTIEF ZIJN, GEEF ALTIJD PRIORITEIT
            schouten = false;
            gridCharger.classList.add('active');
            document.querySelector('main > .grid-schouten .grid-line:first-of-type').classList.remove('grid-line-flipped');
            gridStedin.classList.remove('grid-line-flipped');
            gridSchouten.classList.remove('guide-line-active');

        } else if (schouten == true) {
            // ALS LAADPALEN NIET ACTIEF ZIJN, GEEF SCHOUTEN DAN PRIORITEIT
            stedin = false;
            gridSchouten.classList.add('active');
            gridCharger.classList.add('guide-line-active');
            document.querySelector('main > .grid-charger .grid-line:first-of-type').classList.add('grid-line-flipped');
            document.querySelector('main > .grid-schouten .grid-line:first-of-type').classList.add('grid-line-flipped');
            gridStedin.classList.remove('grid-line-flipped');
            gridSchouten.classList.remove('guide-line-active');
            
        } else if (batteryPercentage != 100) {
            // ALS ACCU NIET OPGELADEN IS EN LAADPALEN ZIJN NIET ACTIEF, GEEF ACCU DAN PRIORITEIT
            document.querySelector('main > .grid-charger .grid-line:first-of-type').classList.add('grid-line-flipped');
            gridBattery.classList.add('active');
            gridCharger.classList.add('guide-line-active');
            document.querySelector('main > .grid-schouten .grid-line:first-of-type').classList.remove('grid-line-flipped');
            gridStedin.classList.remove('grid-line-flipped');
            gridSchouten.classList.remove('guide-line-active');

        } else {
            // ALS LAADPALEN NIET ACTIEF ZIJN, SCHOUTEN GEEN STROOM VERBRUIKT EN ACCU IS VOLGELADEN, LEVER DAN TERUG AAN STEDIN
            gridStedin.classList.add('active');
            gridTransformer.classList.add('active');
            gridCharger.classList.add('guide-line-active');
            gridSchouten.classList.add('guide-line-active');
            document.querySelector('main > .grid-charger .grid-line:first-of-type').classList.add('grid-line-flipped');
            document.querySelector('main > .grid-schouten .grid-line:first-of-type').classList.add('grid-line-flipped');
            gridStedin.classList.add('grid-line-flipped');
            
        }

    
    // ALS ZONNEPANELEN OF WIND ENERGIE NIET BESCHIKBAAR IS -->
    } else if ((solar == false) || (wind == false)) { 
        // PRIORITEIT IN DIT SCENARIO:
        // 1. LAADPALEN
        // 2. SCHOUTEN
        // 3. ACCU OPLADEN
        // 4. TERUGLEVEREN

        document.querySelector('main > .grid-charger .grid-line:first-of-type').classList.remove('grid-line-flipped');
        document.querySelector('main > .grid-schouten .grid-line:first-of-type').classList.remove('grid-line-flipped');
        gridCharger.classList.remove('active');
        gridCharger.classList.remove('guide-line-active');
        gridBattery.classList.remove('active');
        gridBattery.classList.remove('grid-line-flipped');
        gridStedin.classList.remove('active');
        gridTransformer.classList.remove('active');
        gridStedin.classList.remove('grid-line-flipped');
        gridSchouten.classList.remove('guide-line-active');        

        if (charger >= 1) {
            // ALS DE BATTERIJ NIET LEEG IS, GEBRUIK DEZE DAN ALS PRIMAIRE BRON
            schouten = false;
            if (batteryPercentage != 0) {
                // LAADPALEN STROOM GEVEN VANUIT ACCU
                gridCharger.classList.add('active');
                gridCharger.classList.add('guide-line-active');
                gridBattery.classList.add('active');
                gridBattery.classList.add('grid-line-flipped');
    
            } else {
                gridCharger.classList.remove('active');
                gridCharger.classList.remove('guide-line-active');
                gridBattery.classList.remove('active');
            }
        } else if (schouten == true) {
            // ALS LAADPALEN NIET ACTIEF ZIJN, GEEF SCHOUTEN DAN PRIORITEIT
            stedin = false;
            gridBattery.classList.add('active');
            gridBattery.classList.add('grid-line-flipped');
            gridSchouten.classList.add('guide-line-active');
            document.querySelector('main > .grid-schouten .grid-line:first-of-type').classList.add('grid-line-flipped');
        } else if ((stedin == true) && (schouten == false)) {
            // ALS LAADPALEN NIET ACTIEF ZIJN, SCHOUTEN GEEN STROOM VERBRUIKT EN ACCU NIET IS VOLGELADEN, LAAD DAN ACCU OP
            stedin = true;
            gridBattery.classList.add('active');
            gridStedin.classList.add('active');
            gridTransformer.classList.add('active');
            gridSchouten.classList.add('guide-line-active');

        } else {
            // ALS LAADPALEN NIET ACTIEF ZIJN, SCHOUTEN GEEN STROOM VERBRUIKT EN ACCU IS VOLGELADEN, LEVER DAN TERUG AAN STEDIN
            gridBattery.classList.add('active');
            gridBattery.classList.add('grid-line-flipped');
            gridStedin.classList.add('active');
            gridTransformer.classList.add('active');
            gridSchouten.classList.add('guide-line-active');
            document.querySelector('main > .grid-schouten .grid-line:first-of-type').classList.add('grid-line-flipped');
            gridStedin.classList.add('grid-line-flipped');


            // gridCharger.classList.remove('active');
            // gridCharger.classList.remove('guide-line-active');
        }
    
        
    }





    




    // if ((stedin == true) && (batteryPercentage >= 100)) {

    //     if (charger >= 1) {
    //         // PRIORITEIT

    //     } else {

    //     }

    // } else {

    // }












    // ALGEMENE CLASSES DIE GEZET WORDEN --------------------
    // CHECK OF STEDIN (GRID) + TRANSFORMER ACTIEF IS
    // if (stedin == true) {
    //     gridStedin.classList.add('active');
    //     gridTransformer.classList.add('active');
    // } else {
    //     gridStedin.classList.remove('active');
    //     gridTransformer.classList.remove('active');
    // }

    // CHECK OF SCHOUTEN IS ACTIEF
    if (schouten == true) {
        gridSchouten.classList.add('active');
    } else {
        gridSchouten.classList.remove('active');
    }

    // // CHECK OF LAADPAAL ACTIEF IS (AANTAL LAADPALEN)
    // if (charger >= 1) {
    //     gridCharger.classList.add('active');
    // }  else {
    //     gridCharger.classList.remove('active');
    // }

    // CHECK OF ZONNEPANELEN ACTIEF ZIJN
    if (solar == true) {
        gridSolar.classList.add('active');
        gridWind.classList.add('guide-line-active');
    } else {
        gridSolar.classList.remove('active');
        gridWind.classList.remove('guide-line-active');
    }

    // CHECK OF WINDMOLEN ACTIEF IS
    if (wind == true) {
        gridWind.classList.add('active');
    } else {
        gridWind.classList.remove('active');
    }


    // BATTERY INDICATOR VISUALIZER
    batteryPercentageBar.style.width = batteryPercentage + '%';
    batteryPercentageIndicator.textContent = batteryPercentage + '%';
}
