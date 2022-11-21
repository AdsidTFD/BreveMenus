# Breve Menus

Library to make some complex website functions easier.

* Custom Timer class to handle timeouts with much more control.
* Easy to make tooltips that can utilise the built in `title` attribute.
* Context menus vastly simplified - you only need a simple JSON object!

## Documentation

### Timer

#### `new BreveTimer(continueWaiting)`

To create a new timer object, you can use a simple object constructor.

##### Parameters:
* boolean `continueWaiting` - This parameter determines whether the current state of the timer is saved when it is reset. When set to `true`, setting a new timer function does not automatically start the timer, and the [`start()`](#start) must be used to start the timer. When set to `false`, setting a new timer function will automatically start the timer. This defaults to `false`.

##### Examples:
```js
let myTimer = new BreveTimer(true);
// myTimer is a timer that will keep its state when cancelled or reset.

let myOtherTimer = new BreveTimer();
// myOtherTimer will not keep its state when cancelled or reset.
```

#### `set(toRun, delay, onWait)`

This sets the timer with a function to run after a certain delay. If [`continueWaiting`](#new-brevetimercontinuewaiting) is set to `true`, the timer will automatically start. Otherwise, use [`start()`](#start) to start the timer.

##### Parameters:
* function `toRun` - This parameter contains the function that is to be run when the timer finishes.
* number `delay` - This parameter contains the amount of time in milliseconds to wait before running the function contained in `toRun`. This defaults to 1000 milliseconds (1 second).
* function `onWait` - This parameter contains the function that is to be run when the [`wait()`](#wait) function is called. If left blank, nothing extra will happen.

##### Examples:
```js
myTimer.set(myFunction);
// myTimer has been set to run myFunction() after the default 1000 milliseconds.

myTimer.set(myFunction, 750);
// myTimer has been set to run myFunction() after 750 milliseconds.

myTimer.set(() => {
    console.log("Timer!");
}, 1500, myFunction.bind(null, myParameter));
// myTimer has been set to log "Timer!" to the console after 1500 milliseconds.
// If wait() is called on myTimer, it will run myFunction(myParameter).
```

#### `wait()`

This stops the timer, which will wait until the [`start()`](#start) function is called.

##### Parameters:
None

##### Examples:
```js
myTimer.wait();
// myTimer will not count down until it is reset or started.
```

#### `start()`

This starts the timer if it is currently stopped. It will always start with the currently defined delay.

##### Parameters:
None

##### Examples:
```js
myTimer.start();
// myTimer is no longer paused.
```

#### `cancel()`

This stops the timer, and resets the values of [`toRun`](#settorun-delay-onwait) and [`delay`](#settorun-delay-onwait), but retains the value of [`continueWaiting`](#new-brevetimercontinuewaiting) and [`onWait`](#settorun-delay-onwait).

##### Parameters:
None

##### Examples:
```js
myTimer.cancel();
// myTimer has been cancelled.
```