# SteelScene

*Animation devtools for production code*

[![npm version](https://badge.fury.io/js/steel-scene.svg)](https://badge.fury.io/js/steel-scene)
[![Build Status](https://travis-ci.org/steel-scene/steel-scene.svg?branch=master)](https://travis-ci.org/steel-scene/steel-scene)
[![Downloads](https://img.shields.io/npm/dm/steel-scene.svg)](https://www.npmjs.com/package/steel-scene)

## Features

- Animate existing sites from localhost using the devtools
- Build animations without thinking about specific frameworks

## Why use SteelScene?

- Human readable code in HTML, JSON, and Fluent API
- Zero config

> Power this project up with 🌟s,  [^ star it please](https://github.com/steel-scene/steel-scene/stargazers).


## Getting Started
SteelScene has three important objects/concepts:  
- ```targets``` to animate
- ```states``` to transition targets between
- ```scenes``` to control groups of targets

### Building Scenes
There are three different ways to build out animations with SteelScene. [Demo Project on CodePen](https://codepen.io/notoriousb1t/project/editor/AqdnJX/)

#### HTML
SteelScene automatically will try to load scenes in the body when the document is ready.

```html
 <s-scene name="boxes" duration="800" easing="Power1.easeOut">
    <s-target select="#box1">
        <s-state name="middle" x="0" easing="Power2.easeOut" />
        <s-state name="right" x="100px" />
    </s-target>
</s-scene>
```

#### JSON
You can load JSON, HTML, or provide a document selector to load after the document is loaded.

```js
steel.load([
   {
      name: 'boxes',
      duration: 800,
      easing: 'Power1.easeOut',
      targets: [
         {
            select: '#box1',
            states: {
               middle: { x: 0,  easing: 'Power2.easeOut' },
               right: { x: '100px' }
            }
         }
      ]
   }
])

```

#### Fluent API
SteelScene also has a fluent API that is pretty simple.

```js
const box1 = steel
	.target('#box1')
	.on('middle', { x: 0, easing: 'Power2.easeOut' })
	.on('right', { x: '100px' })

const boxesScene = steel
	.scene('boxes', { duration: 800, easing: 'Power1.easeOut' })
	.add(box1)
```

### Changing states

**Transition a scene**
```js
const boxScene = steel.scene('boxes')
boxScene.transition('right')
```

**Sequence states in a scene**
```js
const boxScene = steel.scene('boxes')
boxScene.transition(['right', 'middle'])
```

**Transition a specific target**
```js
const box1 = steel.target('#box1')
box1.transition('right')
```

**Sequence states in a target**
```js
const box1 = steel.target('#box1')
box1.transition(['right', 'middle'])
```

**Set the state of a scene immediately**
```js
const boxesScene = steel.scene('boxes')
boxesScene.set('right')
```

**Set the state of a target immediately**
```js
const box1 = steel.target('#box1')
box1.set('right')
```

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

## Plugins
Instead of reinventing web animation, SteelScene works seamlessly with your existing animation library.  We currently have plugins for the following animation libraries:

 - [GSAP (GreenSock)](https://github.com/steel-scene/steel-scene-plugin-gsap)

> Your library isn't here?  Put in an issue, so we can start writing a plugin

## Other notes

 - Transitions must have a duration. (at this point)
 - Properties cascade.  State properties override target properties. Target properties override scene properties.
 - SteelScene is not an animation engine, it will not work without also loading a plugin to an animation library.


## What's next?

Get a simple prototype UI working and posted.   Stay tuned!

## Contributions

Contributions and issues are very welcome :)  Make sure to put in an issue with your intent before doing a Pull Request.
