import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../../api', () => {
    return {
        uploadSingleFile: vi.fn(),
        uploadChunkFiles: vi.fn(),
    };
});

import { uploadSingleFile, uploadChunkFiles } from '../../api';
import { useFileUpload } from '../../hooks/useFileUpload';

describe('useFileUpload', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns error for empty file', async () => {
        const file = new File([], 'empty.txt');
        const { result } = renderHook(() => useFileUpload());

        await act(() => result.current.uploadFile(file));
        expect(result.current.fileStatuses['empty.txt'].error).toBe('File is empty');
    });

    it('uploads small file using uploadSingleFile', async () => {
        const file = new File(['small'], 'single.txt');
        const { result } = renderHook(() => useFileUpload());

        await act(() => result.current.uploadFile(file));
        expect(uploadSingleFile).toHaveBeenCalledWith(file);
        expect(result.current.fileStatuses['single.txt'].status).toBe('completed');
    });

    it('uploads large file in chunks using uploadChunkFiles', async () => {
        const size = 3 * 1024 * 1024;
        const content = new Uint8Array(size);
        const file = new File([content], 'chunked.txt');

        const { result } = renderHook(() => useFileUpload());

        await act(() => result.current.uploadFile(file));
        expect(uploadChunkFiles).toHaveBeenCalled();
        expect(result.current.fileStatuses['chunked.txt'].status).toBe('completed');
    });

    it('sets error on upload failure', async () => {
        const file = new File(['fail'], 'fail.txt');
        (uploadSingleFile as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Upload failed'));

        const { result } = renderHook(() => useFileUpload());

        await act(() => result.current.uploadFile(file));
        expect(result.current.fileStatuses['fail.txt'].status).toBe('error');
        expect(result.current.fileStatuses['fail.txt'].error).toBe('Upload failed');
    });
});
