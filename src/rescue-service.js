function RescueService(weatherForecastService, municipalServices, pressService) {

    return {
        checkForecastAndRescue: checkForecastAndRescue
    };

    function extremeWinter() {
        return weatherForecastService.getTemperatureInCelsius() < 10
            && weatherForecastService.getSnowfallInMm() > 10;
    }

    function sendSnowplows(count) {
        for (var i = 0; i < count; i++) {
            try {
                municipalServices.sendSnowplow();
            } catch (error) {
                municipalServices.sendSnowplow();
            }
        }
    }

    function checkForecastAndRescue() {
        if (extremeWinter()) {
            sendSnowplows(3);
            municipalServices.sendSander();
            pressService.sendWeatherAlert("SEVERE");
        } else {
            if (weatherForecastService.getTemperatureInCelsius() < 0) {
                municipalServices.sendSander();
            }
            if (weatherForecastService.getSnowfallInMm() > 3) {
                sendSnowplows(1);
            }
            if (weatherForecastService.getSnowfallInMm() > 5) {
                sendSnowplows(1);
            }
        }
    }

}