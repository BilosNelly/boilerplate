// components/Dropzone.tsx
import classNames from 'classnames';
import React, { type ChangeEvent, type DragEvent } from 'react';

interface DropzoneProps {
    onDrop: (e: DragEvent<HTMLDivElement>) => void;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    isDragging: boolean;
    setIsDragging: (dragging: boolean) => void;
}

export const Dropzone: React.FC<DropzoneProps> = ({ onDrop, onChange, isDragging, setIsDragging }) => (
    <div
        role="button"
        tabIndex={0}
        onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={classNames('file-upload__dropzone', {
            'file-upload__dropzone--dragging': isDragging,
        })}
    >
        <input type="file" id="fileInput" multiple className="file-upload__input" onChange={onChange} />
        <label htmlFor="fileInput" className="file-upload__label">
            <div className="file-upload__label-title">Drop files here or click to upload</div>
            <div className="file-upload__label-hint">Supported formats: PDF, Word, PowerPoint, Excel, and more</div>
        </label>
    </div>
);
