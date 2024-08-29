"use client";

import React, { useTransition } from "react";

import { Switch } from "@/components/ui/switch";
import { updateStream } from "@/actions/stream";
import { toast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

type FieldTypes =
  | "is_chat_enabled"
  | "is_chat_delayed"
  | "is_chat_followers_only";

interface ToggleCardProps {
  field: FieldTypes;
  label: string;
  value: boolean;
}

export const ToggleCard = ({ field, label, value }: ToggleCardProps) => {
  const [isPending, startTransition] = useTransition();

  const toggleLabel = !value ? "Bật" : "Tắt";

  const onChange = () => {
    startTransition(() => {
      updateStream({ [field]: !value })
        .then(() =>
          toast({
            variant: "muted",
            title: `Đã ${toggleLabel.toLowerCase()} chat.`,
          })
        )
        .catch(() =>
          toast({
            variant: "destructive",
            title: "Có lỗi xảy ra",
          })
        );
    });
  };

  return (
    <div className="rounded-xl bg-muted p-6">
      <div className="flex items-center justify-between">
        <p className="font-semibold shrink-0">{label}</p>
        <div className="space-y-2">
          <Switch
            checked={value}
            onCheckedChange={onChange}
            disabled={isPending}
          >
            {toggleLabel}
          </Switch>
        </div>
      </div>
    </div>
  );
};

export const ToggleCardSkeleton = () => {
  return <Skeleton className="rounded-xl p-10 w-full" />;
};
