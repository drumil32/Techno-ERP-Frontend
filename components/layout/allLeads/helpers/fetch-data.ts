export const fetchLeads = async ({ queryKey }: any) => {
    const [, params] = queryKey;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${apiUrl}/crm/fetch-data`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
        credentials: 'include'
    });
    if (!res.ok) throw new Error('Network response was not ok');
    return res.json();
};

export const fetchLeadsAnalytics = async ({ queryKey }: any) => {
    const [, params] = queryKey;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${apiUrl}/crm/analytics`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
        credentials: 'include'
    });
    if (!res.ok) throw new Error('Network response was not ok');
    return res.json();
};

export const fetchAssignedToDropdown = async ({ queryKey }: any) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${apiUrl}/user/fetch-dropdown?moduleName=MARKETING`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    });
    if (!res.ok) throw new Error('Network response was not ok');
    return res.json();

}