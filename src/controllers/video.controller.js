import { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  destroyOnCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query,
    sortBy = "createdAt",
    sortType = "desc",
    userId,
  } = req.query;

  //TODO: get all videos based on query, sort, pagination

  if (!userId) {
    throw new ApiError(400, "Could not found user id");
  }

  const filters = {
    owner: userId,
    isPublished: true,
  };

  if (query) {
    filters.$or = [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ];
  }

  const options = {};
  const sortDirection = sortType === "asc" ? 1 : -1;

  options.sort = { [sortBy]: sortDirection };
  options.skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  options.limit = parseInt(limit, 10);

  const totalVideos = await Video.countDocuments(filters);

  const allVideos = await Video.find(filters, null, options);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        videos: allVideos,
        pagination: {
          total: totalVideos,
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          totalPages: Math.ceil(totalVideos / parseInt(limit, 10)),
        },
      },
      "Successfully fetched videos by filter"
    )
  );
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const { _id: userId } = req.user;

  // TODO✅: get video, upload to cloudinary, create video

  if (!userId || !isValidObjectId(userId)) {
    throw new ApiError("User Must login");
  }

  const videoLocalPath = req.files?.videoFile[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

  if (!videoLocalPath) {
    throw new ApiError(400, "video must select to upload");
  }

  if (!thumbnailLocalPath) {
    throw new ApiError(400, "thumbnail must select to upload");
  }

  if (!title) {
    throw new ApiError(400, "required the title field");
  }

  const videoPublic = await uploadOnCloudinary(videoLocalPath);
  const thumbnailPublic = await uploadOnCloudinary(thumbnailLocalPath);

  const video = await Video.create({
    title,
    description: description || "",
    duration: videoPublic.duration,
    videoFile: videoPublic.url,
    thumbnail: thumbnailPublic.url,
    owner: userId,
    isPublished: true,
  });

  res
    .status(201)
    .json(new ApiResponse(201, video, "Video created successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  //TODO✅: get video by id

  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Video id is not found or not valid");
  }

  const video = await Video.findByIdAndUpdate(
    videoId,
    { $inc: { views: 1 } },
    { new: true }
  );

  if (!video) {
    throw new ApiError(404, "video not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, video, "Successfuly fetched the video"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.params;

  //TODO✅: update video details like title, description, thumbnail

  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Video is not found or not valid");
  }

  if ([title, description].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const oldThumbnail = await Video.findById(videoId);
  const oldThumbnailPath = oldThumbnail.thumbnail;

  const newThumbnailPath = req.file?.path;

  if (!newThumbnailPath) {
    throw new ApiError(400, "thumbnail file could not found");
  }

  const thumbnail = await uploadOnCloudinary(newThumbnailPath);

  const newVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title,
        description,
        thumbnail: thumbnail.url,
      },
    },
    { new: true }
  );

  if (oldThumbnailPath) {
    await destroyOnCloudinary(oldThumbnailPath);
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, newVideo, "Successfully updated the video details")
    );
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  //TODO✅: delete video

  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(
      404,
      "video id is not found or the video id is not valid"
    );
  }

  const video = await Video.findByIdAndDelete(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (video.videoFile) {
    await destroyOnCloudinary(video.videoFile, "video");
  }

  if (video.thumbnail) {
    await destroyOnCloudinary(video.thumbnail);
  }

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Successfully deleted the video"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  //TODO✅: toggle publish status video

  const { videoId } = req.params;

  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(404, "video id is not found or video id is not valid");
  }

  const video = await Video.findOne({ _id: videoId });

  if (!video) {
    throw new ApiError(404, "video is not found");
  }

  if (video.isPublished) {
    video.isPublished = false;
    await video.save({ validateBeforeSave: false });
  } else {
    video.isPublished = true;
    await video.save({ validateBeforeSave: false });
  }

  res
    .status(200)
    .json(new ApiResponse(200, video, "toggled the video publish status"));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
