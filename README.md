<h1>Selectimus (Beta).</h1>
Script is in the process of testing. There are some problems in Safari and IE.

Change of standart selects in browser.

For work you need to use ScrollBarJS library (has just been added to plugin).

1. jQuery plugin


Init - $(element).selectimus([styles] [, settings]);


styles - Hash which includes styles. Styles apply to container in which substitution select is created. If no styles was transferred, default styles would be applied to.

background: 'white',
display: 'block',
'border-width': 1',
'border-style': 'solid',
'border-color': '#e5e5e5',
'border-radius': '5px',
margin: '3px 0',
position: 'relative',
overflow: 'visible'

settings - Addition options to adjust design of substitution select:

width: factor [1 .. 10] - add to width of subselect 5*factor pixels
height: factor [1 .. 10] - add to height of subselect 5*factor pixels
rows: number [2 .. 20] - set rows' quantity into subselect




If you have any offers, comments or if you find a bug – do not hesitate to write me:)

---------------------------------------


Egor Skorobogatov
egor.skorobogatov@gmail.com