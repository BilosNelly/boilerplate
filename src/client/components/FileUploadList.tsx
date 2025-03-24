import React from 'react';

import { ProgressBar } from './';

interface FileStatus {
    file: File;
    progress: number;
    status: 'pending' | 'uploading' | 'completed' | 'error';
    error?: string;
}

interface FileUploadListProps {
    fileStatuses: Record<string, FileStatus>;
}

export const FileUploadList: React.FC<FileUploadListProps> = ({ fileStatuses }) => {
    return (
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
    );
};
