import { INewPost, INewUser } from "@/types";
import { ID, Query } from "appwrite";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { error } from "console";

export async function createUserAccount(user: INewUser) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name
        );

        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(user.name);

        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            imageUrl: avatarUrl,
            username: user.username,
        });

        return newUser;
    } catch (error) {
        console.log(error);
        return error;
    }
}

export async function saveUserToDB(user: {
    accountId: string;
    name: string;
    email: string;
    imageUrl: URL;
    username?: string;
}) {
    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user
        );

        return newUser;
    } catch (error) {
        console.log(error);
    }
}

export async function signInAccount(user: { email: string; password: string }) {
    try {
        const session = await account.createEmailSession(user.email, user.password);

        localStorage.setItem("sessionId", session.userId); //userId stored as a sessionId -> purpose of storing is after some time of user log in, when try to fetch useId on reload the appWrite is unable to fetch resulting 401
        return session;
    } catch (error) {
        console.log(error);
    }
}

export async function getCurrentUser() {
    try {
        // console.log("userId: ", localStorage.getItem("sessionId"));
        // const currentAccount = await account.get();
        const currentAccountId = localStorage.getItem("sessionId");

        if (currentAccountId !== null) {
            // if (!currentAccount) throw Error;

            const currentUser = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.userCollectionId,
                // [Query.equal("accountId", currentAccount.$id)]
                [Query.equal("accountId", currentAccountId)]
            );



            if (!currentUser) throw Error;

            return currentUser.documents[0];
        }
    } catch (error) {
        console.log(error);
    }
}

export async function signOutAccount() {
    try {
        localStorage.clear();
        const session = await account.deleteSession("current");

        return session;
    } catch (error) {
        console.log(error);
    }
}


// ========== Post API ==========

// ========== Create Post
export async function createPost(post: INewPost) {
    try {
        // Upload file to storage
        const uploadedFile = await uploadFile(post.file[0])

        if (!uploadFile) throw Error

        // get file url
        const fileUrl = getFilePreview(uploadedFile.$id)
        if (!fileUrl) {
            await deleteFile(uploadedFile.$id)
            throw Error
        }

        // convert tags into array
        const tags = post.tags?.replace(/ /g, "").split(",") || []

        // create post
        const newPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            ID.unique(),

            {
                creator: post.userId,
                caption: post.caption,
                imageUrl: fileUrl,
                imageId: uploadedFile.$id,
                location: post.location,
                tags: tags
            }
        )

        if (!newPost) {
            await deleteFile(uploadedFile.$id)
            throw Error
        }

        return newPost;
    } catch (error) {
        console.log(error);

    }
}

// ========== UPLOAD FILE
export async function uploadFile(file: File) {
    try {
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            file
        )

        return uploadedFile

    } catch (error) {
        console.log(error);
    }
}