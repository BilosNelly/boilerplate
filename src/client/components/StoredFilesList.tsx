import React from 'react';

import { type StoredFile } from '../hooks/useStoredFiles';

interface Props {
    files: StoredFile[];
}

export const StoredFilesList: React.FC<Props> = ({ files }) => (
    <ul className="stored-files__list">
        {files.map((file) => (
            <li key={file.name} className="stored-files__item">
                <span className="stored-files__filename">{file.name}</span>
                <span className="stored-files__size">{(file.size / 1024).toFixed(2)} KB</span>
            </li>
        ))}
    </ul>
);
