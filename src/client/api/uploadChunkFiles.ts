const CHUNK_SIZE = 1024 * 1024; // 1MB

export async function uploadChunkFiles(file: File, chunkIndex: number, totalChunks: number) {
    const chunk = file.slice(chunkIndex * CHUNK_SIZE, (chunkIndex + 1) * CHUNK_SIZE);
    const formData = new FormData();
    formData.append('file', chunk, file.name);
    formData.append('currentChunkIndex', chunkIndex.toString());
    formData.append('totalChunks', totalChunks.toString());

    const response = await fetch('/api/upload-chunk', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`Chunk ${chunkIndex + 1} failed`);
    }
}
