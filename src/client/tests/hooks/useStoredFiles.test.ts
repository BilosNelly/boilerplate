import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { getFiles } from '../../api';
import { useStoredFiles } from '../../hooks/useStoredFiles';

vi.mock('../../api', () => ({
    getFiles: vi.fn(),
}));

const mockedFiles = [
    { name: 'resume.pdf', size: 1234 },
    { name: 'invoice.xlsx', size: 4567 },
];

describe('useStoredFiles', () => {
    it('fetches and sets stored files', async () => {
        (getFiles as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockedFiles);

        const { result } = renderHook(() => useStoredFiles());

        await act(() => result.current.fetchStoredFiles());

        expect(result.current.storedFiles).toEqual(mockedFiles);
        expect(getFiles).toHaveBeenCalled();
    });
});
