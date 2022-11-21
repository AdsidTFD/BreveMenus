'use strict';

/**
 * @typedef config
 * @property {number} tooltipDelay How long the user must hover over an element for a tooltip to appear.
 * @property {number} tooltipFadeTime How long the fade animation for tooltips plays (milliseconds).
 * @property {object} tooltipOffset How far the tooltip should be from the mouse.
 * @property {number} tooltipOffset.x How far right the tooltip should be from the mouse. Negative values to go left.
 * @property {number} tooltipOffset.y How far down the tooltip should be from the mouse. Negative values to go up.
 * @property {string} iconClass The library to use for icons.
 * @property {boolean} disableDefaultContextMenus Disable default context menus everywhere, including on items that haven't been given a custom one.
 */
/**
 * @type config
 */
const BreveMenus =
{
    tooltipDelay: 750,
    tooltipFadeTime: 0,
    tooltipOffset: {x: 5, y: 5},
    hideTooltipOnMouseMove: true,
    iconClass: "material-icons",
    disableDefaultContextMenus: false
}

const mouse = {x: 0, y: 0};
window.addEventListener('mousemove', (event)=>
{
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});
window.addEventListener('contextmenu', (event)=>
{
    event.preventDefault();
});

/**
 * Checks if the mouse is inside a given element during a given mouse event.
 * @param {MouseEvent} event The mouse event to read from.
 * @param {HTMLElement} obj The element to be checked.
 * @returns {boolean} Whether the mouse is inside the given element.
 */
function mouseInside(event, obj)
{
    let rect = obj.getBoundingClientRect();
    return (event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom);
}

/**
 * Returns a number restricted by a min and max value.
 * @param {number} num The number to be restricted.
 * @param {number} min The minimum value to return.
 * @param {number} max The maximum value to return.
 * @returns {number} The restricted number result.
 */
function clamp(num, min = 0, max = Infinity)
{
    return Math.max(min, Math.min(num, max));
}

/**
 * Returns an element from a query.
 * @param {string} query The query to search for.
 * @param {HTMLElement} ancestor The element to search within for the query.
 * @returns {HTMLElement} The found element from the query.
 */
function _qs(query, ancestor = document)
{
    return ancestor.querySelector(query);
}

/**
 * Returns an array of elements from a query.
 * @param {string} query The query to search for.
 * @param {HTMLElement} ancestor The element to search within for the query.
 * @returns {NodeListOf<Element>} The array of found elements from the query.
 */
function _qsa(query, ancestor = document)
{
    return ancestor.querySelectorAll(query);
}

class BreveTimer
{
    /**
     * Creates a new BreveTimer object.
     * @param {boolean} continueWaiting Whether the current state of the timer is saved. When `true`, the timer will automatically start upon `set()`. Otherwise, `start()` is the only way to start the timer. Defaults to false.
     */
    constructor(continueWaiting = false)
    {
        this.active = false;
        this.t = null;
        this.waitingToRun = null;
        this.waitingDelay = 1000;
        this.onWait = null;
        this.continueWaiting = continueWaiting;
        this.waiting = false;
    }
    /**
     * Sets the timer.
     * @param {function} toRun Function to run when timer ends.
     * @param {number} delay Duration of timer (milliseconds). Defaults to 1000.
     * @param {function} onWait Function to run when `wait()` is called.
     */
    set(toRun, delay = this.waitingDelay, onWait = null)
    {
        this.active = true;
        this.waitingToRun = toRun;
        this.waitingDelay = delay;
        this.onWait = onWait;
        if(this.t !== null)
            clearTimeout(this.t);
        if(!this.waiting)
            this.t = setTimeout(this.waitingToRun, this.waitingDelay);
    }
    /**
     * Pauses the timer. Resume with `start()`.
     */
    wait()
    {
        this.waiting = true;
        if(this.t !== null)
        {
            clearTimeout(this.t);
            this.t = null;
        }
        if(this.onWait !== null)
            this.onWait();
    }
    /**
     * Starts the timer if it has not been started or is currently waiting.
     */
    start()
    {
        if(this.waiting)
            this.t = setTimeout(this.waitingToRun, this.waitingDelay);
        this.waiting = false;
    }
    /**
     * Cancels the timer.
     */
    cancel()
    {
        if(this.t !== null)
        {
            clearTimeout(this.t);
            this.t = null;
        }
        if(!this.continueWaiting)
            this.waiting = false;
        this.active = false;
        this.waitingToRun = null;
        this.waitingDelay = 1000;
    }
}

/**
 * @typedef LeftTop
 * @property {number} left The horizontal position at which the element should be placed.
 * @property {number} top The vertical position at which the element should be placed.
 */
