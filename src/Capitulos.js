import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  List,
  ListItemText,
  Typography,
} from "@mui/material";
import { get, getDatabase, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { app } from "./firebase.js";

const db = getDatabase(app);

function Capitulos() {
  const { codigo } = useParams();
  const [anime, setAnime] = useState([]);

  useEffect(() => {
    get(ref(db, "animes/" + codigo)).then((resp) => {
      let animesJson = resp.toJSON();
      let episodes = [];
      for (var i in animesJson.episodes) {
        episodes.push(animesJson.episodes[i]);
      }
      animesJson.episodes = episodes;
      console.log(
        "🚀 ~ file: Capitulos.js ~ line 29 ~ get ~ animesJson",
        animesJson
      );
      setAnime(animesJson);
    });
  }, [codigo]);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        backgroundColor: "#0f5769",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingInline: 20,
        height: "100vh",
      }}
    >
      <Card
        key={`anime-${anime.codigo}`}
        sx={{
          width: "calc(100vw - 120px)",
          height: "calc(100vh - 120px)",
          padding: 3,
          borderRadius: 2.5,
          marginTop: 2.5,
          boxShadow: "14px 15px 19px #000000b3",
          backgroundColor: "#0f4150",
        }}
      >
        <CardContent
          style={{
            display: "flex",
            flexDirection: "row",
            borderRadius: 10,
            boxShadow: "14px 15px 19px #000000b3",
            padding: 0,
            margin: 16,
          }}
        >
          <CardMedia
            component="img"
            height="350"
            image={anime.image}
            alt="Paella dish"
            referrerPolicy="no-referrer"
            style={{
              maxWidth: 250,
              borderStartStartRadius: 10,
              borderEndStartRadius: 10,
            }}
          />
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              height: 350,
              flex: 1,
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              style={{ color: "white", marginLeft: 20 }}
            >
              {anime.title}
            </Typography>
            <Typography
              variant="body2"
              style={{ color: "white", marginLeft: 20 }}
            >
              {anime.description}
            </Typography>
          </Box>
        </CardContent>
        <CardContent
          style={{
            borderRadius: 10,
            boxShadow: "14px 15px 19px #000000b3",
            padding: 10,
            margin: 16,
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            style={{ color: "white", marginLeft: 20 }}
          >
            Capitulos
          </Typography>
          <List style={{ maxHeight: 350, overflow: "auto" }}>
            {anime &&
              anime.episodes &&
              anime.episodes.map((e, index) => {
                return (
                  <Link to={`/animes/${anime.codigo}/episodes/${index}`}>
                    <ListItemText
                      key={`capitulo_${index}`}
                      primary={e.title}
                      style={{
                        color: "white",
                        paddingInline: 20,
                        paddingBlock: 10,
                        marginRight: 10,
                        borderRadius: 10,
                        backgroundColor: "#0c303b",
                      }}
                    />
                  </Link>
                );
              })}
          </List>
        </CardContent>
      </Card>
    </div>
  );
}

export default Capitulos;
