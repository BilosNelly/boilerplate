import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';

import * as api from '../../api';
import { useFileUpload } from '../../hooks/useFileUpload';

function typedMock<T extends (...args: any[]) => any>(fn: T): Mock<ReturnType<T>, Parameters<T>> {
    return fn as unknown as Mock<ReturnType<T>, Parameters<T>>;
}

vi.mock('../../api', () => ({
    uploadSingleFile: vi.fn(() => Promise.resolve()),
    uploadChunkFiles: vi.fn(() => Promise.resolve()),
}));

const uploadSingleFile = typedMock(api.uploadSingleFile);
const uploadChunkFiles = typedMock(api.uploadChunkFiles);

describe('useFileUpload', () => {
    beforeEach(() => {
        uploadSingleFile.mockClear();
        uploadChunkFiles.mockClear();
    });

    it('returns validation error for empty file', async () => {
        const file = new File([], 'empty.txt');
        const { result } = renderHook(() => useFileUpload());

        await act(() => result.current.uploadFile(file));
        expect(result.current.fileStatuses['empty.txt'].error).toBe('File is empty');
    });

    it('returns validation error for oversized file', async () => {
        const largeContent = new ArrayBuffer(55 * 1024 * 1024); // 55MB
        const file = new File([largeContent], 'big.txt');
        const { result } = renderHook(() => useFileUpload());

        await act(() => result.current.uploadFile(file));
        expect(result.current.fileStatuses['big.txt'].error).toBe('File size exceeds 50MB');
    });

    it('uploads a small file using uploadSingleFile()', async () => {
        const file = new File(['small content'], 'small.txt');
        const { result } = renderHook(() => useFileUpload());

        await act(() => result.current.uploadFile(file));

        expect(uploadSingleFile).toHaveBeenCalledWith(file);
        expect(result.current.fileStatuses['small.txt'].status).toBe('completed');
        expect(result.current.fileStatuses['small.txt'].progress).toBe(100);
    });

    it('uploads large file in chunks using uploadChunkFiles()', async () => {
        const size = 3 * 1024 * 1024; // 3MB
        const content = new Uint8Array(size);
        const file = new File([content], 'large.txt');
        const { result } = renderHook(() => useFileUpload());

        await act(() => result.current.uploadFile(file));

        expect(uploadChunkFiles).toHaveBeenCalledTimes(3);
        expect(result.current.fileStatuses['large.txt'].status).toBe('completed');
    });

    it('should not re-upload an already completed file', async () => {
        const file = new File(['content'], 'duplicate.txt');
        const { result } = renderHook(() => useFileUpload());

        await act(() => result.current.uploadFile(file));
        await act(() => result.current.uploadFile(file));

        expect(result.current.fileStatuses['duplicate.txt'].error).toBe('This file has already been uploaded');
    });

    it('handles upload failure and sets error', async () => {
        const file = new File(['broken'], 'fail.txt');
        uploadSingleFile.mockRejectedValueOnce(new Error('Failed'));

        const { result } = renderHook(() => useFileUpload());

        await act(() => result.current.uploadFile(file));

        expect(result.current.fileStatuses['fail.txt'].status).toBe('error');
        expect(result.current.fileStatuses['fail.txt'].error).toBe('Failed');
    });
});
