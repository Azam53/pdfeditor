import { useEffect, useRef, useState } from "react";
import { useFileHandler } from "@app/hooks/useFileHandler";
import { useNavigationActions } from "@app/contexts/NavigationContext";

const FILE_URL_PARAMETER = "fileUrl";
const SAVE_URL_PARAMETER = "saveUrl";
const FILE_NAME_PARAMETER = "fileName";
const READ_ONLY_PARAMETER = "readOnly";

export default function ExternalPdfLoader() {
  const { addFiles } = useFileHandler();
  const { actions: navigationActions } = useNavigationActions();
  const hasStarted = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hasStarted.current) return;

    const parameters = new URLSearchParams(window.location.search);
    const fileUrl = parameters.get(FILE_URL_PARAMETER);
    if (!fileUrl) return;

    hasStarted.current = true;
    const saveUrl = parameters.get(SAVE_URL_PARAMETER);
    const readOnly = parameters.get(READ_ONLY_PARAMETER) === "true";

    if (saveUrl && !readOnly) {
      sessionStorage.setItem("pdf_editor_save_url", saveUrl);
    } else {
      sessionStorage.removeItem("pdf_editor_save_url");
    }

    const loadPdf = async () => {
      try {
        const response = await fetch(fileUrl, {
          method: "GET",
          mode: "cors",
          credentials: "omit",
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error(`PDF request failed with status ${response.status}`);
        }

        const blob = await response.blob();
        if (blob.type && blob.type !== "application/pdf") {
          throw new Error("The supplied file is not a PDF");
        }

        const fileName = parameters.get(FILE_NAME_PARAMETER) || "document.pdf";
        const pdf = new File([blob], fileName, {
          type: "application/pdf",
          lastModified: Date.now(),
        });

        await addFiles([pdf], { selectFiles: true });
        navigationActions.setToolAndWorkbench(null, "viewer");
      } catch (loadError) {
        console.error("[ExternalPdfLoader] Unable to load PDF", loadError);
        setError(
          loadError instanceof Error
            ? loadError.message
            : "The PDF could not be loaded.",
        );
      }
    };

    void loadPdf();
  }, [addFiles, navigationActions]);

  if (!error) return null;

  return (
    <div
      role="alert"
      style={{
        position: "fixed",
        inset: "1rem 1rem auto 1rem",
        zIndex: 10000,
        padding: "0.75rem 1rem",
        color: "#7f1d1d",
        background: "#fee2e2",
        border: "1px solid #fecaca",
        borderRadius: "0.5rem",
      }}
    >
      Unable to open this PDF: {error}
    </div>
  );
}
