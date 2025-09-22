import { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO✅: create tweet

  const { content } = req.body;
  const { _id: userID } = req.user;

  const isUserIdValid = isValidObjectId(userID);

  if (!content) {
    throw new ApiError(400, "content must exist to create tweet");
  }

  if (!userID) {
    throw new ApiError(400, "User must have logged to add tweet");
  }

  if (!isUserIdValid) {
    throw new ApiError(400, "User Id is not valid");
  }

  const tweet = await Tweet.create({ content, owner: userID });

  res
    .status(200)
    .json(new ApiResponse(200, tweet, "Successfully Created new tweet"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO✅: get user tweets

  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(400, "Failed to find user");
  }

  const userTweets = await Tweet.find({ owner: userId });

  if (!userTweets) {
    throw new ApiError(200, "Can not find user tweets");
  }

  res
    .status(200)
    .json(new ApiResponse(200, userTweets, "Successfuly get all user tweets"));
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet

  const { tweetId } = req.params;
  const { content } = req.body;

  if (!tweetId || !isValidObjectId(tweetId)) {
    throw new ApiError(404, "Failded to get tweet id");
  }

  if (!content) {
    throw new ApiError(404, "Failded to get content to update tweet");
  }

  const tweet = await Tweet.findByIdAndUpdate(
    tweetId,
    { $set: { content } },
    { new: true }
  );

  if (!tweet) {
    throw new ApiError(400, "Tweet not exist");
  }

  res
    .status(200)
    .json(new ApiResponse(200, tweet, "Successfully updated the tweet"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
  const { tweetId } = req.params;

  const isTweetIdValid = isValidObjectId(tweetId);

  if (!tweetId || !isTweetIdValid) {
    throw new ApiError(400, "Faild to get tweet id or it is not valid");
  }

  await Tweet.findByIdAndDelete(tweetId);

  res.status(200).json(new ApiResponse(200, {}, "Successfully deleted tweet"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
