import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { FileUpload } from '../../components';

const mockUploadFile = vi.fn();
const mockFetchStoredFiles = vi.fn();

vi.mock('../../hooks/useFileUpload', () => ({
    useFileUpload: () => ({
        fileStatuses: {},
        uploadFile: mockUploadFile,
    }),
}));

vi.mock('../../hooks/useStoredFiles', () => ({
    useStoredFiles: () => ({
        storedFiles: [{ name: 'example.pdf', size: 2048 }],
        fetchStoredFiles: mockFetchStoredFiles,
    }),
}));

describe('FileUpload', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the dropzone and title', () => {
        render(<FileUpload />);
        expect(screen.getByText('Drop files here or click to upload')).toBeInTheDocument();
        expect(screen.getByText('Current status of files..')).toBeInTheDocument();
    });

    it('calls fetchStoredFiles on button click', () => {
        render(<FileUpload />);
        fireEvent.click(screen.getByText('Show uploaded files'));
        expect(mockFetchStoredFiles).toHaveBeenCalled();
    });

    it('displays stored files', () => {
        render(<FileUpload />);
        fireEvent.click(screen.getByText('Show uploaded files'));

        expect(screen.getByText('example.pdf')).toBeInTheDocument();
        expect(screen.getByText('2.00 KB')).toBeInTheDocument();
    });
});
