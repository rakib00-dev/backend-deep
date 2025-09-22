import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  //TODO: toggle like on video

  const { videoId } = req.params;
  const { _id } = req.user;

  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(404, "video id must have to toggle video like");
  }

  if (!_id) {
    throw new ApiError(404, "User must login to like a video");
  }

  await Like.create({ likedBy: _id, video: videoId });
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  //TODO: toggle like on comment
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos

  const { _id } = req.user;

  if (!_id || isValidObjectId(_id)) {
    throw new ApiError(404, "User must login");
  }

  const likedVideos = await Like.find({
    likedBy: _id,
    video: { $exists: true },
  }).sort({
    createdAt: -1,
  });

  res
    .status(200)
    .json(
      new ApiResponse(200, likedVideos, "Successfully fetched all liked videos")
    );
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
