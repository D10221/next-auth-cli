import path from "path"
/** */
export default async function importModels(modulePath) {
    const _module = await import(
        modulePath.startsWith(".")
            ? path.join(process.cwd(), modulePath)
            : modulePath
    );
    return _module.default || _module;
}
