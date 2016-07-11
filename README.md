# spider
This is just an SVG element manager.

## Use

html:
```html
<svg version="1.1"
     baseProfile="full"
     width="100%" height="100%" 
     id="timeline" 
     xmlns="http://www.w3.org/2000/svg">
</svg>
<script src="spider.js"></script>
```
js:
```js
var timeline = document.getElementById('timeline');
var spider = new Spider(timeline);

spider.def('myPath2','path',true).attr({d:'M 0 388 L 200 200 T 400 400' , fill:'red'});
```