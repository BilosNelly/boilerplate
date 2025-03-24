interface StoredFile {
    name: string;
    size: number;
}

interface GetFilesResponse {
    files: StoredFile[];
}

export async function getFiles(): Promise<StoredFile[]> {
    const response = await fetch('/api/files');

    if (!response.ok) {
        throw new Error('Failed to fetch files');
    }

    const data = (await response.json()) as GetFilesResponse;
    return data.files;
}
