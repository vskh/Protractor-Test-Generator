module ExtensionApp.Services {

    /** Interface for storage service */
    export interface StorageService {
        /** Store provided string data as file with given name */
        StoreFile(fileName: string, fileData: any, fileType?: string);
    }

    /** StorageService that downloads file to user machine */
    export class DownloadStorageService implements StorageService {
        /** Dependency injection */
        static $inject: string[] = ['chrome'];

        constructor(private chrome: any) {
        }

        StoreFile(fileName: string, fileData: string, fileType: string = "text/plain") {
            var fileBlob = new Blob([fileData], {type: fileType});
            var fileUrl = URL.createObjectURL(fileBlob);

            this.chrome.downloads.download({
                url: fileUrl,
                // Provide initial name to be tests.js
                filename: fileName,
                conflictAction: "prompt",
                // Open save as dialog
                saveAs: true,
            }, function (downloadId) {
                console.log("Downloaded item with ID", downloadId);
            });
        }

    }
}