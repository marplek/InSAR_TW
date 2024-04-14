interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_CESIUM_ION_ACCESS_TOKEN: string;

}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}