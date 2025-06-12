import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Upload',
        href: '/upload',
    },
];

export default function Upload() {
    const { auth } = usePage<SharedData>().props;
    const [registryUrl, setRegistryUrl] = useState('gcr.io/clover-460413/backend:latest');
    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            console.log(
                JSON.stringify({
                    user_id: auth.user.id,
                    registry_url: registryUrl,
                }),
            );

            const response = await fetch('http://localhost:9000/deploy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: auth.user.id,
                    registry_url: registryUrl,
                }),
            });

            if (!response.ok) {
                const text = await response.text();
                console.error('Upload failed:', text);
            } else {
                console.log('Upload successful');
            }
        } catch (err) {
            console.error('Error uploading file:', err);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Deploy" />
            <h1>{auth.user.name}</h1>
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Log / Upload section */}
                <div className="relative min-h-[40vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                    <h2 className="mb-4 text-xl font-semibold">Submit Image</h2>
                    <form onSubmit={submit} className="space-y-4">
                        <input
                            type="text"
                            placeholder="my-registry.com/user/app"
                            onChange={(e) => setRegistryUrl(e.target.value)}
                            value={registryUrl}
                            className="block w-full rounded border border-gray-300 p-2"
                        />
                        <button type="submit" className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
                            Deploy
                        </button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
