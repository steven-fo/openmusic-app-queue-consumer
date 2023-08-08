/* eslint-disable require-jsdoc */
const {Pool} = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylists(playlistId) {
    const playlistQuery = {
      text: `SELECT playlists.id, playlists.name FROM playlists
      INNER JOIN users ON playlists.owner = users.id
      WHERE playlists.id = $1`,
      values: [playlistId],
    };

    const songQuery = {
      text: `SELECT songs.id, songs.title, songs.performer FROM songs
      INNER JOIN playlist_songs ON songs.id = playlist_songs.song_id
      WHERE playlist_songs.playlist_id = $1`,
      values: [playlistId],
    };

    const playlist = await this._pool.query(playlistQuery);
    const song = await this._pool.query(songQuery);
    const result = {
      ...playlist.rows[0],
      songs: song.rows,
    };

    return result;
  }
}

module.exports = PlaylistsService;
