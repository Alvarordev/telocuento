import imageCompression from "browser-image-compression";
import {v4 as uuidv4} from "uuid"
import { createSupabaseClient } from "../client";

type UploadProps = {
    file: File;
    bucket: string;
    folder?: string;
}

function getStorage() {
    const { storage } = createSupabaseClient();
    return storage
}

export async function uploadImage({ file, bucket, folder }: UploadProps) {
    const fileName = file.name;
    const fileExtension = fileName.slice(fileName.lastIndexOf('.') + 1);
    const path = `${folder ? folder + '/' : ''}${uuidv4()}.${fileExtension}`;

    try {
        file = await imageCompression(file, {
            maxSizeMB: 1
        })
    } catch (error) {
        console.error(error)
        return {image: "", error: "Image compression failed."};
    }

    const storage = getStorage()

    const { data, error } = await storage.from(bucket).upload(path, file)

    if (error) {
        return { image: "", error: error.message };
    }

    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL!}/storage/v1/object/public/${bucket}/${data?.path}`;

    return { imageUrl, error: "" };
}