import { app } from "../src/firebase.js";
import { get, getDatabase, ref, set } from "firebase/database";

import cheerio from "cheerio";

const URL_BASE = "https://www3.animeflv.net/";
var text_busqueda = "boku no hero";
const busqueda = () => {
  return text_busqueda.length > 0
    ? `q=${text_busqueda.replaceAll(" ", "+")}&`
    : "";
};

const listaAnime = {};

const asyncfetch = async (url) => {
  let resp = await fetch(url);
  let texto = resp.text();
  return texto;
};

const getVideos = async (url, episodio) => {
  let text = await asyncfetch(`${URL_BASE}ver/${url}-${episodio}`);
  const $ = cheerio.load(text);
  let videos = $("script");
  let videosLista = [];
  for (var i = 0; i < videos.length; i++) {
    let video = $(videos.get(i)).text();
    if (video.indexOf("var videos") > 0) {
      let lineas = video
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.indexOf("var videos = {") >= 0);
      JSON.parse(
        lineas[0]
          .substring(lineas[0].indexOf(":[") + 1, lineas[0].indexOf("]}") + 1)
          .trim()
      ).map((v) => videosLista.push(v.code));
    }
  }
  return videosLista;
};

const toEpisodeObj = async (url, episodio) => {
  let videos = await getVideos(url, episodio[0]);
  console.log(videos);
  let episodioObj = {
    url: `${URL_BASE}ver/${url}-${episodio[0]}`,
    title: `Episodio-${episodio[0]}`,
    videos: videos,
  };
  return episodioObj;
};

const getEpisodes = async (url, anime) => {
  //console.log("Inicio getEpisodes ");
  let text = await asyncfetch(`${URL_BASE}${url}`);
  const $ = cheerio.load(text);
  let episodios = $("script");
  let episodiosLista = [];
  let codigo = 0;
  for (var i = 0; i < episodios.length; i++) {
    let episodio = $(episodios.get(i)).text();
    if (episodio.indexOf("anime_info") > 0) {
      let lineas = episodio
        .split("\n")
        .map((l) => l.trim())
        .filter(
          (l) => l.indexOf("anime_info") > 0 || l.indexOf("episodes") > 0
        );
      var anime_info = lineas[0]
        .substring(lineas[0].indexOf("[") + 1, lineas[0].indexOf("]"))
        .trim()
        .split(",")
        .map((t) => t.replaceAll('"', ""));
      codigo = parseInt(anime_info[0]);
      var episodes = lineas[1]
        .substring(lineas[1].indexOf("[") + 2, lineas[1].length - 3)
        .trim()
        .split("],[")
        .map((d) => d.split(","));
      for (const key in episodes) {
        let episode = await toEpisodeObj(anime_info[2], episodes[key]);
        episodiosLista.push(episode);
      }
    }
  }
  //console.log("fin getEpisodes ");
  anime["episodes"] = episodiosLista;
  anime["codigo"] = codigo;
  return codigo;
};

const toAnimeObj = async (articulo) => {
  const $ = cheerio.load(articulo);
  let url = $("a").attr("href");
  let title = $("a > h3").text();
  let image = $("a > div > figure > img").attr("src");
  let description = $("div > p:nth-child(3)").text();
  let anime = {
    url: `${URL_BASE}${url}`,
    title: title,
    image: image,
    description: description,
  };
  let codigo = await getEpisodes(url, anime);
  listaAnime[codigo] = anime;
};

const getAnimePage = async (page = 1) => {
  //console.log("Inicio getAnimePage " + page);
  let text = await asyncfetch(
    `${URL_BASE}browse?${busqueda()}order=title&page=${page}`
  );
  const $ = cheerio.load(text);
  let articulos = $("article");
  console.log(`Encontrados [${articulos.length}]`);
  for (var i = 0; i < articulos.length; i++) {
    let articulo = articulos.get(i);
    ////console.log($(articulo).html());
    await toAnimeObj($(articulo).html());
  }
  //console.log("fin getAnimePage " + page);
};
const getAnimes = async (find) => {
  text_busqueda = find;
  console.log(`Buscando [${text_busqueda}]`);
  let text = await asyncfetch(`${URL_BASE}browse?${busqueda()}order=title`);
  const $ = cheerio.load(text);
  let pages = $(".pagination > li");
  let ultimaPagina = pages.get(pages.length - 2);
  for (var page = 1; page <= parseInt($(ultimaPagina).text()); page++) {
    await getAnimePage(page);
  }
  //console.log("fin getAnimes");
  //console.debug(listaAnime);
  const db = getDatabase(app);
  //let animesBD = await get(ref(db, "animes/"));
  ////console.log(animesBD.child("1887").toJSON());
  console.log(`Escribiendo BD`);
  console.debug(listaAnime);
  Object.entries(listaAnime).map((e) => {
    set(ref(db, "animes/" + e[0]), e[1]);
  });
  console.log(`Fin`);
};

getAnimes("made in abyss");
