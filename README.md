# AngularJS Popper2x Components

AngularJS Flexible Directives for positioning and controlling pop-up like elements


## Installation
```
npm install --save angularjs-popper2x-components
```

## Configuration
The directive requires [popper.js 2](https://popper.js.org/) and [jQuery 3](https://jquery.com/) to run.
1) Install dependencies (or skip and use CDN)
2) Add dependencies to your page
```html
<script src="https://code.jquery.com/jquery-3.5.1.min.js" ></script>
<script src="https://unpkg.com/@popperjs/core@2/dist/umd/popper.js" ></script>
```
3) Import the minified script from ```dist/popper2x-components.min.js``` to your page
```html
<script src="node_modules/angularjs-popper2x-components/dist/popper2x-components.min.js"></script>
```
4) Add the module ```popupExt``` as dependency of your main application module 
```js
angular.module('myapp', ['popupExt'])
```

## Usage
- Basic usage example
    - Tooltip
    ```html
      <button id="button" aria-describedby="tooltip" tooltip="#tooltip">I'm a button</button>
      <div id="tooltip" class="p_tooltip" role="tooltip">
          I'm a tooltip
          <div class="arrow" data-popper-arrow></div>
      </div>
    ```
    - Dropdown
    ```html
      <button type="button" dropdown="#dropdown">I'm a button</button>
      <div id="dropdown">I'm a dropdown</div>
    ```
> Check the demos located in the demo folder from the root to see some full examples on how to use the components
  
## Tooltip
Use the tooltip directive by adding the property `tooltip` to your HTML element.
The value of that property will be the selector to the custom tooltip panel
that you'd like to show. 
```html
    <!-- directive will search for the element with id="tooltip" -->
    <button type="button" tooltip="#tooltip">I'm a button</button>
    <div id="tooltip">
      I'm a tooltip
    </div>
```
You can also leave it blank and attach a text or html straight to the directive, by using the config property. 
```html
    <!-- passing custom configuration with value to be renderer as the content of the tooltip -->
    <button type="button" tooltip config="{contentHTML:'I'm a <em>tooltip</em>'}">I'm a button</button>
```
A third property can be added, so you can inform another selector that will be the target of the tooltip, instead of the button itself.
```html
    <!-- will position element with id="tooltip" according to the boundaries of element with id="target" -->
    <div id="target">
        <button type="button" tooltip="#tooltip" target="#target"></button>
    </div>
    <div id="tooltip">
      I'm a tooltip
    </div>
```
You can check out all [popper custom modifiers](https://popper.js.org/docs/v2/modifiers/) and alter the popup configurations and behaviour
```js
    /* you can find the full example in demo folder */
    angular.module('demo',['popupExt'])
        .controller('ctrl',function($scope) {
            

            $scope.options = {
                modifiers: [
                    {
                        name: 'offset',
                        options: {
                            offset: [0, 8],
                        },
                    },
                ],
                placement: 'right',
                contentHTML: 'I\'m a <em>tooltip</em>'
            }

            
        })
```
```html
    <!-- retrieving options from the controller  -->
    <button type="button" tooltip config="options">I'm a button</button>
```

## Dropdown
Use the dropdown directive by adding the property `tooltip` to your HTML element.
The value of that property will be the selector to the custom dropdown panel
that you'd like to show. 
```html
    <!-- directive will search for the element with id="dropdown" -->
    <button type="button" dropdown="#dropdown">I'm a button</button>
    <div id="dropdown">I'm a dropdown</div>
```
The dropdown container can have elements of any types. 
Clicking on any of those elements within the pop-up can trigger or not the action 
to close the dropdown. If you want the dropdown to close when clicking the element, set the property `data-destroy` to true on it.
```html
    <div class="dropdown">
        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" dropdown=".dropdown-menu" aria-haspopup="true" aria-expanded="false">
            Dropdown button
        </button>
        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <a class="dropdown-item" href="#" data-destroy="true">Action</a>
            <a class="dropdown-item" href="#" data-destroy="true">Another action</a>
            <a class="dropdown-item" href="#">Hey, keep it open!</a>
        </div>
    </div>
```
Just like the tooltip directive, you can inform another selector that will be the target of the dropdown, instead of the button itself.
```html
    <!-- will position element with id="tooltip" according to the boundaries of element with id="target" -->
    <div id="target">
        <button type="button" tooltip="#dropdown" target="#target"></button>
    </div>
    <div id="dropdown">
      I'm a dropdown
    </div>
```
Additionally, you can use the property config to override popper configurations as well as the directive standards.
You can check out all [popper custom modifiers](https://popper.js.org/docs/v2/modifiers/) and alter the popup configurations and behaviour.
```js
    /* you can find the full example in demo folder */
    angular.module('demo',['popupExt'])
        .controller('ctrl',function($scope) {
            

            $scope.options = {
                modifiers: [
                    {
                        name: 'offset',
                        options: {
                            offset: [0, 8],
                        },
                    },
                ],
                placement: 'top',
                controlTabOrder: false
            }

            
        })
```
```html
    <!-- retrieving options from the controller  -->
    <div class="dropdown">
        <button class="btn btn-secondary dropdown-toggle" type="button" dropdown=".dropdown-menu" config="options">
            Dropdown button
        </button>
        <div class="dropdown-menu">
            <a class="dropdown-item" href="#" data-destroy="true">Action</a>
            <a class="dropdown-item" href="#" data-destroy="true">Another action</a>
            <a class="dropdown-item" href="#">Hey, keep it open!</a>
        </div>
    </div>
```
> Flexibility is a double-edged sword. Depending on the order you place your dropdown button and container triggered by it, the tab order can become a bit tricky, 
> hence the directive takes control of the tabindex by default. You can override it if you'd like to define your own tabindex or if you tie the elements in a progressive order,
> to do so set the property `controlTabOrder` in the config to false.

## Build

If you are cloning the repository you must have gulp globally installed and run the following commands 
in order to have the dist folder generated:

```
npm install
npm run build
```

## Testing

Tests are coded using [Karma](http://karma-runner.github.io) + [Jasmine](http://jasmine.github.io/). The easiest way to run these checks is the following

```
npm install
npm test
```
