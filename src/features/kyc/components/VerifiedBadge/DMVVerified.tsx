import { FC } from "react";
import { VerifiedBadge } from "./VerifiedBadge";

export const DMVVerified: FC = () => {
  return (
    <div className="flex items-center gap-2 justify-end">
      <VerifiedBadge
        icon="/public/hexagon-icon.svg"
        status="success"
        text="DMV Verified"
      />
    </div>
  );
};
