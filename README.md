# SteelScene

*Animation devtools for production code*

[![npm version](https://badge.fury.io/js/steel-scene.svg)](https://badge.fury.io/js/steel-scene)
[![Build Status](https://travis-ci.org/steel-scene/steel-scene.svg?branch=master)](https://travis-ci.org/steel-scene/steel-scene)
[![Downloads](https://img.shields.io/npm/dm/steel-scene.svg)](https://www.npmjs.com/package/steel-scene)

## Features

- Animate existing sites from localhost using the devtools
- Build animations without thinking about specific frameworks

## Why use SteelScene?

- Human readable code in HTML or JSON
- Zero config

> Power this project up with 🌟s,  [^ star it please](https://github.com/steel-scene/steel-scene/stargazers).

## Setup

### Setup for use in the browser
Include this script
```html
<script src="https://unpkg.com/steel-scene/dist/steel-scene.min.js"></script>
```

### Setup for bundling (or if you want typings for TypeScript)

```bash
npm install steel-scene --save
```

## Getting Started
There are two different ways to build out animations with SteelScene.  The most straightforward way is writing it as HTML before the page loads

```html
<div id="box1">BOX 1</div>

<scene name="boxes">
    <state name="hiddenLeft" default>
        <target ref="#box1" opacity="0" x="-50px" />
    </state>
    <state name="reset">
        <target ref="#box1" opacity="1" x="0" />
    </state>
    <transition easing="ease-out" duration="250" default />
</scene>
```
**In the example, we have a ```boxes``` scene which will start in the ```hiddenLeft``` state.**

- The scene contains two states, ```hiddenLeft``` and ```reset```.  ```hiddenLeft``` is marked as the ```default```.
- Each state modifies the opacity and x property of ```#box1```.
- The ```default``` transition instructs the animation engine to transition for 250 milliseconds and move along an ```ease-out``` curve.

**Here is an example of how to do the same thing using JSON:**

```js
const json = {
    boxes: {
        states: {
            hiddenLeft: {
                default: true,
                targets: [
                    { ref: '#box1', opacity: '0', x: '-50px' }
                ]
            },
            reset: {
                targets: [
                    { ref: '#box1', opacity: '1', x: '0' }
                ]
            }
        },
        transitions: {
            _: {
                {  default: true, easing: 'ease-out', duration: 250 }
            }
        }
    }
};
steel.importJSON(json);
```

**To transition from one state to another:**
```js
// transitions to reset
steel.transition('boxes', 'reset');
```

**To transition between multiple states, keep adding more state names:**
```js
// transitions to reset and then to hidden-left
steel.transition('boxes', 'reset', 'hiddenLeft', ...);
```

**To move directly to a state without a transition:**
```js
// go directly to reset, do not pass GO, do not collect $200
steel.set('boxes', 'reset');
```

**Here are some other handy functions**
```js
// resets all scenes to their starting state
steel.reset();

// import new scenes from an element
steel.importHTML(element);
```

## What's next?

Get a simple prototype working and posted.   Stay tuned!

## Contributions

Contributions and issues are very welcome :)  Make sure to put in an issue with your intent before doing a Pull Request.
