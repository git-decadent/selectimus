<h1>Selectimus</h1>
<h2>jQuery plugin for change standard select element.</h2>
<a target="_blank" href="http://188.127.227.198:3000/">Selectimus test page</a>
<h3>Description</h3>
<p>
Selectimus jQuery plugin allows to replace standart selects in each browser by identical ones. 
For change default scrollbar jQuery plugin scrollbarJS is used which has already included for selectimus.js. 
Support of browsers: Chrome, Firefox, Opera, Safari, IE7+. 
Init method:
</p>
<div class="highlight">
 <pre>
    $([elemenet]).selectimus([style] [, options]) 
 </pre>
</div>
<p>To use it you need to add 'jquery.selectimus.min.js' after jQuery library and 'selectimus.css' in your page:
</p>

<div class="highlight">
 <pre>
    &lt;!DOCTYPE&gt;
    &lt;html&gt;
    &lt;head&gt;
       &lt;title>Page Title&lt;/title&gt;
       ...
       &lt;link href="../selectimus.css" rel="stylesheets" type="text/css"&gt;
       ...
       &lt;script> src="../jquery.js"&lt;/script&gt;
       &lt;script> src="../jquery.selectimus.min.js"&lt;/script>&gt;
       ...
    &lt;/head&gt;
    &lt;body&gt;
       ...
       &lt;!--Init selectimus method of jQuery --&gt;
       &lt;script&gt;
         $(document).ready(function () {
             $('#select').selectimus();
         })
       &lt;/script&gt;
       ...
    &lt;/body&gt;
    &lt;/html&gt;  
 </pre>
</div>
<p>
To use default image for select element you need copy 'arrow-up-down.png' into 'image' folder 
which placed in current directory with 'selectimus.css'.
</p>

<h3>Settings</h3>
<p>
styles - Hash which includes styles. Styles apply to container in which substitution select is created. 
If no styles was transferred, default styles would be applied to:
</p>
<div class="highlight">
 <pre>
   color: '#000',
   background: '#FFF',
   color_up: '#FFF',
   background_up: '#7EA0FA',
   display: 'inline-block',
   'border-width': '1px',
   'border-style': 'solid',
   'border-color': '#b6b6b6',
   'border-radius': '5px',
   margin: '3px 0',
   position: 'relative',
   overflow: 'visible'
 </pre>
</div>
<p>
options - Addition options to adjust design of substitution select:
</p>
<div class="highlight">
 <pre>
   width: factor [1 .. 10] - add to width of subselect 5*factor pixels
   height: factor [1 .. 10] - add to height of subselect 5*factor pixels
   rows: number [2 .. 20] - set rows' quantity into subselect
 </pre>
</div>


---------------------------------------
<p>
If you have any offers, comments or if you find a bug – do not hesitate to write me:)<br>
</p>
egor.skorobogatov@gmail.com
