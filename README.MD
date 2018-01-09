Snow Mocks
==========

Zaimplementuj SnowRescueService - to jest twój System Under Test. Wszystkie pozostałe obiekty potraktuj jako zależności.

1. Wyślij piaskarkę (sander) tylko jeśli temperatura będzie poniżej 0 st C

1. Wyślij pług (snowplow) tylko jeśli opady śniegu przekroczą 3 mm
	
1. Jeśli pług nawali (`throw 'SnowplowMalfunction'`) - wyślij kolejny
		
1. Wyślij dwa pługi tylko jeśli opady śniegu przekroczą 5 mm

1. Jeśli temperatura będzie poniżej -10 i opady śniegu przekroczą 10 mm, wyślij trzy pługi, piaskarkę i powiadom prasę, określając poziom zagrożenia jako "SEVERE". 	 