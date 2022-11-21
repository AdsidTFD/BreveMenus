# Breve Menus

Library to make some complex website functions easier.

* Custom Timer class to handle timeouts with much more control.
* Easy to make tooltips that can utilise the built in `title` attribute.
* Context menus vastly simplified - you only need a simple JSON object!

## Table of Contents
* [Config](#config)
* [Timer](#timer)
* [Tooltips](#tooltips)
* [Context Menus](#context-menus)

## Config

These are the config options available with Breve Menus. They can be found at the top of the `brevemenus.js` file, where you can either modify them directly, or modify them through your own file with `BreveMenus.<property>` (the latter is recommended).

* string `iconClass` - This is the class/library from which any icons used by Breve Menus will be used by default. The name of the class MUST be defined in your stylesheets beforehand, otherwise, this won't work. Google's "material icons" pack is built into Breve Menus. Additionally, you cannot use any image. You must use an icon font.
* number [`tooltipDelay`](#tooltips)
* number [`tooltipFadeTime`](#tooltips)
* object [`tooltipOffset`](#tooltips)
* boolean [`hideTooltipOnMouseMove`](#tooltips)
* boolean [`disableDefaultContextMenus`](#context-menus)
* number [`contextMenuFadeTime`](#context-menus)
* object [`contextMenuIcons`](#context-menus)

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
* boolean `hideTooltipOnMouseMove` - Whether the tooltips should be hidden when the mouse is moved. This is true by default.

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

## Context Menus

Context menus can be really complicated, but with Breve Menus, all you need is an object that contains a simple configuration to pass to a method that will do all of the hard work for you.

### Config Options

* boolean `disableDefaultContextMenus` - Setting this to `true` will disable the default context menus on your website altogether, regardless of whether each element has a custom one set. Elements with a custom context menu will always dsiable the default, regardless of what this value is set to.
* number `contextMenuFadeTime` - The length of the fade-in animation for context menus. This defaults to 0 milliseconds.
* object `contextMenuIcons` - The icons to be used for default context menu behaviour.
    * string `toggleUnchecked` - The icon to display on an unchecked toggle item.
    * string `toggleChecked` - The icon to display on a checked toggle item.
    * string `submenu` - The icon to display on a category item.

### `makeContextMenu(ancestor, menu)`

This will create your context menu, as well as do all of the handling necessary for it, including all of the event listeners. The context menus can be closed by left clicking outside the menu, right clicking outside the menu, or hitting the `Escape` key.

#### Parameters:

* HTMLElement `ancestor` - This is the element to which the context menu will be added. That is, right clicking on this element will open its menu.
* Object [`menu`](#menu-object) - This is the object containing all of the menu configuration.

#### Example:

```html
<div id="myElement">
    <span>There is text here.</span>
</div>
```
```js
let myElement = document.getElementById("myElement");
makeContextMenu(myElement, myMenu); // See the Menu Object section for information on myMenu.
// myElement will now open the myMenu context menu when right clicked.
```

### Menu Object

Context menus can be created by making an object that contains some basic configuration for the menu. This is extremely easy to do.

There are three types of menu items: functions, categories, and separators.

Note: Two items within the same list cannot have the same name. However, if they are in separate lists, such as one in the main list and one in a sublist, there is no problem.

#### Function Items

Function items are items that, when clicked, will run a specific function. They have the following configuration.

##### Name

Declare the name of the function item in a string identifier. This is the text that will be displayed on the item in the context menu.

```js
"This is item text.": {
    // Item configuration in here.
}
```

##### Type

Every function item will have the type listed as `"function"`.
This is REQUIRED.

```js
"This is item text.": {
    type: "function"
}
```

##### Run

Every function item must contain a callback to a function that will be called when it is clicked. This is REQUIRED.

```js
"This is item text.": {
    type: "function",
    run: ()=>
    {
        console.log("Hello console!");
    }
}
```

##### Icon

Function items may contain an icon next to the text for decoration or clarity.
The library for these icons will default to whatever you have configured to your `iconClass` in your [config](#config).
This is OPTIONAL.

```js
"This is item text.": {
    type: "function",
    run: ()=>
    {
        console.log("Hello console!");
    },
    icon: "diamond"
}
```

##### Icon Library

Function items with an icon may have their icon class set to something specific, if you want it to differ from your `iconClass` in [config](#config).
This is OPTIONAL.

```js
"This is item text.": {
    type: "function",
    run: ()=>
    {
        console.log("Hello console!");
    },
    icon: "diamond",
    iconlib: "material-icons"
}
```

##### Condition

Function items can be disabled by setting a boolean value for their condition. By default, the item will be usable, but, if set to `false`, will grey out the item and render it unusable.
This is OPTIONAL.

```js
"This is item text.": {
    type: "function",
    run: ()=>
    {
        console.log("Hello console!");
    },
    icon: "diamond",
    iconlib: "material-icons",
    condition: true
}
```

##### Toggle

Function items can be set to be a checkbox. This is only for display reasons, and the boolean value is only displayed as it is passed. If no value is set, the checkbox will not display.
This is OPTIONAL.

```js
"This is item text.": {
    type: "function",
    run: ()=>
    {
        console.log("Hello console!");
    },
    icon: "diamond",
    iconlib: "material-icons",
    condition: true,
    toggle: false
}
```

#### Category Items

Category items are menu items that, when clicked on or hovered over, will open a submenu containing children items. This does not have a limit (but don't abuse it, for your users' sake!).

##### Name

Declare the name of the category item in a string identifier. This is the text that will be displayed on the item in the context menu.

```js
"This is category text.": {
    // Item configuration in here.
}
```

##### Type

Every category item will have the type listed as `"category"`.
This is REQUIRED.

```js
"This is category text.": {
    type: "category"
}
```

##### Icon

Category items may contain an icon next to the text for decoration or clarity.
The library for these icons will default to whatever you have configured to your `iconClass` in your [config](#config).
This is OPTIONAL.

```js
"This is category text.": {
    type: "category",
    icon: "settings"
}
```

##### Icon Library

Category items with an icon may have their icon class set to something specific, if you want it to differ from your `iconClass` in [config](#config).
This is OPTIONAL.

```js
"This is category text.": {
    type: "category",
    icon: "settings",
    iconlib: "material-icons"
}
```

##### Condition

Category items can be disabled by setting a boolean value for their condition. By default, the item will be usable, but, if set to `false`, will grey out the item and render it unusable.
This is OPTIONAL.

```js
"This is category text.": {
    type: "category",
    icon: "settings",
    iconlib: "material-icons",
    condition: true
}
```

##### Children

Category items, if their condition is not set to `false`, must have children to display as part of a submenu. The format of these children is the same as the format of any other item, simply nested inside the children attribute.
This is REQUIRED.

```js
"This is category text.": {
    type: "category",
    icon: "settings",
    iconlib: "material-icons",
    condition: true,
    children: {
        "This is sub-item 1": {
            type: "function",
            run: myFunction
        },
        "This is sub-item 2": {
            type: "function",
            run: myFunction,
            condition: false
        }
    }
}
```

#### Separator Items

Separator items will simply display a thin line across the context menu, serving to separate multiple sections of said menu.

##### Name

The name of the separator does not matter, but it must not match the name of any other separator in the same menu.

##### Type

Every separator item will have the type listed as `"separator"`.
This is REQUIRED.

```js
"This is a separator": {
    type: "separator"
}
```

#### Overall Example

```html
<div id="myElement">
    <span>There is text here.</span>
</div>
```
```js
let myElement = document.getElementById("myElement");
let menu = {
    "Log to console": {
        type: "function",
        run: ()=> {
            console.log("Logged!");
        },
        icon: "terminal",
        iconlib: "material-icons"
    },
    "Hover to view submenu": {
        type: "category",
        children: {
            "I am a child item!": {
                type: "function",
                run: myFunction.bind(null, myParameter),
                toggle: true
            },
            "I am also a child item.": {
                type: "function",
                run: ()=> {
                    myFunction(myParameter);
                },
                toggle: false
            }
        }
    },
    "Cool separator": {
        type: "separator"
    },
    "Useless item": {
        type: "function",
        run: ()=>
        {
            console.log("you can't even click this.");
        },
        condition: false
    }
};
makeContextMenu(myElement, menu);
```

![Context Menu](/images/contekst.png)

### CSS

These are the CSS rules that you will need to set if you would like to customise your context menus.

#### Context Menu Background

```css
#BreveContextMenu .contextMenu
{
    /* Add your modified rules here. */
}
```

#### Context Menu Button Container

```css
#BreveContextMenu .contextMenu .btn
{
    /* Add your modified rules here. */
}
```

#### Context Menu Button Hover

```css
#BreveContextMenu .contextMenu .btn:hover:not(.noFunction)
{
    /* Add your modified rules here. */
}
```

#### Context Menu Button with Submenu Selected

```css
#BreveContextMenu .contextMenu .btn.selected
{
    /* Add your modified rules here. */
}
```

#### Context Menu Button Disabled

```css
#BreveContextMenu .contextMenu .btn.noFunction
{
    /* Add your modified rules here. */
}
```

#### Context Menu Button Icon

```css
#BreveContextMenu .contextMenu .btn .icon > i
{
    /* Add your modified rules here. */
}
```

#### Context Menu Button Text

```css
#BreveContextMenu .contextMenu .btn .text > span
{
    /* Add your modified rules here. */
}
```

#### Context Menu Separator Container

```css
#BreveContextMenu .contextMenu .separator
{
    /* Add your modified rules here. */
}
```

#### Context Menu Separator Line

```css
#BreveContextMenu .contextMenu .separator > div
{
    /* Add your modified rules here. */
}
```