import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Upload',
        href: '/upload',
    },
];

export default function Upload() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Upload" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Log / Upload section */}
                <div className="relative min-h-[40vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                    <h2 className="mb-4 text-xl font-semibold">Upload Dockerfile</h2>
                    <form className="space-y-4">
                        <input type="file" className="block w-full rounded border border-gray-300 p-2" />
                        <button type="submit" className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
                            Upload
                        </button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
