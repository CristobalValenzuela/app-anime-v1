import { Typography } from "@mui/material";
import * as React from "react";
import { Link, Navigate, Outlet, Route, Routes } from "react-router-dom";
import Animes from "./Animes.js";
import Capitulos from "./Capitulos.js";
import VideoViewer from "./VideoViewer.js";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route
          index={true}
          element={<Navigate to={"/animes"} replace={true} />}
        />
        <Route
          path="/animes"
          element={<Animes />}
          errorElement={<ErrorPage code={500} />}
        />
        <Route
          path="/animes/:codigo/episodes"
          element={<Capitulos />}
          errorElement={<ErrorPage code={500} />}
        />
        <Route
          path="/animes/:codigo/episodes/:cap"
          element={<VideoViewer />}
          errorElement={<ErrorPage code={500} />}
        />
        <Route path="*" element={<ErrorPage code={404} />} />
      </Route>
    </Routes>
  );
}

function ErrorPage({ code }) {
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
        paddingBottom: 20,
        height: "100vh",
      }}
    >
      <Link
        to="/"
        style={{
          textDecorationLine: "none",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Typography variant="h1" gutterBottom style={{ color: "white" }}>
          Error {code}
        </Typography>
        <Typography variant="h4" gutterBottom style={{ color: "white" }}>
          Regresar al inicio
        </Typography>
      </Link>
    </div>
  );
}

function Layout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default App;
