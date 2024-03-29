import React, { Component } from "react";
import axios from "axios";
import { POKEMON_API_URL } from "../config";
import {
  CircularProgress,
  Box,
  withStyles,
  Typography,
  Grid,
  Button,
} from "@material-ui/core";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { connect } from "react-redux";
import { toggleFavourite } from "../redux/actions";

const styles = (theme) => ({
  completeBox: {
    backgroundColor: "rgb(68,68,68)",
    paddingTop: "10px",
    paddingBottom: "0",
  },
  pokedexContainer: {
    height: "84.5vh",
    backgroundColor: "black",
    color: "white",
    marginTop: 75,
    textAlign: "center",
    borderRadius: 5,
    paddingTop: 30,
  },
  textTitle: {
    // textTransform: "upperCase",
    fontFamily: "open sans regular",
  },
  pokemonImage: {
    width: "170px",
    height: "170px",
  },
  pokemonInfoContainer: {
    bottom: 60,
    position: "absolute",
    width: "100%",
  },
  seperator: {
    height: "0.01mm",
    width: "95%",
  },
  favourite: {
    height: 50,
    width: 50,
    marginTop: 15,
  },
  text: {
    // textTransform: "upperCase",
    fontSize: 30,
    fontFamily: "open sans regular",
  },
});

class PokemonDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pokemon: null,
    };
  }

  componentDidMount() {
    const { match } = this.props;
    const { id } = match?.params;
    axios.get(POKEMON_API_URL + "/" + id).then((response) => {
      if (response.status >= 200 && response.status < 300) {
        this.setState({ pokemon: response.data });
      }
    });
  }

  favouriteChecker(pokemon) {
    let found = false;
    // eslint-disable-next-line array-callback-return
    this.props.favourites?.map((p) => {
      if (p.id === pokemon.id) {
        found = true;
      }
    });
    return found;
  }
  render() {
    const { classes } = this.props;
    const { pokemon } = this.state;
    if (pokemon) {
      const { name, sprites, height, weight, types, moves } = pokemon;
      const main_type = types[0].type.name;
      const main_move = moves[0].move.name;
      return (
        <Box className={classes.completeBox}>
          <Box className={classes.pokedexContainer}>
            <Typography className={classes.textTitle} variant="h1">
              {name}
            </Typography>
            <img
              className={classes.pokemonImage}
              src={sprites.front_default}
              alt="loading..."
            />
            <img
              className={classes.pokemonImage}
              src={sprites.back_default}
              alt="loading..."
            />
            <Box className={classes.pokemonInfoContainer}>
              <hr className={classes.seperator} />
              <Grid container>
                <Grid item md={1}>
                  <Button
                    className={classes.favourite}
                    onClick={() => this.props.toggleFavourite(pokemon)}
                  >
                    <FavoriteIcon
                      style={{
                        color: this.favouriteChecker(pokemon) ? "red" : "white",
                        fontSize: 70,
                      }}
                    />
                  </Button>
                </Grid>
                <Grid item md={2}>
                  <Typography className={classes.text}>
                    Name:
                    <br />
                    {name}
                  </Typography>
                </Grid>
                <Grid item md={2}>
                  <Typography className={classes.text}>
                    Height:
                    <br />
                    {height}m
                  </Typography>
                </Grid>
                <Grid item md={2}>
                  <Typography className={classes.text}>
                    Weight:
                    <br />
                    {weight}kg
                  </Typography>
                </Grid>
                {/* {types.map((pokemonType) => {
                  const { name } = pokemonType.type;
                  return ( */}
                <Grid item md={2}>
                  <Typography className={classes.text}>
                    Type:
                    <br />
                    {main_type}
                  </Typography>
                </Grid>
                <Grid item md={2}>
                  <Typography className={classes.text}>
                    Main move:
                    <br />
                    {main_move}
                  </Typography>
                </Grid>
                {/* );
                })} */}
              </Grid>
            </Box>
          </Box>
        </Box>
      );
    } else {
      return <CircularProgress />;
    }
  }
}

const mapStateToProps = (state) => ({
  favourites: state.favourites,
});

const mapDispatchToProps = (dispatch) => ({
  toggleFavourite: (pokemon) => dispatch(toggleFavourite(pokemon)),
});

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(PokemonDetails)
);
