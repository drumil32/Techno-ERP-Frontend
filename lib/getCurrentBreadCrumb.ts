export const getCurrentBreadCrumb = (url: string) => {
    const segments = url.split("/");
    const value = segments[segments.length - 1];
    return value;
}