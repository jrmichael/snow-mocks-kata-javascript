describe('Snow Rescue Service', function () {

    var weatherForecastService, municipalService, rescueService, pressService;

    beforeEach(function () {
        weatherForecastService = new WeatherForecastService();
        municipalService = new MunicipalService();
        pressService = new PressService();
        rescueService = new RescueService(weatherForecastService, municipalService, pressService);
        spyOn(municipalService, 'sendSander');
    });

    it('does not expose internals', function () {
        expect(municipalService.weatherForecastService).not.toBeDefined();
        expect(municipalService.municipalServices).not.toBeDefined();
        expect(municipalService.pressService).not.toBeDefined();
    });

    it('sends a sander when temperature below 0', function () {
        spyOn(weatherForecastService, 'getTemperatureInCelsius').and.returnValue(-5);

        rescueService.checkForecastAndRescue();

        expect(municipalService.sendSander).toHaveBeenCalled();
    });

    it('does not send a sander when temperature 0 or above', function () {
        spyOn(weatherForecastService, 'getTemperatureInCelsius').and.returnValue(0);

        rescueService.checkForecastAndRescue();

        expect(municipalService.sendSander).not.toHaveBeenCalled();
    });

    it('sends a snowplow when snowfall is bigger than 3', function () {
        spyOn(weatherForecastService, 'getSnowfallInMm').and.returnValue(4);
        spyOn(municipalService, 'sendSnowplow');

        rescueService.checkForecastAndRescue();

        expect(municipalService.sendSnowplow.calls.count()).toEqual(1);
    });

    it('does not send a snowplow when snowfall is 3 or less', function () {
        spyOn(weatherForecastService, 'getSnowfallInMm').and.returnValue(3);
        spyOn(municipalService, 'sendSnowplow');

        rescueService.checkForecastAndRescue();

        expect(municipalService.sendSnowplow).not.toHaveBeenCalled();
    });

    it('sends 2 snowplows when snowfall is bigger than 5', function () {
        spyOn(weatherForecastService, 'getSnowfallInMm').and.returnValue(6);
        spyOn(municipalService, 'sendSnowplow');

        rescueService.checkForecastAndRescue();

        expect(municipalService.sendSnowplow.calls.count()).toEqual(2);
    });

    it('sends another snowplow when first one is broken', function () {
        spyOn(weatherForecastService, 'getSnowfallInMm').and.returnValue(4);
        var isFirst = true;
        spyOn(municipalService, 'sendSnowplow').and.callFake(function () {
            if (isFirst) {
                isFirst = false;
                throw 'SnowplowMalfunction';
            }
        });

        rescueService.checkForecastAndRescue();

        expect(municipalService.sendSnowplow.calls.count()).toEqual(2);
    });

    it('reacts to extreme weather conditions', function () {
        spyOn(weatherForecastService, 'getSnowfallInMm').and.returnValue(11);
        spyOn(weatherForecastService, 'getTemperatureInCelsius').and.returnValue(-11);
        spyOn(municipalService, 'sendSnowplow');
        spyOn(pressService, 'sendWeatherAlert');

        rescueService.checkForecastAndRescue();

        expect(municipalService.sendSnowplow.calls.count()).toEqual(3);
        expect(municipalService.sendSander).toHaveBeenCalled();
        expect(pressService.sendWeatherAlert).toHaveBeenCalledWith("SEVERE");
    });

});