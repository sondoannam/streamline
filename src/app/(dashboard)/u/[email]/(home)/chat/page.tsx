import React from "react";

import { getSelf } from "@/lib/auth-service";
import { getStreamByUserId } from "@/lib/stream-service";

import { NotFound } from "@/components/common/NotFound";

import { ToggleCard } from "./_components/ToggleCard";

const ChatPage = async () => {
  const self = await getSelf();
  const stream = await getStreamByUserId(self.id);

  if (!stream) {
    return <NotFound title="Không tìm thấy stream" />;
  }

  return (
    <div className="p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Cài đặt chat</h1>
      </div>

      <div className="space-y-4">
        <ToggleCard
          field="is_chat_enabled"
          label="Bật chat"
          value={stream.is_chat_enabled}
        />
        <ToggleCard
          field="is_chat_delayed"
          label="Bật delay chat"
          value={stream.is_chat_delayed}
        />
        <ToggleCard
          field="is_chat_followers_only"
          label="Chỉ thành viên mới được chat"
          value={stream.is_chat_followers_only}
        />
      </div>
    </div>
  );
};

export default ChatPage;
