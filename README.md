# Breve Menus

Library to make some complex website functions easier.

* Custom Timer class to handle timeouts with much more control.
* Easy to make tooltips that can utilise the built in `title` attribute.
* Context menus vastly simplified - you only need a simple JSON object!

## Table of Contents
* [Timer](#timer)
* [Tooltips](#tooltips)

## Timer

The `BreveTimer` class allows you to create objects that function as timeouts with more control, such as pausing and resetting the timer.

### `new BreveTimer(continueWaiting)`

To create a new timer object, you can use a simple object constructor.

#### Parameters:
* boolean `continueWaiting` - This parameter determines whether the current state of the timer is saved when it is reset. When set to `true`, setting a new timer function does not automatically start the timer, and the [`start()`](#start) must be used to start the timer. When set to `false`, setting a new timer function will automatically start the timer. This defaults to `false`.

#### Examples:
```js
let myTimer = new BreveTimer(true);
// myTimer is a timer that will keep its state when cancelled or reset.

let myOtherTimer = new BreveTimer();
// myOtherTimer will not keep its state when cancelled or reset.
```

### `set(toRun, delay, onWait)`

This sets the timer with a function to run after a certain delay. If [`continueWaiting`](#new-brevetimercontinuewaiting) is set to `true`, the timer will automatically start. Otherwise, use [`start()`](#start) to start the timer.

#### Parameters:
* function `toRun` - This parameter contains the function that is to be run when the timer finishes.
* number `delay` - This parameter contains the amount of time in milliseconds to wait before running the function contained in `toRun`. This defaults to 1000 milliseconds (1 second).
* function `onWait` - This parameter contains the function that is to be run when the [`wait()`](#wait) function is called. If left blank, nothing extra will happen.

#### Examples:
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

### `wait()`

This stops the timer, which will wait until the [`start()`](#start) function is called.

#### Parameters:
None

#### Example:
```js
myTimer.wait();
// myTimer will not count down until it is reset or started.
```

### `start()`

This starts the timer if it is currently stopped. It will always start with the currently defined delay.

#### Parameters:
None

#### Example:
```js
myTimer.start();
// myTimer is no longer paused.
```

### `cancel()`

This stops the timer, and resets the values of [`toRun`](#settorun-delay-onwait) and [`delay`](#settorun-delay-onwait), but retains the value of [`continueWaiting`](#new-brevetimercontinuewaiting) and [`onWait`](#settorun-delay-onwait).

#### Parameters:
None

#### Example:
```js
myTimer.cancel();
// myTimer has been cancelled.
```

## Tooltips

Tooltips are simplified with Breve Menus, with a single method allowing you to create custom tooltips, which can be modified with CSS.

### Config Options

* number `tooltipDelay` - The amount of time the user needs to hover over an element to make the tooltip appear in milliseconds. This defaults to 750 milliseconds.
* number `tooltipFadeTime` - The length of the fade animation for tooltips. This defaults to 0 milliseconds.
* object `tooltipOffset` - How far the tooltip should appear from the mouse.
    * number `x` - How far right the tooltip should appear from the mouse in pixels. Negative goes left. This defaults to 5.
    * number 'y' - How far down the tooltip should appear from the mouse in pixels. Negative goes up. This defaults to 5.

### `setTooltip(obj, text)`

This sets the tooltip for the given element, and makes it so that the tooltip will appear when hovering over the element for a certain amount of time.

#### Parameters:
* HTMLElement `obj` - This is the element to which the tooltip should be added.
* string `text` - This is the text that will display on the tooltip. If left blank, this will default to the `title` attribute of the element passed with the `obj` parameter.

#### Examples:
```html
<div id="myElement">
    <span>My text</span>
</div>
<div id="myOtherElement" title="This is my title.">
    <span>More text!</span>
</div>
<div id="myThirdElement" title="This title will be ignored">
    <span>Even more text!</span>
</div>
```
```js
let myElement = document.getElementById("myElement");
setTooltip(myElement, "Custom tooltip");
// myElement will now display a tooltip that says "Custom tooltip".

let myOtherElement = document.getElementById("myOtherElement");
setTooltip(myOtherElement);
// myOtherElement will now display a tooltip that says "This is my title."

let myThirdElement = document.getElementById("myThirdElement");
setTooltip(myThirdElement, "Replacement tooltip!");
// myThirdElement will now display a tooltip that says "Replacement tooltip!"
```

![myElement Tooltip](/images/tooltip1.png)

![myOtherElement Tooltip](/images/tooltip2.png)

![myThirdElement Tooltip](/images/tooltip3.png)

### CSS

These are the CSS rules that you will need to set if you would like to customise your tooltips.

#### Tooltip Container

```css
#BreveTooltip
{
    /* Add your modified rules here. */
}
```

#### Tooltip Text

```css
#BreveTooltip #BreveTooltipText
{
    /* Add your modified rules here. */
}
```