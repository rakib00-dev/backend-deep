import { isValidObjectId } from "mongoose";
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

// TODO✅: controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!channelId || !isValidObjectId(channelId)) {
    throw new ApiError(
      400,
      "channel id could not found or the channel id is not valid"
    );
  }

  const channelSubscribers = await Subscription.find({
    channel: channelId,
  }).populate("subscriber", "_id username fullName avatar");

  if (!channelSubscribers) {
    throw new ApiError(400, "channel subscribers are not found");
  }

  const channelSubscribersCount = await Subscription.countDocuments({
    channel: channelId,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { channelSubscribers, channelSubscribersCount },
        "Successfully fetched the subscribers"
      )
    );
});

// TODO✅: controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  if (!subscriberId || !isValidObjectId(subscriberId)) {
    throw new ApiError(404, "subscriber id is not valid");
  }

  const userSubscriberdChannels = await Subscription.find({
    subscriber: subscriberId,
  }).populate("channel", "fullName username _id avatar");

  const subscribedChannelsCount = await Subscription.countDocuments({
    subscriber: subscriberId,
  });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { userSubscriberdChannels, subscribedChannelsCount },
        "Successfully fetched the user subscribed channels"
      )
    );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
