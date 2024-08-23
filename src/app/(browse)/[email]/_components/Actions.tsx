"use client";

import React, { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { onFollow, onUnfollow } from "@/actions/follow";
import { toast } from "@/components/ui/use-toast";
import { onBlock, onUnblock } from "@/actions/block";

interface ActionsProps {
  isFollowing: boolean;
  isBlocked: boolean;
  userId: string;
  username: string;
}

const Actions = ({
  isFollowing,
  isBlocked,
  userId,
  username,
}: ActionsProps) => {
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

  const onClickFollowing = () => {
    if (isFollowing) {
      handleUnfollow();
    } else {
      handleFollow();
    }
  };

  const handleBlock = () => {
    startTransition(() => {
      onBlock(userId)
        .then(() => toast({ variant: "success", title: `Đã chặn ${username}` }))
        .catch(() => toast({ variant: "destructive", title: "Có lỗi xảy ra" }));
    });
  };

  const handleUnblock = () => {
    startTransition(() => {
      onUnblock(userId).catch(() =>
        toast({ variant: "destructive", title: "Có lỗi xảy ra" })
      );
    });
  };

  const onClickBlock = () => {
    if (isBlocked) {
      handleUnblock();
    } else {
      handleBlock();
    }
  };

  return (
    <>
      <Button variant="primary" disabled={isPending} onClick={onClickFollowing}>
        {isFollowing ? "Đang theo dõi" : "Theo dõi"}
      </Button>
      <Button disabled={isPending
        
      } onClick={onClickBlock}>
        {isBlocked ? "Bỏ chặn" : "Chặn"}
      </Button>
    </>
  );
};

export default Actions;
