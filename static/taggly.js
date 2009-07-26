/**
 * taggly.js
 * by Jim R. Wilson
 */
(function(){
console.clear();
	var undefined, window = this, taggly = window.taggly;
	if (taggly === undefined) taggly = window.taggly = {};
	var re = taggly.classre || /(^|\s)taggable(\s|$)/;
	var stack = [], elems = document.getElementsByTagName('*');
	for (var i=0, l=elems.length, pos=0; i<l; i++) {
		var elem = elems[i];
		if (elem.nodeType===1 && elem.className && re.test(elem.className)) stack[pos++] = elem;
	}
	delete elems;
	if (!stack.length) return;
	var elems = [], len = 0, re = /^https?:\/\//;
	while (stack.length) {
		var elem = stack.shift(), tag = elem.tagName.toLowerCase();
		if (
			(tag === "a" && elem.href && re.test(elem.href)) ||
			(tag === "img" && elem.src && re.test(elem.src))
		) {
			var url = elem.href || elem.src;
			if (url.indexOf(document.location.href + '#')!==0) {
				elems[len++] = elem;
				continue;
			}
		}
		for (var j=0, m=elem.childNodes.length; j<m; j++) {
			var child = elem.childNodes[j];
			if (child.nodeType===1) stack[stack.length] = child;
		}
	}
	if (!len) return;
	var pop = document.createElement('div');
	pop.innerHTML = '<h3><span>taggly tags</span></h3><ul></ul>';
	pop.className = "tagglypop";
	pop.style.display = "none";
	document.body.appendChild(pop);
	function callback (data) {
		var ul = pop.getElementsByTagName('ul')[0];
		ul.innerHTML = '';
		var max = 0;
		for (var k in data) {
			if (!Object.prototype.hasOwnProperty.call(data, k)) continue;
			if (data[k] > max) max = data[k];
		}
		max = 1 / max;
		for (var k in data) {
			if (!Object.prototype.hasOwnProperty.call(data, k)) continue;
			var li = document.createElement('li');
			li.innerHTML = '<span></span>';
			var span = li.getElementsByTagName('span')[0];
			span.appendChild(document.createTextNode(k + " "));
			var size = parseInt(data[k]) || 0;
			span.style.fontSize = Math.round(12 + 8 * size * max) + "px";
			ul.appendChild(li);
		}
		pop.style.display = '';
		console.dir(data);
	}
	function onclick(e) {
		if (!e) var e = window.event;
		if (e.target) targ = e.target;
		else if (e.srcElement) targ = e.srcElement;
		if (targ.nodeType === 3) targ = targ.parentNode;
		while (targ && !targ.taggly) targ = targ.parentNode;
		if (!targ || !targ.taggly) return;
		e.cancelBubble = true;
		if (e.stopPropagation) e.stopPropagation();
		var script = document.createElement('script'), loaded = false;
		script.setAttribute('type', 'text/javascript');
		script.setAttribute('src', 'http://localhost:8080/tags/' + targ.taggly.url);
		script.onload = script.onreadystatechange = function() {
			var rs = this.readyState;
			if (rs && rs!='complete' && rs!='loaded') return;
			if (loaded) return;
			loaded = true;
			script.onload = script.onreadystatechange = null;
			document.body.removeChild(script);
			taggly.callback = null;
		};
		taggly.callback = callback;
		document.body.appendChild(script);
		console.log(targ.taggly.url);
		return false;
	}
	//if (document.body.addEventListener) document.body.addEventListener( 'click', onclick, false );
	//else if (document.body.attachEvent) document.body.attachEvent( 'onclick', onclick );
	document.body.onclick = onclick;
	// http://www.flickr.com/photos/shawnzlea/501267892/
	var css = [
		".tagglytag span { display: none; }",
		".tagglytag a {",
			"padding: 4px 12px;",
			"background: transparent url(http://localhost:8080/static/images/handprint-light.gif) no-repeat 50% 50%;",
		"}",
		".tagglytag a:hover { background-image: url(http://localhost:8080/static/images/handprint.gif); }",
		".tagglypop { width: 250px; position: absolute; }",
		".tagglypop ul { margin: 0; }",
		".tagglypop li { display: inline; }",
	''].join('');
	var style = document.createElement('style');
	style.setAttribute('type', 'text/css');
	var head = document.getElementsByTagName('head')[0];
	if (head.childNodes.length) head.insertBefore(style, head.childNodes[0]);
	else head.appendChild(style);
	if (style.styleSheet !== undefined && style.styleSheet.cssText !== undefined) style.styleSheet.cssText = css;
	style.appendChild(document.createTextNode(css));
	var scratch = document.createElement('div'), re = /^https?:\/\/[^\/]*$/, empty = function(){ return false; };
	for (var i=0; i<len; i++) {
		var elem = elems[i];
		scratch.innerHTML =
			'<span class="tagglytag"> <a href="" title="taggly tags"><span>tags</span></a></span>';
		var span = scratch.getElementsByTagName('span')[0];
		var url = elem.href || elem.src, pos;
		if (-1 !== (pos = url.indexOf('#'))) url = url.substr(0, pos);
		if (re.test(url)) url += '/';
		var a = span.getElementsByTagName('a')[0];
		a.href = 'http://localhost:8080/details/' + url;
		a.onclick = empty;
		span.taggly = { "url": url + '', "elem": elem };
		if (elem.tagName.toLowerCase() === "a") elem.appendChild(span);
		else if (elem.nextSibling) elem.parentNode.insertBefore(span, elem.nextSibling);
		else elem.parentNode.appendChild(span);
		console.log(elem, span);
	}
})();

/*
$$('.tagglytag').forEach( function(item) { item.parentNode.removeChild(item); } );
window.taggly = { classre: /(^|\s)taggedlink(\s|$)/ };
var script = document.createElement('script'), loaded = false;
script.setAttribute('type', 'text/javascript');
script.setAttribute('src', 'http://localhost:8080/static/taggly.js');
script.onload = script.onreadystatechange = function() {
	var rs = this.readyState;
	if (rs && rs!='complete' && rs!='loaded') return;
	if (loaded) return;
	loaded = true;
	script.onload = script.onreadystatechange = null;
	document.body.removeChild(script);
};
document.body.appendChild(script);
*/
