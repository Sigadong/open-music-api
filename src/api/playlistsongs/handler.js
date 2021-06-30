const autoBind = require('auto-bind');
const ClientError = require('../../exceptions/ClientError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistSongsHandler {
  constructor(service, playlistsService, validator) {
    this._service = service;
    this._playlistsService = playlistsService;
    this._validator = validator;
    autoBind(this);
  }

  async postPlaylistSongsHandler(request, h) {
    try {
      const { playlistId, any } = request.params;
      if (any !== 'songs') {
        throw new NotFoundError('This is Resource not found !!');
      }

      this._validator.validatePlaylistSongsPayload(request.payload);
      const { songId } = request.payload;
      const { id: credentialUserId } = request.auth.credentials;
      await this._playlistsService.verifyPlaylistAccess(playlistId, credentialUserId);
      await this._service.verifyPlaylistSongs({ playlistId, songId });
      await this._service.addSongToPlaylist({ playlistId, songId });

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke playlist',
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getPlaylistSongsHandler(request, h) {
    try {
      const { playlistId, any } = request.params;
      if (any !== 'songs') {
        throw new NotFoundError('This is Resource not found !!');
      }

      const { id: credentialUserId } = request.auth.credentials;
      await this._playlistsService.verifyPlaylistAccess(playlistId, credentialUserId);
      const allSong = await this._service.getSongsToPlaylist(credentialUserId);

      return {
        status: 'success',
        data: {
          songs: allSong,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async deletePlaylistSongsHandler(request, h) {
    try {
      const { playlistId, any } = request.params;
      if (any !== 'songs') {
        throw new NotFoundError('This is Resource not found !!');
      }

      this._validator.validatePlaylistSongsPayload(request.payload);
      const { songId } = request.payload;
      const { id: credentialUserId } = request.auth.credentials;
      await this._playlistsService.verifyPlaylistAccess(playlistId, credentialUserId);
      await this._service.deleteSongFromPlaylist(playlistId, songId);

      return {
        status: 'success',
        message: 'Lagu berhasil dihapus dari Playlist',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = PlaylistSongsHandler;
