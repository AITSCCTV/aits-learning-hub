import { LocalizedText } from "~/components/LocalizedText";
export const FileUploadLoading = () => {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white">
      <p className="body-sm text-neutral-950">
        <LocalizedText textKey="interface.uploading" />
      </p>
      <p className="details text-neutral-600">
        <LocalizedText textKey="interface.uploadWait" />
      </p>
    </div>
  );
};
