import { useUserContext } from "@/context/AuthContext";
import {
  useDeleteSavePost,
  useLikePost,
  useSavePost,
} from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite";
import React, { useState } from "react";

type PostStatsProps = {
  post: Models.Document;
  userId: string;
};

const PostStats = ({ post, userId }: PostStatsProps) => {
  const likesList = post.likes.map((user: Models.Document) => user.$id);

  const [likes, setLikes] = useState(likesList);
  const [isSaved, setIsSaved] = useState(false);

  const { mutate: likePost } = useLikePost();
  const { mutate: savePost } = useSavePost();
  const { mutate: deleteSavedPost } = useDeleteSavePost();

  //   const { data: currentUser } = useGetCurrentUser();

  const handleLikePost = (e: React.MouseEvent) => {
    e.stopPropagation(); // this is to prevent the click
    // event from bubbling up to the parent element

    let newLikes = [...likes];

    const hasLiked = newLikes.includes(userId);

    if (hasLiked) {
      // remove the like
      newLikes = newLikes.filter((id) => id !== userId);
    } else {
      // add the like
      newLikes.push(userId);
    }

    setLikes(newLikes);
    likePost({ postId: post.$id, likesArray: newLikes });
  };

  const handleSavePost = (e: React.MouseEvent) => {
    e.stopPropagation(); // this is to prevent the click
    // event from bubbling up to the parent element

    const savedPostRecord = currentUser?.save.find(
      (record: Models.Document) => record.$id === post.$id
    );

    if (savedPostRecord) {
      // delete the saved post
      setIsSaved(false);
      deleteSavedPost(savedPostRecord.$id);
    } else {
      // save the post
      savePost({ postId: post.$id, userId });
      setIsSaved(true);
    }
  };

  return (
    <div
      className="flex justify-between i
      tems-center z-20"
    >
      <div className="flex gap-2 mr-5">
        <img
          src={`${
            checkIsLiked(likes, userId)
              ? "/assets/icons/liked.svg"
              : "/assets/icons/like.svg"
          }`}
          alt="like"
          width={20}
          height={20}
          // onClick={(e) => handleLikePost(e)}
          // this is the same as below
          onClick={handleLikePost}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>
      <div className="flex gap-2">
        <img
          src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
          alt="save"
          width={20}
          height={20}
          onClick={handleSavePost}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
};

export default PostStats;
