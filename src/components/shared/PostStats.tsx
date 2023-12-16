import { useUserContext } from "@/context/AuthContext"
import { useDeleteSavedPost, useGetCurrentUser, useLikePost, useSavePost } from "@/lib/react-query/queriesAndMutations"
import { checkIsLiked } from "@/lib/utils"
import { Models } from "appwrite"
import { Loader } from "lucide-react"
import React, { useEffect, useState } from "react"

type PostStatsProps = {
    post: Models.Document,
    userId: string
}

const PostStats = ({ post, userId }: PostStatsProps) => {
    const likesList = post.likes.map((user: Models.Document) => user.$id)

    const [likes, setLikes] = useState(likesList)
    const [isSaved, setIsSaved] = useState(false)

    const { mutate: likePost } = useLikePost()
    const { mutate: savePost, isPending: isSavingPost } = useSavePost()
    const { mutate: deleteSavedPost, isPending: isDeletingSavedPost } = useDeleteSavedPost()

    const { data: currentUser } = useGetCurrentUser()

    const handleLikePost = (e: React.MouseEvent) => {
        e.stopPropagation()

        let newLikes = [...likes]

        const hasLiked = newLikes.includes(userId)

        if (hasLiked) {
            newLikes = newLikes.filter((id) => id !== userId)
        } else {
            newLikes.push(userId)
        }

        setLikes(newLikes)
        likePost({ postId: post.$id, likesArray: newLikes })
    }

    const savedPostRecord = currentUser?.save.find((record: Models.Document) => record.post.$id === post.$id)

    useEffect(() => {
        setIsSaved(!!savedPostRecord)
    }, [currentUser])

    const handleSavePost = (e: React.MouseEvent) => {
        e.stopPropagation()

        if (savedPostRecord) {
            setIsSaved(false)
            deleteSavedPost(savedPostRecord.$id)
        } else {
            setIsSaved(true)
            savePost({ postId: post.$id, userId })
        }

    }

    return (
        <div className="flex justify-between items-center z-20">
            {/* ========== LIKE */}
            <div className="flex gap-3 mr-5">
                <img
                    src={checkIsLiked(likes, userId)
                        ? "/assets/icons/liked.svg"
                        : "/assets/icons/like.svg"
                    }
                    alt="like"
                    width={20}
                    height={20}
                    onClick={handleLikePost}
                />
                <p className="small-medium lg:base-medium">{likes.length}</p>

            </div>

            {/* ========== SAVE */}
            <div className="flex gap-3">
                {isSavingPost ? <Loader /> :
                    <img
                        src={isSaved
                            ? "/assets/icons/saved.svg"
                            : "/assets/icons/save.svg"
                        }
                        alt="save"
                        width={20}
                        height={20}
                        onClick={handleSavePost}
                    />
                }
            </div>
        </div>
    )
}

export default PostStats