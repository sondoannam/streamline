import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

import { LiveBadge } from "./LiveBadge";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";

const avatarSizes = cva("", {
  variants: {
    size: {
      default: "w-8 h-8",
      lg: "w-14 h-14",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface UserAvatarSkeletonProps extends VariantProps<typeof avatarSizes> {}

export const UserAvatarSkeleton = ({ size }: UserAvatarSkeletonProps) => {
  return <Skeleton className={cn("rounded-full", avatarSizes({ size }))} />;
};

interface UserAvatarProps extends VariantProps<typeof avatarSizes> {
  imageUrl: string;
  username: string;
  isLive?: boolean;
  showBadge?: boolean;
}

export const UserAvatar = ({
  imageUrl,
  username,
  isLive,
  showBadge,
  size,
}: UserAvatarProps) => {
  const canShowBadge = isLive && showBadge;

  return (
    <div className="relative">
      <Avatar
        className={cn(
          isLive && "ring-2 ring-rose-500 border border-background bg-white",
          avatarSizes({ size })
        )}
      >
        <AvatarImage src={imageUrl} className="object-cover" />
        <AvatarFallback>
          {username[0]}
          {username[username.length - 1]}
        </AvatarFallback>
        {canShowBadge && (
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
            <LiveBadge />
          </div>
        )}
      </Avatar>
    </div>
  );
};
