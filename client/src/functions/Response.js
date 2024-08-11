export async function getResponseContent(response) {
    try {
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error('Failed to parse response JSON');
    }
}

export class RequestError extends Error {
    constructor(message, status, content) {
        super(message);
        this.status = status;
        this.content = content;
    }
}