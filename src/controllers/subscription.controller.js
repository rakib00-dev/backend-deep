import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  const { _id: userId } = req.user;

  // TODO✅: toggle subscription

  if (!channelId || !isValidObjectId(channelId)) {
    throw new ApiError(
      404,
      "Could not found channel id or Channel Id is not valid"
    );
  }

  if (!userId || !isValidObjectId(userId)) {
    throw new ApiError(404, "User not found, User must login");
  }

  const existingSubscripion = await Subscription.findOne({
    channel: channelId,
    subscriber: userId,
  });

  if (existingSubscripion) {
    await existingSubscripion.deleteOne();

    const countOfChannelSubs = await Subscription.countDocuments({
      channel: channelId,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { countOfChannelSubs },
          "subscriber removed successfully"
        )
      );
  } else {
    await Subscription.create({
      subscriber: userId,
      channel: channelId,
    });

    const countOfChannelSubs = await Subscription.countDocuments({
      channel: channelId,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { countOfChannelSubs },
          "subscriber added successfully"
        )
      );
  }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
