import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { Dropzone } from '../../components';

describe('Dropzone', () => {
    const title = 'Drop files here or click to upload';
    const infoCopy = 'Supported formats: PDF, Word, Excel';

    it('renders title and info text', () => {
        render(
            <Dropzone
                title={title}
                infoCopy={infoCopy}
                isDragging={false}
                onDrop={vi.fn()}
                onChange={vi.fn()}
                setIsDragging={vi.fn()}
            />
        );

        expect(screen.getByText(title)).toBeInTheDocument();
        expect(screen.getByText(infoCopy)).toBeInTheDocument();
    });

    it('sets isDragging to true on dragOver', () => {
        const setIsDragging = vi.fn();
        render(
            <Dropzone
                title={title}
                infoCopy={infoCopy}
                isDragging={false}
                onDrop={vi.fn()}
                onChange={vi.fn()}
                setIsDragging={setIsDragging}
            />
        );

        fireEvent.dragOver(screen.getByRole('button'));
        expect(setIsDragging).toHaveBeenCalledWith(true);
    });
});
