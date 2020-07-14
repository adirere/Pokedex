import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import {
  Typography,
  Link,
  CircularProgress,
  Button,
  Card,
  CardActions,
  makeStyles
} from "@material-ui/core";
import { toFirstCharacterUppercase } from "../utilities/constants";

const useStyles = makeStyles({
  cardStyle: {
    width: "75%",
    margin: "2% auto",
    padding: "2%"
  },
  numberFormat: {
    backgroundColor: "rgba(251,204,10, 0.4)",
    borderRadius: "10px",
    padding: "0 4px"
  },
  typesSpanStyle: {
    padding: "3px 5px",
    margin: "0 2px",
    borderRadius: "10px"
  }
});

const colors = {
  fire: "#FDDFDF",
  grass: "#DEFDE0",
  electric: "#FCF7DE",
  water: "#DEF3FD",
  ground: "#f4e7da",
  rock: "#d5d5d4",
  fairy: "#fceaff",
  poison: "#98d7a5",
  bug: "#f8d5a3",
  dragon: "#97b3e6",
  psychic: "#eaeda1",
  flying: "#F5F5F5",
  fighting: "#E6E0D4",
  normal: "#F5F5F5",
  ghost: "#FAF7E4"
};

const Pokemon = props => {
  const classes = useStyles();
  let { pokemonId } = useParams();
  let history = useHistory();
  const [pokemon, setPokemon] = useState(undefined);

  useEffect(() => {
    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`)
      .then(function(response) {
        const { data } = response;
        setPokemon(data);
      })
      .catch(function(error) {
        setPokemon(false);
      });
  }, [pokemonId]);

  const generatePokemon = () => {
    const { name, id, species, height, weight, types, sprites } = pokemon;
    const fullImageUrl = `https://pokeres.bastionbot.org/images/pokemon/${id}.png`;
    const { front_default } = sprites;

    return (
      <Card className={classes.cardStyle}>
        <Typography variant="h2" style={{ textAlign: "center" }}>
          {toFirstCharacterUppercase(name)}
        </Typography>
        <Typography variant="h5" style={{ textAlign: "center" }}>
          <span className={classes.numberFormat}>
            {`#${id.toString().padStart(3, "0")}`}
          </span>{" "}
        </Typography>
        <Typography variant="h5" style={{ textAlign: "center" }}>
          <img src={front_default} alt={name} />
        </Typography>

        <img
          style={{ width: "300px", height: "300px" }}
          src={fullImageUrl}
          alt={name}
        />
        <Typography variant="h3">Pokemon Info</Typography>
        <Typography>
          {"Species: "}
          <Link href={species.url}>{species.name} </Link>
        </Typography>
        <Typography>Height: {height} </Typography>
        <Typography>Weight: {weight} </Typography>
        <Typography variant="h6" display="inline">
          Types:
        </Typography>
        {types.map(typeInfo => {
          const { type } = typeInfo;
          const { name } = type;
          return (
            <Typography variant="subtitle1" key={name} display="inline">
              <span
                className={classes.typesSpanStyle}
                style={{ background: `${colors[name]}` }}
              >
                {`${name}`}
              </span>
            </Typography>
          );
        })}
        <CardActions>
          <Button
            size="small"
            color="secondary"
            variant="contained"
            onClick={() => history.push("/")}
          >
            {"<< pokedex"}
          </Button>
        </CardActions>
      </Card>
    );
  };

  return (
    <>
      {pokemon === undefined && <CircularProgress />}
      {pokemon !== undefined && pokemon && generatePokemon(pokemon)}
      {pokemon === false && (
        <>
          <Typography> Pokemon not found</Typography>
          <Button
            size="small"
            color="secondary"
            variant="contained"
            onClick={() => history.push("/")}
          >
            {"<< pokedex"}
          </Button>
        </>
      )}
    </>
  );
};

export default Pokemon;
