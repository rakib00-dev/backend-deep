import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  //TODO✅: create playlist

  if (!(name || description)) {
    throw new ApiError(400, "name and description of the playlist must exist");
  }

  if (!req.user._id) {
    throw new ApiError(401, "unauthorized, User must login");
  }

  const playlist = await Playlist.create({
    name,
    description,
    owner: req.user._id,
  });

  res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist Created Successfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  //TODO: get user playlists

  if (!userId) {
    throw new ApiError(400, "Must have userID to get user playlist");
  }

  const UserPlaylist = await Playlist.aggregate([
    {
      $match: {
        owner: userId,
      },
    },
  ]);

  res
    .status(200)
    .json(
      new ApiResponse(200, UserPlaylist, "Fetched User Playlist Successfully")
    );
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  //TODO: get playlist by id

  if (!playlistId) {
    throw new ApiError(400, "Must Enter Playlist id to find playlist");
  }

  const playlist = await Playlist.findById(playlistId);

  res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (!(playlistId && videoId)) {
    throw new ApiError(400, "PlaylistId and VideoId must exist to add video");
  }

  const addedVideo = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $set: {
        videos: [videoId],
      },
    },
    { new: true }
  );

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        addVideoToPlaylist,
        "Added video to playlist successfully"
      )
    );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  // TODO: remove video from playlist

  if (!(playlistId && videoId)) {
    throw new ApiError(
      400,
      "Must Have PlaylistId and videoId to remove video from playlist"
    );
  }

  const removedVideoFromPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $pull: {
        videos: videoId,
      },
    },
    { new: true }
  );

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        removedVideoFromPlaylist,
        "Removed video from playlist successfully"
      )
    );
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  // TODO: delete playlist
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  //TODO: update playlist
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
