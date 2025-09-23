import { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  //TODO: toggle like on video

  const { videoId } = req.params;
  const { _id: userId } = req.user;

  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(404, "video id must have to toggle video like");
  }

  if (!userId) {
    throw new ApiError(404, "User must login to like a video");
  }

  const existingLike = await Like.findOne({
    video: videoId,
    likedBy: userId,
  });

  if (existingLike) {
    await existingLike.deleteOne();

    const totalLikes = await Like.countDocuments({ video: videoId });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { totalLikes },
          "Like removed to video successfully"
        )
      );
  } else {
    await Like.create({
      likedBy: userId,
      video: videoId,
    });

    const totalLikes = await Like.countDocuments({ video: videoId });

    return res
      .status(201)
      .json(
        new ApiResponse(201, { totalLikes }, "Like added to video successfully")
      );
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  //TODO: toggle like on comment

  const { _id: userId } = req.user;

  if (!commentId || isValidObjectId(commentId)) {
    throw new ApiError(
      400,
      "comment id is not valid or comment does not exist"
    );
  }

  if (!userId || isValidObjectId(userId)) {
    throw new ApiError(404, "User could not found or user must login");
  }

  const existingComment = await Like.findOne({
    comment: commentId,
    likedBy: userId,
  });

  const totalComments = await Like.countDocuments({ comment: commentId });

  if (existingComment) {
    await existingComment.deleteOne();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { totalComments },
          "Like removed to comment successfully"
        )
      );
  } else {
    await Like.create({
      comment: commentId,
      likedBy: userId,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, "Like added to comment successfully"));
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  //TODO: toggle like on tweet

  const { tweetId } = req.params;
  const { _id: userId } = req.user;

  if (!tweetId || !isValidObjectId(tweetId)) {
    throw new ApiError(200, "could not find tweet or tweet id is not valid");
  }

  if (!using) {
    throw new ApiError(200, "User could not find, user must login");
  }

  const existingTweet = await Like.find({
    tweet: tweetId,
    likedBy: userId,
  });

  if (existingTweet) {
    await existingTweet.deleteOne();

    return res
      .status(200)
      .json(new ApiResponse(200, "Like added to tweet successfully"));
  }
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
