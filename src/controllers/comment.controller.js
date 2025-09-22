import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO✅: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 2 } = req.query;

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  // Find comments for the specific video
  const comments = await Comment.find({ video: videoId })
    .skip((pageNumber - 1) * limitNumber)
    .limit(limitNumber)
    .sort({ createdAt: -1 });

  if (!comments) {
    throw new ApiError(404, "comments collections could not get");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, comments, "Video comments fetched successfully")
    );
});

const addComment = asyncHandler(async (req, res) => {
  // TODO✅: add a comment to a video

  const { videoId } = req.params;
  const { _id } = req.user;
  const { comment } = req.body;

  if (!videoId) {
    throw new ApiError(400, "video id ref must exist to add comment");
  }

  if (!_id) {
    throw new ApiError(400, "can't find user id");
  }

  if (!comment) {
    throw new ApiError(400, "Must enter comment to add");
  }

  const commentCollection = await Comment.create({
    comment,
    owner: _id,
    video: videoId,
  });

  res
    .status(201)
    .json(
      new ApiResponse(201, commentCollection, "Created comment successfully")
    );
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO✅: update a comment

  const { commentId } = req.params;
  const { comment } = req.body;

  if (!commentId) {
    throw new ApiError(400, "Must have comment Id to update");
  }

  if (!comment) {
    throw new ApiError(400, "Must have comment to update");
  }

  const commentRes = await Comment.findByIdAndUpdate(
    commentId,
    { $set: { comment } },
    { new: true }
  );

  if (!commentRes) {
    throw new ApiError(404, "Comment not found or has been updated");
  }

  res
    .status(200)
    .json(new ApiResponse(200, commentRes, "Updated comment successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO✅: delete a comment

  const { commentId } = req.params;

  if (!commentId) {
    throw new ApiError(400, "Id must exist to delete comment");
  }

  const comment = await Comment.findByIdAndDelete(commentId);

  if (!comment) {
    throw new ApiError(404, "comment must exist to remove");
  }

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Deleted Comment successfully"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
