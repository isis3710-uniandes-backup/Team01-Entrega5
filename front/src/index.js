import React from 'react';
import ReactDOM from 'react-dom';
import FutureGuide from './components/futureguide';
import * as serviceWorker from './serviceWorker';
import { IntlProvider } from 'react-intl';
import localeEsMessages from './locales/es.json';
import localeEnMessages from './locales/en.json';

let language = navigator.language || navigator.userLanguage;
let message = language === 'en' ? localeEnMessages : localeEsMessages;

ReactDOM.render(
	<IntlProvider locale={language} messages={message}>
		<FutureGuide />
	</IntlProvider>,
	document.getElementById('root')
);

serviceWorker.register();
