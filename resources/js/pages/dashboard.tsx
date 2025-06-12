import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

type DeploymentStatus = 'running' | 'pending' | 'failed';

type Deployment = {
    name: string;
    status: DeploymentStatus;
};

const statusColor: Record<DeploymentStatus, string> = {
    running: 'bg-green-300 dark:bg-green-700',
    pending: 'bg-yellow-300 dark:bg-yellow-700',
    failed: 'bg-red-300 dark:bg-red-700',
};

const deployments: Deployment[] = [
    { name: 'myapp-1', status: 'running' },
    { name: 'cool-api', status: 'pending' },
    { name: 'legacy-api', status: 'failed' },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Upload card */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {deployments.map((app, i) => (
                        <div
                            key={i}
                            className="relative flex aspect-video flex-col justify-between overflow-hidden rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border"
                        >
                            <div className="text-lg font-semibold">{app.name}</div>
                            <span className={`w-fit rounded-full px-2 py-1 text-xs ${statusColor[app.status]}`}>{app.status}</span>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
