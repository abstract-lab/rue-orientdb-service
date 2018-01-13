export class Version {
    private static readonly MAJOR_VERSION: string = '1';
    private static readonly MINOR_VERSION: string = '0';
    private static readonly BUILD_NUMBER: string = '%build_number%';

    public static VersionString() {
        return `${Version.MAJOR_VERSION}.${Version.MINOR_VERSION}.${Version.BUILD_NUMBER}`;
    }
}