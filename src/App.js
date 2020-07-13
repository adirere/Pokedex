import React from "react";
import "./styles.css";
import { Switch, Route } from "react-router-dom";
import Pokedex from "./components/Pokedex";
import Pokemon from "./components/Pokemon";

export default function App() {
  return (
    <Switch>
      <Route exact path="/" component={Pokedex} />
      <Route path="/:pokemonId" component={Pokemon} />
    </Switch>
  );
}
