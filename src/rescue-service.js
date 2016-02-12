function RescueService(weatherForecastService, municipalService, pressService) {

    return {
        checkForecastAndRescue: checkForecastAndRescue
    };

    function checkForecastAndRescue() {
        if (temperatureIsbelow(0)) {
            sendSander();
        }
        if (snowfallIsAbove(3)) {
            sendSnowplows(1);
        }
        if (snowfallIsAbove(5)) {
            sendSnowplows(1);
        }
        if (snowfallIsAbove(10) && temperatureIsbelow(-10)) {
            sendSnowplows(1);
            sendSevereWeatherAlert();
        }
    }

    function snowfallIsAbove(treshold) {
        return weatherForecastService.getSnowfallInMm() > treshold;
    }

    function temperatureIsbelow(treshold) {
        return weatherForecastService.getTemperatureInCelsius() < treshold;
    }

    function sendSnowplows(number) {
        for (var index = 0; index < number; index++) {
            try {
                municipalService.sendSnowplow();
            } catch (error) {
                municipalService.sendSnowplow();
            }
        }
    }

    function sendSander() {
        municipalService.sendSander();
    }

    function sendSevereWeatherAlert() {
        pressService.sendWeatherAlert('SEVERE');
    }

}