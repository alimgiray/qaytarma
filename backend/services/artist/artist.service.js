const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const errors = require("../../errors");

const Artist = require("./artist.model");
const Song = require("../song/song.model");

module.exports = {
  getAllArtists,
  getLatestArtists,
  searchArtists,
  getSongsOfArtist,
  getArtist,
  addArtist,
  editArtist,
  deleteArtist,
  getArtistCount,
};

async function getAllArtists() {
  return await Artist.findAll({ order: [["name", "ASC"]] });
}

async function getLatestArtists(from) {
  return await Artist.findAll({
    order: [["id", "DESC"]],
    limit: 20,
    offset: from,
  });
}

async function searchArtists(query) {
  return await Artist.findAll({
    where: {
      name: Sequelize.where(
        Sequelize.fn("UPPER", Sequelize.col("artist.name")),
        "LIKE",
        "%" + query.toUpperCase() + "%"
      ),
    },
  });
}

async function getSongsOfArtist(artistID) {
  const artist = await getArtist(artistID);
  return await Song.findAll({
    include: [
      {
        model: Artist,
        as: "artists",
        attributes: ["id", "name"],
        where: {
          id: artist.id,
        },
      },
    ],
  });
}

async function getArtist(artistID) {
  const artist = await Artist.findOne({
    where: {
      id: artistID,
    },
  });
  if (!artist) {
    throw new errors.AppError(
      errors.errorTypes.NOT_FOUND,
      404,
      "Artist not found",
      true
    );
  }
  return artist;
}

async function addArtist(name) {
  const artist = await Artist.create({ name });
  return await artist.save();
}

async function editArtist(artistID, name) {
  const artist = await getArtist(artistID);
  artist.name = name;
  return await artist.save();
}

async function deleteArtist(artistID) {
  const artist = await getArtist(artistID);
  await artist.destroy();
}

async function getArtistCount() {
  const count = await Artist.count();
  return { count };
}
