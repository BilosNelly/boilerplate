import classNames from 'classnames';
import { type ChangeEvent, type DragEvent, useCallback, useState } from 'react';

import '../FileUpload.scss';
import { ProgressBar } from './ProgressBar';

const CHUNK_SIZE = 1024 * 1024; // 1MB chunks

interface FileStatus {
    file: File;
    progress: number;
    status: 'pending' | 'uploading' | 'completed' | 'error';
    error?: string;
}

export const FileUpload = () => {
    const [fileStatuses, setFileStatuses] = useState<Record<string, FileStatus>>({});
    const [isDragging, setIsDragging] = useState(false);

    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

    const validateFile = (file: File): string | null => {
        if (file.size === 0) {
            return 'File is empty';
        }
        if (file.size > MAX_FILE_SIZE) {
            return 'File size exceeds 50MB limit';
        }
        return null;
    };

    const uploadFile = useCallback(
        async (file: File) => {
            const validationError = validateFile(file);
            if (validationError) {
                setFileStatuses((prev) => ({
                    ...prev,
                    [file.name]: {
                        file,
                        progress: 0,
                        status: 'error',
                        error: validationError,
                    },
                }));
                return;
            }

            if (fileStatuses[file.name]?.status === 'completed') {
                setFileStatuses((prev) => ({
                    ...prev,
                    [file.name]: {
                        ...prev[file.name],
                        status: 'error',
                        error: 'This file has already been uploaded',
                    },
                }));
                return;
            }

            setFileStatuses((prev) => ({
                ...prev,
                [file.name]: { file, progress: 0, status: 'uploading' },
            }));

            try {
                if (file.size <= CHUNK_SIZE) {
                    const formData = new FormData();
                    formData.append('file', file);

                    const response = await fetch('/api/upload-single', {
                        method: 'POST',
                        body: formData,
                    });

                    if (!response.ok) {
                        throw new Error('Upload failed');
                    }

                    setFileStatuses((prev) => ({
                        ...prev,
                        [file.name]: { ...prev[file.name], progress: 100, status: 'completed' },
                    }));
                } else {
                    const chunks = Math.ceil(file.size / CHUNK_SIZE);

                    for (let i = 0; i < chunks; i++) {
                        const chunk = file.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
                        const formData = new FormData();
                        formData.append('file', chunk, file.name);
                        formData.append('currentChunkIndex', i.toString());
                        formData.append('totalChunks', chunks.toString());

                        const response = await fetch('/api/upload-chunk', {
                            method: 'POST',
                            body: formData,
                        });

                        if (!response.ok) {
                            throw new Error('Chunk upload failed');
                        }

                        const progress = Math.round(((i + 1) / chunks) * 100);
                        setFileStatuses((prev) => ({
                            ...prev,
                            [file.name]: { ...prev[file.name], progress },
                        }));
                    }

                    setFileStatuses((prev) => ({
                        ...prev,
                        [file.name]: { ...prev[file.name], status: 'completed' },
                    }));
                }
            } catch (error) {
                setFileStatuses((prev) => ({
                    ...prev,
                    [file.name]: {
                        ...prev[file.name],
                        status: 'error',
                        error: error instanceof Error ? error.message : 'Upload failed',
                    },
                }));
            }
        },
        [fileStatuses]
    );

    const handleDrop = useCallback(
        async (e: DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setIsDragging(false);

            const files = Array.from(e.dataTransfer.files);
            await Promise.all(files.map(uploadFile));
        },
        [uploadFile]
    );

    const handleFileChange = useCallback(
        async (e: ChangeEvent<HTMLInputElement>) => {
            const files = Array.from(e.target.files || []);
            await Promise.all(files.map(uploadFile));
        },
        [uploadFile]
    );

    // const completedCount = Object.values(fileStatuses).filter((s) => s.status === 'completed').length;

    return (
        <div className="file-upload">
            <div
                role="button"
                tabIndex={0}
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={classNames('file-upload__dropzone', {
                    'file-upload__dropzone--dragging': isDragging,
                })}
            >
                <input type="file" id="fileInput" multiple className="file-upload__input" onChange={handleFileChange} />
                <label htmlFor="fileInput" className="file-upload__label">
                    <div className="file-upload__label-title">Drop files here or click to upload</div>
                    <div className="file-upload__label-hint">
                        Supported formats: PDF, Word, PowerPoint, Excel, and more
                    </div>
                </label>
            </div>

            <div className="file-upload__header">
                <h2 className="file-upload__header-title">Uploaded Files</h2>
                {/* <span className="file-upload__header-count">{completedCount} files uploaded</span> */}
            </div>

            <div className="file-upload__progress-list">
                {Object.entries(fileStatuses).map(([fileName, status]) => (
                    <ProgressBar
                        key={fileName}
                        fileName={fileName}
                        progress={status.progress}
                        status={status.status}
                        error={status.error}
                    />
                ))}
            </div>
        </div>
    );
};
