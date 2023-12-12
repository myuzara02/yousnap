import React, { useCallback, useState } from 'react'
import { FileWithPath, useDropzone } from 'react-dropzone'
import { Button } from '../ui/button'

type FileUploaderProps = {
    fieldChange: (FILE: File[]) => void,
    mediaUrl: string
}

const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
    const [file, setFile] = useState<File[]>([])
    const [fileUrl, setFileUrl] = useState('')

    const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
        setFile(acceptedFiles)
        fieldChange(acceptedFiles)
        setFileUrl(URL.createObjectURL(acceptedFiles[0]))
    }, []
    )
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpeg', '.jpg', '.svg']
        }
    })

    // ========= UI Render ==========
    return (
        <div {...getRootProps()} className='flex flex-col flex-center bg-dark-3 rounded-xl cursor-pointer'>
            <input {...getInputProps()} className='cursor-pointer' />
            {
                fileUrl ? (
                    <>
                        <div className='flex flex-1 w-full justify-center p-4 lg:p-10'>
                            <img
                                src={fileUrl}
                                alt="image"
                            />
                        </div>
                        <p className='file_uploader-label'>Click or drag photo to replace</p>
                    </>
                ) : (
                    <div className='file_uploader-box'>
                        <img
                            src="/assets/icons/file-upload.svg"
                            alt="File Upload"
                            width={96}
                            height={77}
                        />
                        <h3 className='base-medium text-light-2 mb-2 mt-6'>Drag photo here</h3>
                        <p className='text-light-4 small-regular mb-6'>SVG, PNG, JPG</p>

                        <Button className='shad-button_dark_4'>Select from computer</Button>
                    </div>

                )

            }
        </div>
    )
}

export default FileUploader