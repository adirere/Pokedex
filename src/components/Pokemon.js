import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import {
  Typography,
  CircularProgress,
  Button,
  Card,
  CardActions,
  Grid,
  Paper,
  makeStyles
} from "@material-ui/core";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { toFirstCharacterUppercase } from "../utilities/constants";
import { ReactComponent as Pokeball } from "../svg/pokeball.svg";
import Pokestats from "./pokestats/Pokestats";

const useStyles = makeStyles({
  cardStyle: {
    width: "75%",
    margin: "2% auto",
    padding: "1%"
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
  },
  imageContainer: {
    backgroundColor: "rgba(36,122,197,0.05)",
    borderRadius: "50%",
    border: "1px solid #ddd",
    marginLeft: "5px"
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
  flying: "#50BFDB",
  fighting: "#E6E0D4",
  normal: "#F5F5F5",
  ghost: "#FAF7E4",
  steel: "#B8B8D0",
  dark: "#705848",
  ice: "#98D8D8"
};

const Pokemon = props => {
  const classes = useStyles();
  let { pokemonId } = useParams();
  let history = useHistory();
  const [pokemon, setPokemon] = useState(undefined);
  const [characteristics, setCharacteristics] = useState("");

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

    axios
      .get(`https://pokeapi.co/api/v2/characteristic/${pokemonId}/`)
      .then(function(response) {
        const {
          data: { descriptions }
        } = response;
        setCharacteristics(descriptions.filter(d => d.language.name === "en"));
      })
      .catch(function(error) {
        setCharacteristics("");
      });
  }, [pokemonId, characteristics]);

  const generatePokemon = () => {
    const { name, id, height, weight, types, stats, sprites } = pokemon;
    const fullImageUrl = `https://pokeres.bastionbot.org/images/pokemon/${id}.png`;
    const { front_default, back_default } = sprites;
    let maxStat = 0;

    const displayStats = stats => {
      const pokemonStats = {};

      stats.forEach(s => {
        pokemonStats[s.stat.name] = s["base_stat"];
        if (maxStat < s["base_stat"]) maxStat = s["base_stat"];
      });

      return pokemonStats;
    };

    return (
      <Card className={classes.cardStyle} elevation={4}>
        <CardActions>
          <Button
            size="small"
            color="secondary"
            variant="contained"
            onClick={() => history.push("/")}
          >
            <ArrowBackIosIcon />
            {" pokedex"}
          </Button>
        </CardActions>

        <Typography variant="h2" style={{ textAlign: "center" }}>
          <Pokeball style={{ width: "45px", marginRight: "5px" }} />
          {toFirstCharacterUppercase(name)}
        </Typography>

        <Typography variant="h5" style={{ textAlign: "center" }}>
          <span className={classes.numberFormat}>
            {`#${id.toString().padStart(3, "0")}`}
          </span>
          <div>
            <img
              src={front_default}
              alt={name + " front"}
              className="img-front"
              style={{ position: "relative" }}
            />
            <img
              src={back_default}
              alt={name + " back"}
              className="img-back"
              style={{
                position: "absolute",
                left: "50%",
                transform: "translate(-50%,0)"
              }}
            />
          </div>
        </Typography>

        <Grid container justify="space-around" style={{ marginTop: "2%" }}>
          <Grid item xs={12} sm={6}>
            <Paper
              elevation={0}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <img
                style={{ width: "50%", height: "50%", margin: "auto" }}
                src={fullImageUrl}
                alt={name}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper elevation={0}>
              <Typography>
                {"Characteristics: "}
                {characteristics !== ""
                  ? characteristics[0].description.toLowerCase()
                  : "n/a"}
              </Typography>
              <Typography>
                Height:{" "}
                <span style={{ fontFamily: "Black Ops One" }}>
                  {height / 10}
                </span>{" "}
                m
              </Typography>
              <Typography>
                Weight:{" "}
                <span style={{ fontFamily: "Black Ops One" }}>
                  {weight / 10}
                </span>{" "}
                kg
              </Typography>
              <Typography display="inline">Types:</Typography>
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
              <div>
                {Object.keys(displayStats(stats)).map((keyName, i) => (
                  <li key={i} style={{ listStyle: "none" }}>
                    <Typography>
                      {keyName}
                      <Pokestats
                        stats={displayStats(stats)[keyName]}
                        maxStat={maxStat}
                      />
                    </Typography>
                  </li>
                ))}
              </div>
            </Paper>
          </Grid>
        </Grid>
      </Card>
    );
  };

  return (
    <>
      {pokemon === undefined && (
        <CircularProgress style={{ margin: "20px 20px" }} />
      )}
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
