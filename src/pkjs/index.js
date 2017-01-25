// Author: Ed Dam

// pebblejs
require('pebblejs');

// clayjs
var Clay       = require('pebble-clay');
var clayConfig = require('./config');
var clay = new Clay(clayConfig);

// libraries
var UI       = require('pebblejs/ui');
var Vector2  = require('pebblejs/lib/vector2');
//var ajax   = require('pebblejs/lib/ajax');
var Settings = require('pebblejs/settings');
var Vibe     = require('pebblejs/ui/vibe');

// definitions
var window = new UI.Window();
var windowSize = window.size();
var size = new Vector2(windowSize.x, windowSize.y);
//var icon = 'images/menu_icon.png';
var backgroundColor = 'black';
var highlightBackgroundColor = 'white';
//var textColor = 'white';
var highlightTextColor = 'black';
var textAlign = 'center';
var fontXLarge = 'roboto-bold-subset-49';
var fontLarge = 'gothic-28-bold';
var fontMedium = 'gothic-24-bold';
var fontSmall = 'gothic-18-bold';
var fontXSmall = 'gothic-14-bold';
//var style = 'small';
function position(height){
  return new Vector2(0, windowSize.y / 2 + height);
}

// main screen
var mainWind = new UI.Window();
var mainText = new UI.Text({size: size, backgroundColor: backgroundColor, textAlign: textAlign});
var mainImage = new UI.Image({size: size});
mainText.position(position(-75));
mainImage.position(position(-70));
mainText.font(fontLarge);
mainText.text('TIMER');
mainImage.image('images/splash.png');
mainWind.add(mainText);
mainWind.add(mainImage);
mainWind.show();

// up screen
mainWind.on('click', 'up', function(e) {
  var upWind = new UI.Window();
  var upHead = new UI.Text({size: size, backgroundColor: backgroundColor, textAlign: textAlign});
  var upText = new UI.Text({size: size, backgroundColor: backgroundColor, textAlign: textAlign});
  upHead.position(position(-35));
  upText.position(position(-5));
  upHead.font(fontLarge);
  upText.font(fontMedium);
  upHead.text('Timer');
  upText.text('Countdown');
  upWind.add(upHead);
  upWind.add(upText);
  upWind.show();
});

// down screen
mainWind.on('click', 'down', function(e) {
  var downWind = new UI.Window();
  var downHead = new UI.Text({size: size, backgroundColor: backgroundColor, textAlign: textAlign});
  var downText = new UI.Text({size: size, backgroundColor: backgroundColor, textAlign: textAlign});
  downHead.position(position(-30));
  downText.position(position(-5));
  downHead.font(fontMedium);
  downText.font(fontSmall);
  downHead.text('Timer v1.0');
  downText.text('by Edward Dam');
  downWind.add(downHead);
  downWind.add(downText);
  downWind.show();
});

// select button
mainWind.on('click', 'select', function(e) {

  // load saved ip
  var timerMins = Settings.data('timermins');
  console.log('Loaded timermins: ' + timerMins);
  if ( timerMins === undefined || timerMins === null ) {
    timerMins = 1;
  }
    
  // display timer screen
  var timerWind = new UI.Window();
  var timerHead = new UI.Text({size: size, backgroundColor: backgroundColor, textAlign: textAlign});
  var timerText = new UI.Text({size: size, textAlign: textAlign,
    color: highlightTextColor, backgroundColor: highlightBackgroundColor
  });
  var timerInfo = new UI.Text({size: size, backgroundColor: backgroundColor, textAlign: textAlign});
  timerHead.position(position(-70));
  timerText.position(position(-28));
  timerInfo.position(position(+33));
  timerHead.font(fontMedium);
  timerText.font(fontSmall);
  timerInfo.font(fontXSmall);
  timerHead.text('Timer');
  timerText.text('\nMinutes: ' + timerMins);
  timerInfo.text('\n[ up / down ]');
  timerWind.add(timerHead);
  timerWind.add(timerText);
  timerWind.add(timerInfo);
  timerWind.show();
  mainWind.hide();
  
  // increase minutes click
  timerWind.on('click', 'up', function() {
    if ( timerMins >= 1 && timerMins < 60 ) {
      adjustcountdown(+1, timerMins);
    }
  });
  
  // increase minutes long click
  timerWind.on('longClick', 'up', function() {
    if ( timerMins >= 1 && timerMins <= 50 ) {
      adjustcountdown(+10, timerMins);     
    }
  });
  
  // decrease minutes click
  timerWind.on('click', 'down', function() {
    if ( timerMins > 1 && timerMins <= 60 ) {
      adjustcountdown(-1, timerMins);
    }
  });
  
  // decrease minutes long click
  timerWind.on('longClick', 'down', function() {
    if ( timerMins > 10  && timerMins <= 60 ) {
      adjustcountdown(-10, timerMins);
    }
  });
  
  // display timer
  timerWind.on('click', 'select', function() {
    
    // save minutes
    Settings.data('timermins', timerMins);
    
    // display timer
    var countdownWind = new UI.Window();
    var countdownHead = new UI.Text({size: size, backgroundColor: backgroundColor, textAlign: textAlign});
    var countdownText = new UI.Text({size: size, textAlign: textAlign,
      color: highlightTextColor, backgroundColor: highlightBackgroundColor
    });
    var countdownInfo = new UI.TimeText({size: size, backgroundColor: backgroundColor, textAlign: textAlign});
    countdownHead.position(position(-70));
    countdownText.position(position(-28));
    countdownInfo.position(position(+33));
    countdownHead.font(fontMedium);
    countdownText.font(fontSmall);
    countdownInfo.font(fontXSmall);
    countdownHead.text('Countdown');
    countdownText.text('\nREADY...');
    countdownInfo.text('\nLocal Time: %H:%M');
    countdownWind.add(countdownHead);
    countdownWind.add(countdownText);
    countdownWind.add(countdownInfo);
    countdownWind.show();
    timerWind.hide();
    
    // countdown
    var duration = 60 * timerMins;
    var timer = duration, minutes, seconds;
    var countdown = setInterval(function () {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      console.log(minutes + ":" + seconds);
      countdownText.font(fontXLarge);
      countdownText.text(minutes + ":" + seconds);
      countdownWind.add(countdownText);
      countdownWind.add(countdownInfo);
      if (--timer < 0) {
        clearInterval(countdown);
        Vibe.vibrate('long');
      }
    }, 1000);
  
  });

  // function adjust countdown
  function adjustcountdown(amount, minutes) {
    timerMins = minutes + amount;
    timerText.text('\nMinutes: ' + timerMins);
    timerWind.add(timerText);
    timerWind.add(timerInfo);
  }
});
