describe('Snow Rescue Service', function () {

    var municipalService;
    var pressService;
    var weatherForecastService;
    var rescueService;

    beforeEach(function () {
        municipalService = new MunicipalService();
        pressService = new PressService();
        weatherForecastService = new WeatherForecastService();
        rescueService = new RescueService(weatherForecastService, municipalService, pressService);
    });

    it('does not send sander if temperature is >= 0', function () {
        spyOn(weatherForecastService, 'getTemperatureInCelsius').and.returnValue(0);
        spyOn(municipalService, 'sendSander');

        rescueService.checkForecastAndRescue();

        expect(municipalService.sendSander).not.toHaveBeenCalled();
    });

    it('sends sander if temperature is < 0', function () {
        spyOn(weatherForecastService, 'getTemperatureInCelsius').and.returnValue(-0.1);

        spyOn(municipalService, 'sendSander');
        rescueService.checkForecastAndRescue();

        expect(municipalService.sendSander.calls.count()).toBe(1);
    });

    it('does not send snowplow if snowfall is <= 3', function () {
        spyOn(weatherForecastService, 'getSnowfallInMm').and.returnValue(3);
        spyOn(municipalService, 'sendSnowplow');

        rescueService.checkForecastAndRescue();

        expect(municipalService.sendSnowplow).not.toHaveBeenCalled();
    });

    it('sends snowplow if snowfall is > 3', function () {
        spyOn(weatherForecastService, 'getSnowfallInMm').and.returnValue(3.1);
        spyOn(municipalService, 'sendSnowplow');

        rescueService.checkForecastAndRescue();

        expect(municipalService.sendSnowplow.calls.count()).toBe(1);
    });

    it('sends another snowplow if previous one failed', function () {
        spyOn(weatherForecastService, 'getSnowfallInMm').and.returnValue(3.1);
        var firstSnowplow = true;
        spyOn(municipalService, 'sendSnowplow').and.callFake(function () {
            if (firstSnowplow) {
                firstSnowplow = false;
                throw new Error('SnowplowMalfunction');
            }
        });

        rescueService.checkForecastAndRescue();

        expect(municipalService.sendSnowplow.calls.count()).toBe(2);
    });

    it('sends 2 snowplows if snowfall is > 5', function () {
        spyOn(weatherForecastService, 'getSnowfallInMm').and.returnValue(5.1);
        spyOn(municipalService, 'sendSnowplow');

        rescueService.checkForecastAndRescue();

        expect(municipalService.sendSnowplow.calls.count()).toBe(2);
    });

    it('sends 3 snowplows, sander, and inform press if snowfall is > 10 and temperature is < -10', function () {
        spyOn(weatherForecastService, 'getTemperatureInCelsius').and.returnValue(-10.1);
        spyOn(weatherForecastService, 'getSnowfallInMm').and.returnValue(10.1);
        spyOn(municipalService, 'sendSander');
        spyOn(municipalService, 'sendSnowplow');
        spyOn(pressService, 'sendWeatherAlert');

        rescueService.checkForecastAndRescue();

        expect(municipalService.sendSnowplow.calls.count()).toBe(3);
        expect(municipalService.sendSander.calls.count()).toBe(1);
        expect(pressService.sendWeatherAlert).toHaveBeenCalledWith('SEVERE');
    });

    it('does not send 3 snowplows, sander, and inform press if snowfall is > 10 but temperature is >= -10', function () {
        spyOn(weatherForecastService, 'getTemperatureInCelsius').and.returnValue(-10);
        spyOn(weatherForecastService, 'getSnowfallInMm').and.returnValue(10.1);
        spyOn(municipalService, 'sendSander');
        spyOn(municipalService, 'sendSnowplow');
        spyOn(pressService, 'sendWeatherAlert');

        rescueService.checkForecastAndRescue();

        expect(municipalService.sendSnowplow.calls.count()).toBe(2);
        expect(municipalService.sendSander.calls.count()).toBe(1);
        expect(pressService.sendWeatherAlert).not.toHaveBeenCalled();
    });

    it('does not send 3 snowplows, sander, and inform press if temperature is < -10 but snowfall is <= 10', function () {
        spyOn(weatherForecastService, 'getTemperatureInCelsius').and.returnValue(-10.1);
        spyOn(weatherForecastService, 'getSnowfallInMm').and.returnValue(10);
        spyOn(municipalService, 'sendSander');
        spyOn(municipalService, 'sendSnowplow');
        spyOn(pressService, 'sendWeatherAlert');

        rescueService.checkForecastAndRescue();

        expect(municipalService.sendSnowplow.calls.count()).toBe(2);
        expect(municipalService.sendSander.calls.count()).toBe(1);
        expect(pressService.sendWeatherAlert).not.toHaveBeenCalled();
    });

});