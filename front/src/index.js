import React from "react";
import ReactDOM from "react-dom";
import FutureGuide from './components/futureguide';
import * as serviceWorker from './serviceWorker';


ReactDOM.render(<FutureGuide/>, document.getElementById("root"));

serviceWorker.register();

