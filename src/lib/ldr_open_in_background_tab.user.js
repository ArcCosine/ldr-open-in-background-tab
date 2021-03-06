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

(function() {
  var port = chrome.extension.connect();
  var element = document.createElement('div');
  element.id = 'ldr-open-in-background-tab';
  element.style.display = 'none';
  element.addEventListener('postMessage', function() {
    port.postMessage(JSON.parse(element.innerText));
  }, false);
  document.body.appendChild(element);
})();

(function(window, load){
  if (!load) {
    var fn = '(' + arguments.callee.toString() + ')(this, true);';
    var script = document.createElement('script');
    script.appendChild(document.createTextNode(fn));
    document.body.appendChild(script);
    return;
  }
  var native_open = window.native_open = window.open;
  window.open = function(url,name){
    if (url === void 0) return native_open(url,name);
    var element = document.getElementById('ldr-open-in-background-tab');
    var event = document.createEvent('Event');
    event.initEvent('postMessage', true, true);
    element.innerText = Object.toJSON({
      message: 'openInTab',
      url: url
    });
    element.dispatchEvent(event);
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

    var get_rate = function () {
        return parseInt(document.getElementById('rate_img').src.replace(/^.*(\d)\.gif$/, '$1'), 10);
    };

    var stop_reading = function(){
        if( window.State.now_reading ){
            var api = new API("/api/feed/unsubscribe");
            callback = Function.empty;
            var sid = State.now_reading;
            api.post({ subscribe_id:sid },function(res){
                message("購読停止しました");
                callback(res);
            });
            window.Control.read_next_subs();
        }

    };

    var rate_down = function(){
        window.vi[get_rate()-1]();
    };

    var rate_up = function(){
        window.vi[get_rate()+1]();
    };

    window.Keybind.add("p", pin);
    window.Keybind.add("v", view_original);
    window.Keybind.add("l", stop_reading );
    window.Keybind.add("q", rate_down );
    window.Keybind.add("w", rate_up );
  };
})();
