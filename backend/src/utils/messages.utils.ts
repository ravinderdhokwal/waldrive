export class AUTH_MESSAGE {
    // Error Messages
    static readonly ALL_FIELDS_REQUIRED = "All fields required";
    static readonly USER_ALREADY_EXISTS = "User already exists. Try different email.";
    static readonly USER_NOT_FOUND = "User not found.";
    static readonly INVALID_CREDENTIALS = "Invalid credentials.";
    static readonly UNAUTHORIZED = "Unauthorized access.";

    // Success Messages
    static readonly USER_SIGNED_UP = "User signed up successfully";
}

export class FOLDER_MESSAGE {
    // Error Messages
    static readonly FOLDER_NAME_REQUIRED = "Folder name is required.";
    static readonly FOLDER_ALREADY_EXISTS = "Folder with the same name already exists.";
    static readonly FOLDER_NOT_FOUND = "Folder not found.";
    static readonly UNAUTHORIZED_ACCESS = "Unauthorized access to folder.";

    // Success Messages
    static readonly FOLDER_CREATED = "Folder created successfully.";
    static readonly FOLDERS_FETCHED = "Folders fetched successfully.";
    static readonly FOLDER_RENAMED = "Folder renamed successfully.";
    static readonly FOLDER_DELETED = "Folder deleted successfully.";
}