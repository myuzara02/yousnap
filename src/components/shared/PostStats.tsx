import { Models } from "appwrite"

type PostStatsProps = {
    post: Models.Document,
    userId: string
}

const PostStats = ({ post, userId }: PostStatsProps) => {
    return (
        <div className="flex justify-between items-center z-20">
            {/* ========== LIKE */}
            <div className="flex gap-3 mr-5">
                <img
                    src="/assets/icons/like.svg"
                    alt="like"
                    width={20}
                    height={20}
                    onClick={() => { }}
                />
                <p className="small-medium lg:base-medium">0</p>

            </div>

            {/* ========== SAVE */}
            <div className="flex gap-3">
                <img
                    src="/assets/icons/save.svg"
                    alt="like"
                    width={20}
                    height={20}
                    onClick={() => { }}
                />
            </div>
        </div>
    )
}

export default PostStats