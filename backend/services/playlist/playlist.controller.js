const express = require("express");
const router = express.Router();

const Joi = require("joi");

const validateRequest = require("../../helpers/validate-request");
const authenticate = require("../../helpers/authenticate");

const playlistService = require("./playlist.service");

router.all("/*", authenticate);

router.get("/:username", getAllPlaylist);
router.get("/:id", getPlaylist);
router.post("/", playlistSchema, createPlaylist);
router.put("/:id", playlistSchema, editPlaylist);
router.delete("/:id", deletePlaylist);

function getAllPlaylist(req, res, next) {
  const username = req.params.username;
  playlistService
    .getAllPlaylistsOfUser(username)
    .then((playlists) => res.json(playlists))
    .catch(next);
}

function getPlaylist(req, res, next) {
  const playlistID = req.params.id;
  playlistService
    .getPlaylist(playlistID)
    .then((playlist) => res.json(playlist))
    .catch(next);
}

function playlistSchema(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().required().min(3),
    songs: Joi.array().items(Joi.number()), // Song IDs
  });
  validateRequest(req, res, next, schema);
}

function createPlaylist(req, res, next) {
  const userID = req.user.id;
  const name = req.body.name;
  const songs = req.body.songs;
  const playlist = {
    name,
    songs,
  };
  playlistService
    .createPlaylist(userID, playlist)
    .then((playlist) => res.json(playlist))
    .catch(next);
}

function editPlaylist(req, res, next) {
  const userID = req.user.id;
  const playlistID = req.params.id;
  const name = req.body.name;
  const songs = req.body.songs;
  const playlist = {
    id: playlistID,
    name: name,
    songs: songs,
  };
  playlistService
    .editPlaylist(userID, playlist)
    .then((playlist) => res.json(playlist))
    .catch(next);
}

function deletePlaylist(req, res, next) {
  const userID = req.user.id;
  const playlistID = req.params.id;
  playlistService
    .deletePlaylist(userID, playlistID)
    .then(() => res.sendStatus(204))
    .catch(next);
}

module.exports = router;
