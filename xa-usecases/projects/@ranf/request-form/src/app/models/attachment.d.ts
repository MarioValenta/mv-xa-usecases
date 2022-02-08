export interface Attachment {
    data: string; // base64 representation of the file
    name: string; // name of the file
    type?: string; // MIME type of the file
}

