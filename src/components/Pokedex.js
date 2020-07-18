import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Grow,
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
  cardStyle: {
    paddingTop: "10px",
    cursor: "pointer",
    "&:hover": {
      boxShadow: "0 3px 15px rgba(100, 100, 100, 0.5)"
    }
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
    paddingLeft: "20px",
    paddingRight: "20px",
    margin: "20px auto"
  },
  searchIcon: {
    alignSelf: "flex-end",
    marginBottom: "10px"
  },
  searchInput: {
    width: "300px",
    margin: "5px"
  },
  imageContainer: {
    position: "absolute",
    left: "50%",
    transform: "translate(-50%,0)",
    backgroundColor: "rgba(36,122,197,0.05)",
    borderRadius: "50%",
    width: "120px",
    height: "120px",
    textAlign: "center",
    boxShadow: "0 3px 3px rgba(100, 100, 100, 0.5)"
  },
  numberFormat: {
    backgroundColor: "rgba(251,204,10, 0.4)",
    padding: "5px",
    borderRadius: "10px"
  }
}));

const Pokedex = () => {
  const classes = useStyles();
  let history = useHistory();
  const [pokemonData, setPokemonData] = useState(
    JSON.parse(window.localStorage.getItem("pokemonData")) || {}
  );
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (Object.keys(pokemonData).length === 0) {
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
          window.localStorage.setItem(
            "pokemonData",
            JSON.stringify(newPokemonData)
          );
          setPokemonData(newPokemonData);
        });
    }
  }, []);

  const handleSearchChange = e => {
    setFilter(e.target.value);
  };

  const getPokemonCard = pokemonId => {
    const { id, name } = pokemonData[pokemonId];
    const sprite = `https://pokeres.bastionbot.org/images/pokemon/${id}.png`;

    return (
      <Grid item xs={6} sm={4} md={2} key={pokemonId}>
        <Grow
          in={true}
          style={{ transformOrigin: "0 0 0" }}
          {...(true ? { timeout: 1000 } : {})}
        >
          <Card
            className={classes.cardStyle}
            onClick={() => history.push(`/${pokemonId}`)}
          >
            <div style={{ position: "relative" }}>
              <div className={classes.imageContainer} />
            </div>
            <CardMedia
              className={classes.cardMedia}
              image={sprite}
              style={{ width: "100px", height: "100px", marginTop: "10px" }}
            />
            <CardContent className={classes.cardContent}>
              <Typography style={{ marginTop: "10px" }}>
                <span
                  className={classes.numberFormat}
                >{`#${id.toString().padStart(3, "0")}`}</span>
              </Typography>
              <Typography
                variant="h6"
                style={{ marginTop: "10px" }}
              >{`${toFirstCharacterUppercase(name)}`}</Typography>
            </CardContent>
          </Card>
        </Grow>
      </Grid>
    );
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h3"
            style={{ textAlign: "center", margin: "20px auto" }}
          >
            Pokedex
          </Typography>
        </Toolbar>
      </AppBar>
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
