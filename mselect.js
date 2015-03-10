/* 
 * author: Arthur Zielinski 
 * version: 1.02 
 */

'use strict';
var Mselect = (function () {
	
	function Mselect(id, array) {

		var el  	 = document.getElementById(id);	 
		var source   = el.querySelector('.source');
		var dest 	 = el.querySelector('.dest');
		var selector = function(value) { return "[data-value='"+value+"']" };
		var data 	 = [];
		var _self 	 = this;
		var _onChange;	


		var select = function(e, triggerEvent) {	 
			var selected = e.cloneNode(true);
				
			dest.appendChild(selected);			  				
			data.push(e.getAttribute('data-value'));
			e.style.display = 'none';	  						

			if( triggerEvent !== false ) {
				triggerOnChange();
			}
		};


		var unselect = function(e) {	  	
			var value = e.getAttribute('data-value');
			var i = data.indexOf(value);		
			var s = selector(value);
			data.splice(i, 1);

			dest.querySelector(s).remove();	  				
			source.querySelector(s).style.display = 'list-item';	
			
			triggerOnChange();
		};


		var build = function(data) {					
			var html = '';

			for( var i=0; i<data.length; i++ ) {
				html += createElement(data[i].name, data[i].value);
			}						 
			
			source.innerHTML = html;
			source.addEventListener('click', function(e) {
				if( e.target != source ) {							
					select(e.target); 
				}
			});

			dest.addEventListener('click', function(e) {
				if( e.target != dest ) {							
					unselect(e.target); 
				}
			});
		};


		var createElement = function(name, value, attr) {
			if( name === undefined ) {
				name = value;
			}

			if( attr === undefined ) {
				attr = '';
			}

			return '<li '+attr+' data-value="'+value+'">'+name+'</li>';
		};


		_self.selectItems = function(data) {		
			var changestate = false;

			for(var i = 0; i < data.length; i++) {
				var s = selector(data[i]);
				var e = source.querySelector(s);
				if( e !== null ) {
					select(e, false);
					changestate = true;
				}
			}

			if( changestate ) {
				triggerOnChange();
			}
		};


		_self.selectAllItems = function() {

			_self.reset();
			dest.innerHTML = source.innerHTML;

			var html = '';
			[].map.call(dest.childNodes, function(item) {
				var value = item.getAttribute('data-value');
				data.push(value);
				html  += createElement(item.innerText, value, 'style="display: none;"');
			});

			source.innerHTML = html;
			triggerOnChange();
		};


		_self.reset = function() {
			// faster
			[].map.call(source.querySelectorAll("[style='display: none;']"),function(item) {
				item.style.display = 'list-item'; 
			});
			data = [];
			dest.innerHTML = '';
			triggerOnChange();
		}

		// events
		_self.onChange = function(callback) {			
			_onChange = callback;						
		};

		var triggerOnChange = function() {
			if( _onChange && typeof _onChange == "function" ) {
				_onChange(data);  				
			}
		}

		// getter
		_self.getData = function() {
			return data;
		}


		build(array);
	}

	return Mselect;
})();

	
