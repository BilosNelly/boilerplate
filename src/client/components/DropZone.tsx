import classNames from 'classnames';
import React, { type ChangeEvent, type DragEvent } from 'react';

interface DropzoneProps {
    title: string;
    infoCopy: string;
    isDragging: boolean;
    onDrop: (e: DragEvent<HTMLDivElement>) => void;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    setIsDragging: (dragging: boolean) => void;
}

export const Dropzone: React.FC<DropzoneProps> = ({ title, infoCopy, isDragging, onDrop, onChange, setIsDragging }) => (
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
            <div className="file-upload__label-title">{title}</div>
            <div className="file-upload__label-hint">{infoCopy}</div>
        </label>
    </div>
);
