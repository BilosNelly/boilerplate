import { useState } from 'react';

import { getFiles } from '../api';

export interface StoredFile {
    name: string;
    size: number;
}

export function useStoredFiles() {
    const [storedFiles, setStoredFiles] = useState<StoredFile[]>([]);

    const fetchStoredFiles = async () => {
        try {
            const files = await getFiles();
            setStoredFiles(files);
        } catch (error) {
            console.error('Failed to fetch files:', error);
        }
    };

    return { storedFiles, fetchStoredFiles };
}
