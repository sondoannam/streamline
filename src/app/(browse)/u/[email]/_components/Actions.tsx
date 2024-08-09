"use client";

import React, { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { onFollow, onUnfollow } from "@/actions/follow";
import { toast } from "@/components/ui/use-toast";

interface ActionsProps {
  isFollowing: boolean;
  userId: string;
  username: string;
}

const Actions = ({ isFollowing, userId, username }: ActionsProps) => {
  const [isPending, startTransition] = useTransition();

  const handleFollow = () => {
    startTransition(() => {
      onFollow(userId)
        .then(() =>
          toast({
            variant: "success",
            title: `Đã trở thành người theo dõi của ${username}`,
          })
        )
        .catch(() => toast({ variant: "destructive", title: "Có lỗi xảy ra" }));
    });
  };

  const handleUnfollow = () => {
    startTransition(() => {
      onUnfollow(userId).catch(() =>
        toast({ variant: "destructive", title: "Có lỗi xảy ra" })
      );
    });
  };

  const onClick = () => {
    if (isFollowing) {
      handleUnfollow();
    } else {
      handleFollow();
    }
  };

  return (
    <Button variant="primary" disabled={isPending} onClick={onClick}>
      {isFollowing ? "Đang theo dõi" : "Theo dõi"}
    </Button>
  );
};

export default Actions;