/**
 * Returns a left and top position to place an element relative to the current mouse position and the size of the element.
 * @param {HTMLElement} obj The element to find a position for.
 * @param {number} offsetX How far from the mouse the element should be horizontally.
 * @param {number} offsetY How far from the mouse the element should be vertically.
 * @returns {LeftTop} The position at which the element should be placed.
 */
function mouseRelativePosition(obj, offsetX = 0, offsetY = 0)
{
    return {
        left: ((obj.getBoundingClientRect().width > window.innerWidth - mouse.x) ? clamp(mouse.x - obj.getBoundingClientRect().width - (2 * offsetX)) : (mouse.x + offsetX)),
        top: ((obj.getBoundingClientRect().height > window.innerHeight - mouse.y) ? clamp(mouse.y - obj.getBoundingClientRect().height - (2 * offsetY)) : (mouse.y + offsetY))
    };
}

/**
 * Makes an element visible with a fade animation.
 * @param {HTMLElement} obj The element to be made visible.
 */
function show(obj)
{
    obj.classList.add("shown");
    obj.classList.remove("hidden");
    obj.classList.remove("hiddenByDefault");
}

/**
 * Hides an element with a fade animation.
 * @param {HTMLElement} obj The element to be hidden.
 */
function hide(obj)
{
    if(!obj.classList.contains("hiddenByDefault"))
    {
        obj.classList.add("hidden");
        obj.classList.remove("shown");
    }
}

/**
 * Hides an element by default, so that a fade out animation does not play upon load.
 * @param {HTMLElement} obj The element to be hidden by default.
 */
function hideByDefault(obj)
{
    obj.classList.add("hiddenByDefault");
    obj.classList.add("hidden");
}

const tooltipTimer = new BreveTimer(true);
let tooltip = document.createElement('div');
tooltip.id = "BreveTooltip";
tooltip.style.animationDuration = `${BreveMenus.tooltipFadeTime}ms`;
let tooltipText = document.createElement('span');
tooltipText.id = "BreveTooltipText";
tooltip.append(tooltipText);
hideByDefault(tooltip);
document.body.append(tooltip);

/**
 * Creates and returns a div containing an icon.
 * @param {string} iconName The icon to use.
 * @param {string} library The icon library to get the icon from.
 * @returns {HTMLElement} A div containing the icon.
 */ 
function makeIcon(iconName = "", library = BreveMenus.iconClass)
{
    if(library == "")
        return null;
    let div = document.createElement('div');
    div.className = "icon";
    let i = document.createElement('i');
    i.className = library;
    if(iconName != "")
        i.innerHTML = iconName;
    div.append(i);
    return div;
}

/**
 * Creates and returns a div containing text.
 * @param {string} text The text to use.
 * @returns A div containing the text.
 */
function makeText(text)
{
    let div = document.createElement('div');
    div.className = "text";
    let span = document.createElement('span');
    span.innerHTML = text;
    div.append(span);
    return div;
}

/**
 * Creates and returns a button with an icon and/or text.
 * @param {string} icon The icon to display.
 * @param {string} text The text to display.
 * @param {string} iconClass The icon library to get the icon from.
 * @returns A button with the icon and text divs contained.
 */
function makeButton(icon = "", text = "", iconClass = BreveMenus.iconClass)
{
    let button = document.createElement('button');
    button.classList.add("btn");
    if(icon != "")
    {
        let tempIcon = makeIcon(icon, iconClass);
        if(text != "")
            tempIcon.classList.add("withText");
        button.append(tempIcon);
    }
    if(text != "")
        button.append(makeText(text));
    return button;
}

/**
 * Adds a custom tooltip to an element.
 * @param {HTMLElement} obj The element to add a tooltip to.
 * @param {string} text The tooltip to set. If unset, the element's `title` attribute will be used.
 */
function setTooltip(obj, text = "")
{
    if(text == "")
        text = obj.title;
    obj.removeAttribute('title');
    obj.addEventListener('mouseover', ()=>
    {
        tooltipTimer.set(()=>
        {
            tooltipText.innerHTML = text;
            let {left, top} = mouseRelativePosition(tooltip, BreveMenus.tooltipOffset.x, BreveMenus.tooltipOffset.y);
            tooltip.style.left = `${left}px`;
            tooltip.style.top = `${top}px`;
            show(tooltip);
        }, BreveMenus.tooltipDelay, ()=>
        {
            hide(tooltip);
        });
    });
    obj.addEventListener('mousemove', ()=>
    {
        if(BreveMenus.hideTooltipOnMouseMove)
        {
            hide(tooltip);
            if(!tooltipTimer.waiting)
            {
                tooltipTimer.wait();
                tooltipTimer.start();
            }
        }
    });
    obj.addEventListener('mouseout', ()=>
    {
        hide(tooltip);
        tooltipTimer.cancel();
    });
}

