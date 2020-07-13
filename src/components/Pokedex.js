import React, { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  TextField,
  makeStyles
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { useHistory } from "react-router-dom";
import { toFirstCharacterUppercase } from "../utilities/constants";
import axios from "axios";

const useStyles = makeStyles(theme => ({
  pokedexContainer: {
    paddingTop: "20px",
    paddingLeft: "50px",
    paddingRight: "50px"
  },
  cardMedia: {
    margin: "auto"
  },
  cardContent: {
    textAlign: "center"
  },
  searchContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "fade(theme.palette.common.white, 0.15)",
    paddingLeft: "20px",
    paddingRight: "20px",
    margin: "5px auto"
  },
  searchIcon: {
    alignSelf: "flex-end",
    marginBottom: "10px"
  },
  searchInput: {
    width: "300px",
    margin: "5px"
  }
}));

const Pokedex = () => {
  const classes = useStyles();
  let history = useHistory();
  const [pokemonData, setPokemonData] = useState({});
  const [filter, setFilter] = useState("");

  useEffect(() => {
    axios
      .get(`https://pokeapi.co/api/v2/pokemon?limit=807`)
      .then(function(response) {
        const { data } = response;
        const { results } = data;
        const newPokemonData = {};
        results.forEach((pokemon, index) => {
          newPokemonData[index + 1] = {
            id: index + 1,
            name: pokemon.name
          };
        });
        setPokemonData(newPokemonData);
      });
  }, []);

  const handleSearchChange = e => {
    setFilter(e.target.value);
  };

  const getPokemonCard = pokemonId => {
    const { id, name } = pokemonData[pokemonId];
    const sprite = `https://pokeres.bastionbot.org/images/pokemon/${id}.png`;

    return (
      <Grid item xs={6} sm={2} key={pokemonId}>
        <Card onClick={() => history.push(`/${pokemonId}`)}>
          <CardMedia
            className={classes.cardMedia}
            image={sprite}
            style={{ width: "100px", height: "100px", marginTop: "10px" }}
          />
          <CardContent className={classes.cardContent}>
            <Typography>
              {`${id}. ${toFirstCharacterUppercase(name)}`}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  return (
    <>
      <Typography
        variant="h3"
        style={{ textAlign: "center", margin: "20px auto" }}
      >
        Pokedex
      </Typography>
      <div className={classes.searchContainer}>
        <SearchIcon className={classes.searchIcon} />
        <TextField
          className={classes.searchInput}
          onChange={handleSearchChange}
          placeholder="Pokemon"
          variant="standard"
        />
      </div>

      {pokemonData.length !== 0 ? (
        <Grid container spacing={2} className={classes.pokedexContainer}>
          {Object.keys(pokemonData).map(
            pokemonId =>
              pokemonData[pokemonId].name.includes(filter) &&
              getPokemonCard(pokemonId)
          )}
        </Grid>
      ) : (
        <CircularProgress />
      )}
    </>
  );
};

export default Pokedex;
