#include "application.h"

// This #include statement was automatically added by the Particle IDE.
#include "neopixel/neopixel.h"

SYSTEM_MODE(AUTOMATIC);

// IMPORTANT: Set pixel COUNT, PIN and TYPE
#define PIXEL_PIN D6
#define PIXEL_COUNT 150
#define PIXEL_TYPE WS2812B

String command = "rainbow";
String valid_cmds[] = {"rainbow", "flash", "solid", "alternating"};

Adafruit_NeoPixel strip = Adafruit_NeoPixel(PIXEL_COUNT, PIXEL_PIN, PIXEL_TYPE);

void setup() {
    Spark.function("pattern", selPattern);
    
    strip.begin();
    strip.show(); // Initialize all pixels to 'off'
}

void loop() {
    if (command == "flash") {
        flash(10);
    } else if (command == "solid") {
        solid(10);
    } else if (command == "alternating") {
        alternating(10);
    } else {
        rainbow(10);
    }
}

bool isCommand(String cmd) {
    for (int i = 0; i < 4; i++) {
        if (valid_cmds[i] == cmd) {
            return true;
        }
    }
    return false;
}

int selPattern(String cmd) {
    if (isCommand(cmd)) {
        command = cmd;
        return 1;
    }
    
    return -1;
}

/* =============================
   Animation Functions
   Add your animations here! :)
   ============================= */

void rainbow(uint8_t wait) {
    uint16_t i,j;
    for(j=0; j<256; j++) {
        for(i=0; i<strip.numPixels(); i++) {
            strip.setPixelColor(i, Wheel((i+j) & 255));
        }
        strip.show();
        delay(wait);
    }
}

void flash(uint8_t wait) {
    uint16_t i;
    uint32_t color = Wheel(random(255));
    for (i=0;i<strip.numPixels(); i++) {
        strip.setPixelColor(i, color);
    }
    strip.show();
    delay(wait);
}

void solid(uint8_t wait) {
    uint16_t i;
    uint32_t color = Wheel(random(255));
    for (i=0; i<strip.numPixels();i++) {
        strip.setPixelColor(i, color);
    }
    strip.show();
}

void alternating(uint8_t wait) {
    uint16_t i;
    uint32_t color1 = Wheel(random(255)); 
    uint32_t color2 = Wheel(random(255));
    for(i=0;i<strip.numPixels();i++) {
        if ((i%2)==0) {
            strip.setPixelColor(i, color1);
        } else {
            strip.setPixelColor(i, color2);
        }
    }
    strip.show();
    delay(wait);
}


// Input a value 0 to 255 to get a color value.
// The colours are a transition r - g - b - back to r.
uint32_t Wheel(byte WheelPos) {
    if(WheelPos < 85) {
        return strip.Color(WheelPos * 3, 255 - WheelPos * 3, 0);
    } else if(WheelPos < 170) {
        WheelPos -= 85;
        return strip.Color(255 - WheelPos * 3, 0, WheelPos * 3);
    } else {
        WheelPos -= 170;
        return strip.Color(0, WheelPos * 3, 255 - WheelPos * 3);
    }
}
