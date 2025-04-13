export function formatApplicationStatus(status: string | undefined | null): string {
    if (!status || typeof status !== 'string') {
        return 'Unknown'; 
    }

    const match = status.match(/^Step_(\d+)$/);

    if (match && match[1]) {
        return `Step ${match[1]}`; 
    }

    return status;
}
