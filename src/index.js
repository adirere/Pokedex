import React from "react";
import App from "./App";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

const history = createBrowserHistory();

const theme = createMuiTheme({
  typography: {
    fontFamily: ["Fredoka One"]
  }
});

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <Router history={history}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Router>
  </React.StrictMode>,
  rootElement
);
