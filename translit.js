oTranslit = {
	'a'  : 'а',
	'b'  : 'б',
	'v'  : 'в',
	'g'  : 'г',
	'd'  : 'д',
	'e'  : 'е',
	'jo' : 'ё',
	'zh' : 'ж', 
	'z'  : 'з',
	'i'  : 'и',
	'j'  : 'й',
	'k'  : 'к',
	'l'  : 'л',
	'm'  : 'м',
	'n'  : 'н',
	'o'  : 'о',
	'p'  : 'п',
	'r'  : 'р',
	's'  : 'с',
	't'  : 'т',
	'u'  : 'у',
	'f'  : 'ф',
	'h'  : 'х',
	'c'  : 'ц',
	'ch' : 'ч', 
	'sh' : 'ш',
	'w'  : 'ш',
	'w\'': 'щ',
	'shh': 'щ',
	'#'  : 'ъ',
	'y'  : 'ы',
	'\'' : 'ь', 
	'je' : 'э', 
	'ju' : 'ю',  
	'ja' : 'я', 
	'A'  : 'А',
	'B'  : 'Б',
	'V'  : 'В',
	'G'  : 'Г',
	'D'  : 'Д',
	'E'  : 'Е',
	'Jo' : 'Ё',
	'JO' : 'Ё',
	'Zh' : 'Ж',
	'Z'  : 'З',
	'I'  : 'И',
	'J'  : 'Й',
	'K'  : 'К',
	'L'  : 'Л',
	'M'  : 'М',
	'N'  : 'Н',
	'O'  : 'О',
	'P'  : 'П',
	'R'  : 'Р',
	'S'  : 'С',
	'T'  : 'Т',
	'U'  : 'У',
	'F'  : 'Ф',
	'H'  : 'Х',
	'C'  : 'Ц',
	'W'  : 'Ш',
	'Ch' : 'Ч', 
	'Sh' : 'Ш',
	'SH' : 'Ш',
	'Shh': 'Щ',
	'SHH': 'Щ',
	'W\'': 'Щ',
	'##' : 'Ъ',  
	'Y'  : 'Ы',
	'\'\'':'Ь', 
	'Je' : 'Э',
	'JE' : 'Э',  
	'Ju' : 'Ю',
	'JU' : 'Ю',  
	'Ja' : 'Я',
	'JA' : 'Я'
}

function translate(sInput, bReturnObject) {
	// console.log('TRANSLATE', sInput);
	aSteps = [];
	var sResult = '',
		s,
		bFound = false;
		
	aSteps.push(0);
	for (var n=0; n<sInput.length; n++) {
		bFound = false;
		for (var nStep=3; nStep>=1; nStep--) {
			s = sInput.substr(n, nStep);
			if (s.length != nStep) { continue; }
			if (typeof oTranslit[s] != 'undefined') {
				sResult += oTranslit[s];
				n += nStep - 1;
				
				aSteps.push(n + 1);
				
				bFound = true;
				break;
			} 
		}
		if (!bFound) {
			sResult += s;
			aSteps.push(n + 1);
		}
	}
	if (bReturnObject) {
		return {
			translated : sResult,
			steps      : aSteps
		};
	}
	return sResult;
}