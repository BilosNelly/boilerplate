import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { ProgressBar } from '../../components';

describe('ProgressBar', () => {
    it('displays file name and progress correctly during upload', () => {
        render(<ProgressBar fileName="test.txt" progress={65} status="uploading" />);

        expect(screen.getByText('test.txt')).toBeInTheDocument();
        expect(screen.getByText('65%')).toBeInTheDocument();
        const fill = document.querySelector('.progress-bar__fill') as HTMLElement;
        expect(fill.style.width).toBe('65%');
    });

    it('displays duplicate upload error with proper styling', () => {
        render(
            <ProgressBar
                fileName="duplicate.txt"
                progress={100}
                status="error"
                error="This file has already been uploaded"
            />
        );

        expect(screen.getByText('This file has already been uploaded')).toBeInTheDocument();
        const fill = document.querySelector('.progress-bar__fill--duplicate');
        const errorMsg = document.querySelector('.progress-bar__error-message--duplicate');
        expect(fill).toBeTruthy();
        expect(errorMsg).toBeTruthy();
    });
});
