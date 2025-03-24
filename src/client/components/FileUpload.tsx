import { useCallback, useState } from 'react';

import { useFileUpload } from '../hooks/useFileUpload';

import { Dropzone, FileUploadList } from './';
import '../FileUpload.scss';

export const FileUpload = () => {
    const [isDragging, setIsDragging] = useState(false);
    const { fileStatuses, uploadFile } = useFileUpload();

    const handleDrop = useCallback(
        async (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setIsDragging(false);
            const files = Array.from(e.dataTransfer.files);
            await Promise.all(files.map(uploadFile));
        },
        [uploadFile]
    );

    const handleFileChange = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = Array.from(e.target.files || []);
            await Promise.all(files.map(uploadFile));
        },
        [uploadFile]
    );

    return (
        <div className="file-upload">
            <Dropzone
                title={'Drop files here or click to upload'}
                infoCopy={'Supported formats: PDF, Word, PowerPoint, Excel, etc.'}
                onDrop={handleDrop}
                onChange={handleFileChange}
                isDragging={isDragging}
                setIsDragging={setIsDragging}
            />
            <div className="file-upload__header">
                <h2 className="file-upload__header-title">Uploaded Files</h2>
            </div>
            <FileUploadList fileStatuses={fileStatuses} />
        </div>
    );
};
