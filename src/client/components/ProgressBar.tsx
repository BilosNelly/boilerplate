import React from 'react';
import '../styles';

interface ProgressBarProps {
    fileName: string;
    progress: number;
    status: 'pending' | 'uploading' | 'completed' | 'error';
    error?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ fileName, progress, status, error }) => {
    const isError = status === 'error';
    const isDuplicate = error?.includes('already been uploaded');

    return (
        <div className="progress-bar">
            <div className="progress-bar__header">
                <span className="progress-bar__filename">{fileName}</span>
                <span className="progress-bar__percent">{status === 'completed' ? '100%' : `${progress}%`}</span>
            </div>

            <div className="progress-bar__track">
                <div
                    className={`progress-bar__fill ${
                        isError ? (isDuplicate ? 'progress-bar__fill--duplicate' : 'progress-bar__fill--error') : ''
                    }`}
                    style={{ width: `${progress}%` }}
                />
            </div>

            {error && (
                <div
                    className={`progress-bar__error-message ${
                        isDuplicate ? 'progress-bar__error-message--duplicate' : ''
                    }`}
                >
                    {error}
                </div>
            )}
        </div>
    );
};
