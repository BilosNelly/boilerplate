import { useCallback, useState } from 'react';

import { uploadSingleFile, uploadChunkFiles } from '../api';

const CHUNK_SIZE = 1024 * 1024; // 1MB
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export interface FileStatus {
    file: File;
    progress: number;
    status: 'pending' | 'uploading' | 'completed' | 'error';
    error?: string;
}

export function useFileUpload() {
    const [fileStatuses, setFileStatuses] = useState<Record<string, FileStatus>>({});

    const setStatus = (fileName: string, status: Partial<FileStatus>) => {
        setFileStatuses((prev) => ({
            ...prev,
            [fileName]: { ...prev[fileName], ...status },
        }));
    };

    const validateFile = (file: File): string | null => {
        if (file.size === 0) {
            return 'File is empty';
        }
        if (file.size > MAX_FILE_SIZE) {
            return 'File size exceeds 50MB';
        }
        return null;
    };

    const uploadFile = useCallback(
        async (file: File) => {
            const fileName = file.name;

            const isAlreadyUploaded = fileStatuses[fileName]?.status === 'completed';

            const validationError = validateFile(file);
            if (validationError) {
                setStatus(fileName, { file, progress: 0, status: 'error', error: validationError });
                return;
            }

            if (isAlreadyUploaded) {
                setStatus(fileName, {
                    file,
                    progress: 100,
                    status: 'error',
                    error: 'This file has already been uploaded',
                });
                return;
            }

            setStatus(fileName, { file, progress: 0, status: 'uploading' });

            try {
                if (file.size <= CHUNK_SIZE) {
                    await uploadSingleFile(file);
                    setStatus(fileName, { progress: 100, status: 'completed' });
                } else {
                    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

                    for (let i = 0; i < totalChunks; i++) {
                        await uploadChunkFiles(file, i, totalChunks);
                        const progress = Math.round(((i + 1) / totalChunks) * 100);
                        setStatus(fileName, { progress });
                    }

                    setStatus(fileName, { status: 'completed' });
                }
            } catch (error) {
                const errorMsg = error instanceof Error ? error.message : 'Upload failed';
                setStatus(fileName, { status: 'error', error: errorMsg });
            }
        },
        [fileStatuses]
    );

    return { fileStatuses, uploadFile };
}
