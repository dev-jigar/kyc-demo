import { JSX } from "react";

export type BadgeStatus = keyof typeof statusColors;

export type VerifiedBadgeProps = {
  text?: string;
  status?: BadgeStatus;
  icon?: string | JSX.Element;
  showIcon?: boolean;
  className?: string;
  textClassName?: string;
  iconClassName?: string;
};

const statusColors = {
  success: "bg-primary-100 text-primary-500",
  error: "bg-red-100 text-red-600",
  warning: "bg-orange-100 text-orange-600",
  info: "bg-blue-50 text-blue-600",
  neutral: "bg-gray-100 text-gray-600",
  secondary: "bg-primary-500 text-white",
  matchesFound: "bg-[#FEF3E7] text-Marmalade",
  na: "bg-customGray-50 text-primaryBlack-500",
  gold: "bg-customGold-500/15 text-customGold-500",
  orange: "bg-[#FF800026] text-Marmalade",
};

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  icon,
  text,
  status = "success",
  className = "",
  textClassName = "",
  iconClassName = "",
}) => {
  const badgeClass = statusColors[status] || statusColors.neutral;

  return (
    <div
      className={`flex justify-center items-center gap-1 md:gap-2 px-1.5 md:px-4 py-1.5 rounded-md w-fit capitalize ${badgeClass} ${className}`}
    >
      {typeof icon === "string" ? (
        <img src={icon} alt={status} className={`w-4 h-4 ${iconClassName}`} />
      ) : (
        icon
      )}
      {text && (
        <span
          className={`text-xs flex-shrink-0 md:text-base whitespace-nowrap ${textClassName}`}
        >
          {text}
        </span>
      )}
    </div>
  );
};
