import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { app } from "./firebase.js";
import { get, getDatabase, ref } from "firebase/database";

const db = getDatabase(app);

function Animes() {
  const [animes, setAnimes] = useState([]);

  useEffect(() => {
    get(ref(db, "animes/")).then((resp) => {
      let animesJson = resp.toJSON();
      let animes = [];
      for (var i in animesJson) {
        animes.push(animesJson[i]);
      }
      animes.sort((a, b) => {
        return a.title.localeCompare(b.title);
      });
      setAnimes(animes);
    });
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        backgroundColor: "#0f5769",
        justifyContent: "space-between",
        alignContent: "baseline",
        paddingInline: 20,
        paddingBottom: 20,
        minHeight: "100vh",
      }}
    >
      {animes &&
        animes.map((anime, index) => {
          return (
            <Card
              key={`anime-${anime.codigo}`}
              sx={{
                maxWidth: 200,
                maxHeight: 400,
                borderRadius: 2.5,
                marginTop: 2.5,
                boxShadow: "14px 15px 19px #000000b3",
                backgroundColor: "#0f4150",
              }}
            >
              <Link to={`/animes/${anime.codigo}/episodes`}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="300"
                    image={anime.image}
                    alt="Paella dish"
                    referrerPolicy="no-referrer"
                  />
                  <CardContent>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      style={{ color: "white" }}
                    >
                      {anime.title}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Link>
            </Card>
          );
        })}
    </div>
  );
}

export default Animes;
