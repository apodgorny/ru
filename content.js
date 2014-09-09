$.noConflict();
var bInlineTranslit = false;

(function ($, undefined) {
	$.fn.getCursorPos = function() {
		var el = $(this).get(0);
		var pos = 0;
		if('selectionStart' in el) {
			pos = el.selectionStart;
		} else if('selection' in document) {
			el.focus();
			var Sel = document.selection.createRange();
			var SelLength = document.selection.createRange().text.length;
			Sel.moveStart('character', -el.value.length);
			pos = Sel.text.length - SelLength;
		}
		return pos;
	}
})(jQuery);

function str_insert(n, s, sDest) {
	n = n > 0 ? n : 0;
	sDest = sDest || '';
	if (n > 0) { return sDest.substring(0, n) + s + sDest.substring(n, sDest.length); }
	else       { return s + sDest; }
};

function str_delete(n, s, nLength) {
	nLength = nLength || 1;
	return s.substr(0, n) + s.substr(n + nLength);
}

function capsLock(e) {
	kc = e.keyCode ? e.keyCode : e.which;
	sk = e.shiftKey ? e.shiftKey : (kc == 16);
	if (((kc >= 65 && kc <= 90) && !sk)||((kc >= 97 && kc <= 122) && sk)) {
		return true;
	}
	return false;
}

jQuery(document).ready(function($) {
	var _oInput     = null,
		_nPos       = 0, // Cursor position
		_aSteps     = [],
		_bUpperCase = false;
		_sSelector  = 'textarea,input[type=text]';
		
	var _getPos = function() {
			if (_aSteps.length > 0) {
				_nPos = $(_oInput).getCursorPos();
				_nPos = _nPos >= _aSteps.length ? _aSteps.length - 1 : _nPos;
				_nPos = _nPos < 0 ? 0 : _nPos;
				return _aSteps[_nPos];
			}
			if (_nPos >= _oInput.value.length - 1) {
				return _oInput.original_value.length - 1;
			}
			return 0;
		},
		
		_translate = function() {
			_oInput.value = '';
			if (_oInput.original_value.length > 0) {
				var o = translate(_oInput.original_value, true);
				_aSteps = o.steps;
				_oInput.value = o.translated;
			}
			_nPos = $(_oInput).getCursorPos();
		},
		
		_insert = function(sChar) {
			_oInput.original_value = str_insert(_getPos(), sChar, _oInput.original_value);
		},
		
		_backspace_delete = function() {
			var nEnPos = typeof _aSteps[_nPos - 1] != 'undefined' ? _aSteps[_nPos - 1] : 0;
				nEnLen = _aSteps[_nPos] - nEnPos;
				
			_oInput.original_value = str_delete(nEnPos, _oInput.original_value, nEnLen);
		}
		
	$(_sSelector).keyup(function(oEvent) {
		oEvent.preventDefault();
		oEvent.stopPropagation();
	});

	$(_sSelector).focus(function(oEvent) {
		if (bInlineTranslit) {
			_oInput = this;
			if (typeof this.original_value == 'undefined') {
				this.original_value = this.value;
				_translate();
			}
		}
	});
	
	$(_sSelector).click(function(oEvent) {
		if (bInlineTranslit) {
			_translate();
		}
	});
	
	$(_sSelector).keydown(function(oEvent) {
		if (bInlineTranslit) {
			switch (oEvent.keyCode) {
				case 37:
				case 38:
				case 39:
				case 40:
				case 91:
				case 93:
					break;
				case 8: // Backspace
					_backspace_delete();
					break;
				default:
					if (oEvent.keyCode >= 32) {
						var sChar = String.fromCharCode(oEvent.keyCode);
						if (!_bUpperCase) {
							sChar = sChar.toLowerCase();
						}
						_insert(sChar);
					}
					break;
			}
			_translate();
		}
		oEvent.preventDefault();
		oEvent.stopPropagation();
		$(this).trigger('keydown', {keyCode: sChar.charCodeAt(0)});
	});
	
	$(_sSelector).keypress(function(oEvent) {
		if (oEvent.keyCode) {
			var sChar = String.fromCharCode(oEvent.keyCode);
			_bUpperCase = false;
			if (sChar === sChar.toUpperCase()) {
				_bUpperCase = true;
			}
		}
		oEvent.preventDefault();
		oEvent.stopPropagation();
	});
	
	chrome.extension.onMessage.addListener(function(oEvent, oSender, fSendResponse) {
		if (oEvent.name == 'TOGGLE_INLINE_TRANSLIT') {
			bInlineTranslit = oEvent.value;
		}
	});
});
