# Selectimus
## jQuery plugin to change a standard select element

## Usage


Selectimus jQuery plugin allows to replace a standart select a browser to identical one. 
To change default scrollbar scrollbarJS jQuery plugin is used which is included in selectimus.js. 
Supported browsers: Chrome, Firefox, Opera, Safari, IE7+. 

**Init method:**
```js
$([elemenet]).selectimus([styles] [, options]) 
```

Add **jquery.selectimus.min.js** after jQuery source and **selectimus.css** to your page.
```html
<!DOCTYPE>
<html>
  <head>
    <title>Page Title</title>
      ...
      <link href="../selectimus.css" rel="stylesheets" type="text/css"/>
      ...
      <script src="../jquery.js"></script>
      <script src="../jquery.selectimus.min.js"></script>
       ...
  </head>
  <body>
    ...
    <!-- Initialize selectimus -->
    <script>
      $(document).ready(function () {
        $('#select').selectimus();
      });
    </script>
    ...
  </body>
</html>
```

To use default a image for select element you need copy 'arrow-up-down.png' into 'image' folder which is placed in the same  directory as 'selectimus.css'.

## Settings

**styles** - Styles are applied to a container which is wrapping a created custom select. 
If no styles provided, default styles would be used.

```js
{
   color: '#000',
   background: '#FFF',
   color_up: '#FFF',
   background_up: '#7EA0FA',
   display: 'inline-block',
   'border-width': '1px',
   'border-style': 'solid',
   'border-color': '#B6B6B6',
   'border-radius': '5px',
   margin: '3px 0',
   position: 'relative',
   overflow: 'visible'
}
```

**options** - Addition options to adjust design of substitution select:
```js
{
   width: [WIDTH], // [1 .. 10] - add to the width of a custom select 5*WIDTH pixels
   height: [HEIGHT], // [1 .. 10] - add to the height of a custom select 5*HEIGHT pixels
   rows: [NUMBER_OF_ROWS], // [2 .. 20] - set quantity of rows of expaned custom select element
}
```

