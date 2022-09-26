import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Typography,
} from "@mui/material";
import { get, getDatabase, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { app } from "./firebase.js";

const db = getDatabase(app);

function VideoViewer() {
  const { codigo, cap } = useParams();
  const [videos, setVideos] = useState([]);
  const [video, setVideo] = useState();
  const [episodio, setEpisodio] = useState();
  const [loading, setLoading] = useState(true);

  const getText = (v = "") => {
    if (v.toLocaleLowerCase().indexOf("mega") > 0) {
      return "MEGA";
    }
    if (v.toLocaleLowerCase().indexOf("yourupload") > 0) {
      return "YOURUPLOAD";
    }
    if (v.toLocaleLowerCase().indexOf("ok.ru") > 0) {
      return "OK.RU";
    }
    if (v.toLocaleLowerCase().indexOf("embedsb") > 0) {
      return "STREAMSB";
    }
    if (v.toLocaleLowerCase().indexOf("embedsito") > 0) {
      return "EMBEDSITO";
    }
    if (v.toLocaleLowerCase().indexOf("hqq") > 0) {
      return "HQQ";
    }
    if (v.toLocaleLowerCase().indexOf("streamtape") > 0) {
      return "STREAMTAPE";
    }
    if (v.toLocaleLowerCase().indexOf("my.mail.ru") > 0) {
      return "MAIL.RU";
    }
    return "";
  };

  useEffect(() => {
    get(ref(db, "animes/" + codigo + "/episodes/" + cap)).then((resp) => {
      let episodeJson = resp.toJSON();
      let videos = [];
      for (var i in episodeJson.videos) {
        videos.push(episodeJson.videos[i]);
      }
      episodeJson.videos = videos;
      episodeJson.videos = episodeJson.videos.map(
        (v, i) => (v = { url: v, text: getText(v) })
      );
      console.log(
        "🚀 ~ file: VideoViewer.js ~ line 24 ~ get ~ episodeJson",
        episodeJson
      );
      setVideo(episodeJson.videos[0]);
      setVideos(episodeJson.videos);
      setEpisodio(episodeJson);
    });
    console.log(
      parseInt(episodio?.title.substring(episodio?.title.indexOf("-") + 1))
    );
  }, [codigo, cap]);

  return (
    <Box
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
            flexDirection: "column",
            alignItems: "center",
            padding: 0,
            margin: 16,
          }}
        >
          {episodio && (
            <Box
              style={{
                display: "flex",
                flex: 1,
                flexDirection: "row",
                marginBottom: 10,
                alignItems: "center",
              }}
            >
              {parseInt(
                episodio.title.substring(episodio.title.indexOf("-") + 1)
              ) > 0 && (
                <Link
                  to={`/animes/${codigo}/episodes/${parseInt(cap) + 1}`}
                  onClick={() => {
                    setLoading(true);
                    setVideo();
                  }}
                  style={{
                    marginInline: 5,
                    backgroundColor: "#2677d3",
                    height: 30,
                    width: 30,
                    textAlign: "center",
                    lineHeight: 1.7,
                    textDecoration: "auto",
                    color: "#fff",
                  }}
                >
                  {"<"}
                </Link>
              )}
              <Typography
                variant="h4"
                gutterBottom
                style={{
                  color: "white",
                  margin: 0,
                  letterSpacing: 0,
                  width: 200,
                  textAlign: "center",
                }}
              >
                {episodio.title}
              </Typography>
              {parseInt(cap) > 0 && (
                <Link
                  to={`/animes/${codigo}/episodes/${parseInt(cap) - 1}`}
                  onClick={() => {
                    setLoading(true);
                    setVideo();
                  }}
                  style={{
                    marginInline: 5,
                    backgroundColor: "#2677d3",
                    height: 30,
                    width: 30,
                    textAlign: "center",
                    lineHeight: 1.7,
                    textDecoration: "auto",
                    color: "#fff",
                  }}
                >
                  {">"}
                </Link>
              )}
            </Box>
          )}
          <Box
            style={{
              width: 640,
              height: 360,
              backgroundColor: "#000000",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {video && (
              <iframe
                src={video.url}
                width="640"
                height="360"
                style={{ border: "1px solid #0f5769" }}
                onLoad={() => setLoading(false)}
              />
            )}
            {loading && (
              <CircularProgress
                style={{ width: 100, height: 100, position: "absolute" }}
              />
            )}
          </Box>
        </CardContent>
        <CardActions>
          <Box style={{ display: "flex", flex: 1, justifyContent: "center" }}>
            {videos &&
              videos.map((v, index) => {
                return (
                  <Button
                    key={`buton-${index}`}
                    onClick={() => {
                      setLoading(true);
                      setVideo(v);
                    }}
                    variant="contained"
                    style={{ marginInline: 5 }}
                  >
                    {v.text}
                  </Button>
                );
              })}
          </Box>
        </CardActions>
      </Card>
    </Box>
  );
}

export default VideoViewer;
