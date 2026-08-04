import React from "react";
import { useMantineColorScheme } from "@mantine/core";
import { useLogoAssets } from "@app/hooks/useLogoAssets";

interface WordmarkProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  alt?: string;
  muted?: boolean;
}

// export function Wordmark({ alt = "", muted = false, ...props }: WordmarkProps) {
//   const { colorScheme } = useMantineColorScheme();
//   const isDark = colorScheme === "dark";
//   const { wordmark } = useLogoAssets();

//   // light: black text (standard) or grey text (muted)
//   // dark:  white text for both variants
//   const src = isDark ? wordmark.white : muted ? wordmark.grey : wordmark.black;

//   return <img src={src} alt={alt} {...props} />;
// }

export function Wordmark({ alt = "", ...props }: WordmarkProps) {
  return (
    <img
      src="/classic-logo/pocketoffice-logo.png"
      alt={alt}
      style={{
        height: "42px",
        width: "auto",
      }}
      {...props}
    />
  );
}