let contextMenuParent = null;

/**
 * DO NOT USE. Use `makeContextMenu` if you want to use context menus.
 */
function cancelContextMenu()
{
    if(_qs("#BreveContextMenu") !== null)
    {
        contextMenuParent.classList.remove("contextOpen");
        _qs("#BreveContextMenu").remove();    
        window.removeEventListener('click', leftClickCancelContextMenu);
        window.removeEventListener('contextmenu', cancelContextMenu);
        window.removeEventListener('keydown', escKeyCancelContextMenu);
        tooltipTimer.start();
        contextMenuParent = null;
    }
}

/**
 * DO NOT USE. Use `makeContextMenu` if you want to use context menus.
 * @param {*} event 
 */
function leftClickCancelContextMenu(event)
{
    let mouseInsideMenu = false;
    let allContextMenus = _qsa("#BreveContextMenu .contextMenu");
    for(let i = 0; i < allContextMenus.length; i++)
    {
        if(allContextMenus[i].classList.contains("hidden"))
            continue;
        if(mouseInside(event, allContextMenus[i]))
        {
            mouseInsideMenu = true;
            break;
        }
    }
    if(!mouseInsideMenu)
        cancelContextMenu();
}

/**
 * DO NOT USE. Use `makeContextMenu` if you want to use context menus.
 * @param {*} event 
 */
function escKeyCancelContextMenu(event)
{
    if(event.key == "Escape")
        cancelContextMenu();
}

/**
 * DO NOT USE. Use `makeContextMenu` if you want to use context menus.
 * @param {*} button 
 */
function selectMenuItem(button)
{
    button.classList.add("selected");
}

/**
 * DO NOT USE. Use `makeContextMenu` if you want to use context menus.
 * @param {*} button 
 */
function deselectMenuItem(button)
{
    button.classList.remove("selected");
}

/**
 * DO NOT USE. Use `makeContextMenu` if you want to use context menus.
 * @param {*} div 
 * @param {*} event 
 * @returns 
 */
function contextMenuAlertParent(div, event)
{
    if(_qsa(".selected", div).length > 0)
        return;
    let pos1 = div.className.search("parent-");
    let pos2 = div.className.search("-endparent");
    if(pos1 == -1 || pos2 == -1)
        return;
    let str = div.className.substring(pos1 + 7, pos2);
    let parent = _qs(`#${str}`);
    if(event !== undefined)
    {
        if(mouseInside(event, parent))
            return;
    }
    pos1 = parent.id.search("-itemAtPos");
    if(pos1 == -1)
        return;
    // let buttonParent = document.querySelector(`#${str.substring(0, pos1)}`);
    let buttonParent = _qs(`#${str.substring(0, pos1)}`);
    hide(div);
    deselectMenuItem(parent);
    contextMenuAlertParent(buttonParent);
}

const contextSubLists = {};
let submenuCount = 0;

/**
 * DO NOT USE. Use `makeContextMenu` if you want to use context menus.
 * @param {*} container 
 */
function resolveContextSubLists(container)
{
    let prev = null;
    for(let name in contextSubLists)
    {
        submenuCount++;
        if(prev !== null)
            delete contextSubLists[prev];
        let div = document.createElement('div');
        div.className = "contextMenu";
        div.id = `contextMenuSub${submenuCount}`;
        let button = null;
        let itemCount = 1;
        for(let text in contextSubLists[name])
        {
            let newItem = makeContextMenuItem(text, contextSubLists[name][text]._item);
            if(button === null)
                button = contextSubLists[name][text]._parent;
            if(newItem !== null)
            {
                newItem.id = `contextMenuSub${submenuCount}-itemAtPos${itemCount}`;
                div.append(newItem);
            }
            itemCount++;
        }
        hideByDefault(div);
        if(button !== null)
        {
            setTimeout(() => {
                button.classList.add(`child-${div.id}-endchild`);
                div.classList.add(`parent-${button.id}-endparent`);
                let rect = button.getBoundingClientRect();
                let subrect = div.getBoundingClientRect();
                // If the submenu's width is LEQ to the remaining horizontal space, start
                // the submenu at the end of the parent button
                if(subrect.width <= (window.innerWidth - rect.right))
                    div.style.left = `${rect.right}px`;
                // If the submenu's width is LEQ to the parent button's start X, 
                // put the submenu's end at the start of the parent button
                else if(subrect.width <= rect.left)
                    //div.style.right = `${rect.left}px`;
                    div.style.right = `${window.innerWidth-rect.left}px`;
                // If all else fails, start the submenu on the window's left side
                else
                    //div.style.right = `${window.innerWidth}px`;
                    div.style.left = `0px`;
                // Do the same things but for height
                if(subrect.height <= window.innerHeight - rect.top)
                    div.style.top = `${rect.top}px`;
                else if(subrect.height <= rect.bottom)
                    div.style.bottom = `${rect.bottom}px`;
                else
                    div.style.bottom = `${window.innerHeight}px`;
                // console.log(`Submenu:`, div.id, `\nRemaining horizontal space:`, window.innerWidth - rect.right, `\nSubmenu width:`, subrect.width, `\nPositioning:`, {
                //     top: div.style.top || null,
                //     bottom: div.style.bottom || null,
                //     left: div.style.left || null,
                //     right: div.style.right || null
                // });
            }, 1);
            const delay = new BreveTimer();
            button.addEventListener('mouseover', () => {
                show(div);
                selectMenuItem(button);
                delay.cancel();
            });
            button.addEventListener('mouseleave', (event) => {
                if (!mouseInside(event, div)) {
                    delay.set(() => {
                        hide(div);
                        deselectMenuItem(button);
                    }, 5);
                }
            });
            div.addEventListener('mouseover', () => {
                delay.cancel();
            });
            div.addEventListener('mouseleave', (event) => {
                delay.set(() => {
                    contextMenuAlertParent(div, event);
                }, 5);
            });
        }
        container.append(div);
        prev = name;
    }
    if(prev !== null)
    {
        delete contextSubLists[prev];
        resolveContextSubLists(container);
    }
    else
    {
        submenuCount = 0;
    }
}

