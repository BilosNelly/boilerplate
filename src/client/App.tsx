import { type ReactElement } from 'react';

import { FileUpload } from './components';

export const App = (): ReactElement => {
    return (
        <div className="min-h-screen relative">
            {/* <img
                src="https://cdn-assets-eu.frontify.com/s3/frontify-enterprise-files-eu/eyJwYXRoIjoid2VhcmVcL2FjY291bnRzXC82ZVwvNDAwMDM4OFwvcHJvamVjdHNcLzk4NFwvYXNzZXRzXC9iOFwvMTE1MjY1XC8xMjYwMTU0YzFhYmVmMDVjNjZlY2Q2MDdmMTRhZTkxNS0xNjM4MjU4MjQwLmpwZyJ9:weare:_kpZgwnGPTxOhYxIyfS1MhuZmxGrFCzP6ZW6dc-F6BQ?width=2400"
                alt="background image"
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover object-top"
            /> */}
            <div className="relative z-10 container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">File Upload</h1>
                <FileUpload />
            </div>
        </div>
    );
};
