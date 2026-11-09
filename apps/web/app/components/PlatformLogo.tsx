import { memo } from "react";

import { usePlatformSimpleLogo } from "~/api/queries";
import { useGlobalSettings } from "~/api/queries/useGlobalSettings";
import { Icon } from "~/components/Icon";
import { usePlatformLogo } from "~/hooks/usePlatformLogo";
import { cn } from "~/lib/utils";

interface PlatformLogoProps {
  className?: string;
  variant?: "full" | "signet";
  alt?: string;
}

export const PlatformLogo = memo(
  ({ className, variant = "full", alt = "Platform Logo" }: PlatformLogoProps) => {
    const { data: customLogoUrl, isLoading } = usePlatformLogo();
    const { data: globalSettings } = useGlobalSettings();
    const { data: customSimpleLogoUrl, isLoading: isSimpleLogoLoading } = usePlatformSimpleLogo();

    if (isLoading) {
      return <div className={className}></div>;
    }

    if (customLogoUrl && !isLoading && variant === "full") {
      return (
        <img
          src={customLogoUrl}
          alt={alt}
          className={cn("object-contain", className)}
          loading="eager"
          decoding="async"
        />
      );
    }

    if (customSimpleLogoUrl && !isSimpleLogoLoading && variant === "signet") {
      return (
        <img
          src={customSimpleLogoUrl}
          alt={alt}
          className={cn("object-contain", className)}
          loading="eager"
          decoding="async"
        />
      );
    }

    if (variant === "signet") {
      if (globalSettings?.companyInformation?.companyShortName === "AITS") {
        return <span className={cn("font-bold text-blue-700", className)}>AITS</span>;
      }
      return <Icon name="AppSignet" className={className} />;
    }

    if (globalSettings?.companyInformation?.companyShortName === "AITS") {
      return (
        <span
          className={cn("inline-flex items-center gap-2 font-semibold text-slate-800", className)}
        >
          <span className="rounded-lg bg-blue-700 px-3 py-2 text-white">AITS</span>
          <span className="text-sm">Learning Hub</span>
        </span>
      );
    }

    return <Icon name="AppLogo" className={className} />;
  },
);

PlatformLogo.displayName = "PlatformLogo";
