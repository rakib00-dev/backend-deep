import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO✅: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

  const { _id: userChannelId } = req.user;

  const vidoes = await Video.find({ owner: userChannelId });

  const videosViews = vidoes
    .map((e) => e.views)
    .reduce((acc, curr) => acc + curr, 0);

  const totalChannelSubscribers = await Subscription.countDocuments({
    channel: userChannelId,
  });

  const totalVideos = await Video.countDocuments({ owner: userChannelId });

  let totalLikes = await Video.aggregate([
    {
      $match: {
        owner: userChannelId,
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "videoLikes",
      },
    },
    {
      $project: {
        videoLikes: 1,
      },
    },
  ]);

  totalLikes = totalLikes
    .map((docs) => docs)
    .map((e) => e.videoLikes)
    .map((e) => e.length)
    .reduce((accu, curr) => accu + curr, 0);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        totalViews: videosViews,
        totalSubscribers: totalChannelSubscribers,
        totalVideos: totalVideos,
        totalLikes: totalLikes,
      },
      "successfully get the details total likes, total subs, total videos, total views"
    )
  );
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO✅: Get all the videos uploaded by the channel

  const { _id: userChannelId } = req.user;

  if (!userChannelId || !isValidObjectId(userChannelId)) {
    throw new ApiError(400, "Failed to find user channel Id");
  }

  const videos = await Video.find({ owner: userChannelId });

  if (!videos) {
    throw new ApiError(400, "Counld not found any video");
  }

  res
    .status(200)
    .json(new ApiResponse(200, videos, "Successfully get all videos"));
});

export { getChannelStats, getChannelVideos };
