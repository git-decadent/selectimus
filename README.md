
<h1>Selectimus</h1>

<h3>Description</h3>
<p>
Selectimus jQuery plugin allows to replace standart selects in each browser by identical ones. Support of browsers: Chrome: Firefox, Opera, Safari, IE7+. 
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
      <!DOCTYPE>
      <html>
      <head>
       <title>Page Title</title>
       ...
       <link href="../selectimus.css" rel="stylesheets" type="text/css">
       ...
       <script> src="../jquery.js"</script>
       <script> src="../jquery.selectimus.min.js"</script>
       ...
      </head>
      <body>
       ...
       <!--Init selectimus method of jQuery -->
       <script>
        $(document).ready(function () {
         $('#select').selectimus();
        })
       </script>
       ...
      </body>
      </html>   
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
      background: 'white',
      display: 'block',
      'border-width': '1',
      'border-style': 'solid',
      'border-color': '#e5e5e5',
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