/**
 * DO NOT USE. Use `makeContextMenu` if you want to use context menus.
 * @param {*} name 
 * @param {*} item 
 * @returns 
 */
function makeContextMenuItem(name, item)
{
    if(!item.hasOwnProperty('type'))
        return null;
    if((item.type == "function") || (item.type == "category"))
    {
        let icon = "";
        let iconclass = BreveMenus.iconClass;
        let condition = true;
        if(item.hasOwnProperty('icon'))
            icon = item.icon;
        if(item.hasOwnProperty('iconlib'))
            iconclass = item.iconclass;
        if(item.hasOwnProperty('condition'))
            condition = item.condition;
        
        let button = makeButton(icon, name, iconclass);
        button.classList.add(item.type);
        if(!condition)
        {
            button.classList.add("noFunction");
        }
        if(item.type == "function")
        {
            if(!item.hasOwnProperty('run'))
                return null;
            if(condition)
            {
                button.addEventListener('click', item.run);
                button.addEventListener('click', cancelContextMenu);
            }
            if(item.hasOwnProperty('toggle'))
                button.append(makeIcon(item.toggle ? "check_box" : "check_box_outline_blank"));
        }
        else
        {
            if(condition)
            {
                if(item.hasOwnProperty('children'))
                {
                    let sublist = {};
                    for(let text in item.children)
                    {
                        sublist[text] = {
                            _parent: button,
                            _item: item.children[text]
                        };
                    }
                    contextSubLists[name] = sublist;
                }
                else
                    return null;
            }
            button.append(makeIcon("chevron_right"));
        }
        return button;
    }
    else if(item.type == "separator")
    {
        let div = document.createElement('div');
        div.className = item.type;
        let blob = document.createElement('div');
        div.append(blob);
        return div;
        
    }
    else
        return null;
}

/**
 * Creates a context menu for the given element using the given JSON configuration.
 * @param {HTMLElement} ancestor The element to assign the context menu to.
 * @param {Object} menu The JSON object containing the menu configuration.
 */
function makeContextMenu(ancestor, menu)
{
    setTimeout(function()
    {
        contextMenuParent = ancestor;
        let containerDiv = document.createElement('div');
        let div = document.createElement('div');
        hideByDefault(containerDiv);
        containerDiv.id = "BreveContextMenu";
        containerDiv.className = "contextMenuContainer";
        div.className = "contextMenu";
        let itemCount = 1;
        for(let text in menu)
        {
            let newItem = makeContextMenuItem(text, menu[text]);
            if(newItem !== null)
            {
                newItem.id = `contextMenuMain-itemAtPos${itemCount}`;
                div.append(newItem);
            }
            itemCount++;            
        }
        if(_qs("#BreveContextMenu") !== null)
            _qs("#BreveContextMenu").remove();
        div.id = "contextMenuMain";
        containerDiv.append(div);
        document.body.append(containerDiv);
        let {left, top} = mouseRelativePosition(div);
        div.style.left = `${left}px`;
        div.style.top = `${top}px`;
        resolveContextSubLists(containerDiv);
        ancestor.classList.add("contextOpen");
        show(containerDiv);
        tooltipTimer.wait();
        window.addEventListener('click', leftClickCancelContextMenu);
        window.addEventListener('contextmenu', cancelContextMenu);
        window.addEventListener('keydown', escKeyCancelContextMenu);
        return div;
    }, 1);
}