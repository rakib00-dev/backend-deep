import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  //TODO✅: create playlist

  if (!name || !description) {
    throw new ApiError(400, "Name and description of the playlist must exist");
  }

  if (!req.user._id) {
    throw new ApiError(401, "unauthorized, User must login");
  }

  const playlist = await Playlist.create({
    name,
    description,
    owner: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, playlist, "Playlist Created Successfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  //TODO✅: get user playlists

  if (!userId) {
    throw new ApiError(400, "Must have userID to get user playlist");
  }

  const UserPlaylist = await Playlist.find({ owner: userId });

  return res
    .status(200)
    .json(
      new ApiResponse(200, UserPlaylist, "Fetched User Playlist Successfully")
    );
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  //TODO✅: get playlist by id

  if (!playlistId) {
    throw new ApiError(400, "Must Enter Playlist id to find playlist");
  }

  const playlist = await Playlist.findById(playlistId);

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  //TODO✅: add video to playlist by id

  const { playlistId, videoId } = req.params;

  if (!playlistId && !videoId) {
    throw new ApiError(400, "PlaylistId and VideoId must exist to add video");
  }

  const addedVideoOnPlayList = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $push: {
        videos: videoId,
      },
    },
    { new: true }
  );

  if (!addedVideoOnPlayList) {
    throw new ApiError(404, "Playlist not found or video couldn't be added");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        addedVideoOnPlayList,
        "Added video to playlist successfully"
      )
    );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  // TODO✅: remove video from playlist

  if (!playlistId && !videoId) {
    throw new ApiError(
      400,
      "Must Have PlaylistId and videoId to remove video from playlist"
    );
  }

  const removedVideoFromPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $pull: { videos: videoId },
    },
    { new: true }
  );

  if (!removedVideoFromPlaylist) {
    throw new ApiError(404, "removedvideo is not found or coun't be added");
  }

  return res
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

  // TODO✅: delete playlist

  if (!playlistId) {
    throw new ApiError(
      400,
      "Playlist Id Must Exist to perfom Delete oparation"
    );
  }

  await Playlist.findByIdAndDelete(playlistId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Deleted the Playlist Successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;

  //TODO: update playlist

  if (!playlistId) {
    throw new ApiError(400, "Id Must Exist to update the playlist");
  }

  if (!name && !description) {
    throw new ApiError(
      400,
      "name and descriptioin Exist to update the playlist"
    );
  }

  const UpdatedPlayList = await Playlist.findByIdAndUpdate(
    playlistId,
    { $set: { name, description } },
    { new: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatePlaylist, "Updated Playlist Successfully")
    );
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
