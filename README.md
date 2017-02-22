# BlueUnicorn

*Prototype Production Animations*

[![npm version](https://badge.fury.io/js/blue-unicorn.svg)](https://badge.fury.io/js/blue-unicorn)
[![Build Status](https://travis-ci.org/blue-unicorn/blue-unicorn.svg?branch=master)](https://travis-ci.org/blue-unicorn/blue-unicorn)
[![Downloads](https://img.shields.io/npm/dm/blue-unicorn.svg)](https://www.npmjs.com/package/blue-unicorn)

## Features

- Create animations using plain HTML or JSON
- Zero config

## Why use BlueUnicorn?

- Build animations without thinking about specific frameworks

> Power this project up with 🌟s,  [^ star it please](https://github.com/blue-unicorn/blue-unicorn/stargazers).

## Setup

### Setup for use in the browser
Include this script
```html
<script src="https://unpkg.com/blue-unicorn/dist/blue-unicorn.min.js"></script>
```

### Setup for bundling (or if you want typings for TypeScript)

```bash
npm install blue-unicorn --save
```

## Getting Started
There are two different ways to build out animations with BlueUnicorn.  The most straightforward way is writing it as HTML before the page loads

```html
<div id="box1">BOX 1</div>

<layer name="box-animations" state="hidden-left">
    <state name="hidden-left">
        <target ref="#box1" opacity="0" x="-50px" />
    </state>
    <state name="reset">
        <target ref="#box1" opacity="1" x="0" />
    </state>
    <curve state-1="hidden-left" state-2="reset" easing="ease-out" duration="250" />
</layer>
```
**In the example, we have a ```box-animations``` layer which will start in the ```hidden-left``` state.**

- The layer contains two states, ```hidden-left``` and ```reset```.
- Each state modifies the opacity and x property of ```#box1```.
- The curve instructs the animation engine to transition for 250 milliseconds and move along an ```ease-out``` curve.

**Here is an example of how to do the same thing using JavaScript:**

```js
bu.loadJSON({
    'box-animations': {
        state: 'hidden-left',
        states: {
            'hidden-left': [{ ref: '#box1', opacity: '0', x: '-50px' }],
            reset: [{ ref: '#box1', opacity: '1', x: '0' }]
        },
        curves: [{ state1: 'hidden-left', state2: 'reset', easing: 'ease-out', duration: 250 }]
    }
})
```

**To transition from one state to another:**
```js
// transitions to reset
bu.transition('box-animations', 'reset');
```

**To transition between multiple states, keep adding more state names:**
```js
// transitions to reset and then to hidden-left
bu.transition('box-animations', 'reset', 'hidden-left', ...);
```

**To move directly to a state without a transition:**
```js
// go directly to reset, do not pass GO, do not collect $200
bu.set('box-animations', 'reset');
```

**Here are some other handy functions**
```js
// resets all layers to their starting state
bu.reset();

// import new layers from an element
bu.importHTML(element);
```

## What's next?

Get a simple prototype working and posted.   Stay tuned!

## Contributions

Contributions and issues are very welcome :)  Make sure to put in an issue with your intent before doing a Pull Request.
