// ==UserScript==
// @name        LDR open in background tab
// @namespace   http://ss-o.net/
// @include     http://reader.livedoor.com/reader/
// @include     http://reader.livedoor.com/public/*
// @include     http://fastladder.com/reader/
// @include     http://fastladder.com/public/*
// @version     1.0.4
// @grant       GM_openInTab
// ==/UserScript==
/*
 * Copyright (c) 2014 os0x
 * Copyright (c) 2014 mono
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
 
(function(window, load){
  if (!load) {
    if (!this.chrome) {
      exportFunction(function(url) {
        setTimeout(function(){
          GM_openInTab(url);
        });
      }, window, {defineAs: 'openInTab'});
    }
    var fn = '(' + arguments.callee.toString() + ')(this, true);';
    var script = document.createElement('script');
    script.appendChild(document.createTextNode(fn));
    document.body.appendChild(script);
    return;
  }
  var native_open = window.native_open = window.open;
  window.open = this.chrome ? function(url,name){
    if (url === void 0) return native_open(url,name);
    var a = document.createElement('a');
    a.href = url;
    if (name) a.target = name;
    var event = document.createEvent('MouseEvents');
    event.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 1, null);
    a.dispatchEvent(event);
    return true;
  } : function(url,name){
    if (url === void 0) return native_open(url,name);
    window.openInTab(url);
    return true;
  };
  document.addEventListener('click',function(evt){
    if (evt.target.href && evt.target.target === '_blank'){
      evt.preventDefault();
      window.open(evt.target.href, '_blank');
    }
  },false);
  var _onload = window.onload;
  window.onload = function(){
    _onload();
    var p = window.Control.pin;
    var v = window.Control.view_original;
    var force_next_item = function(){
      var i = window.get_active_item();
      window.Control.scroll_next_item();
      if(i == window.get_active_item()){
        window.Control.scroll_next_item();
      }
    };
    var pin = function(){
      var res = p.apply(this, arguments);
      force_next_item();
      return res;
    };
    var view_original = function(){
      var res = v.apply(this, arguments);
      force_next_item();
      return res;
    };
    window.Keybind.add("p", pin);
    window.Keybind.add("v", view_original);
  };
})(this.unsafeWindow);