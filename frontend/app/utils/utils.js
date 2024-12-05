export default function getUUID() {
    const cookies = document.cookie.split("; ").find((row) => row.startsWith("user_uuid="));
    if (!cookies) {
        return null;
    }
    return document.cookie
    .split("; ")
    .find((row) => row.startsWith("user_uuid="))
    .substring("user_uuid=".length);
}
