const RescueService = require('../src/rescue-service');
const MunicipalService = require('../src/dependencies/municipal-service');
const PressService = require('../src/dependencies/press-service');
const WeatherForecastService = require('../src/dependencies/weather-forecast-service');

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

    it('--- specify first behavior here ---', function () {
        expect(rescueService).toBeDefined();
    });

});
