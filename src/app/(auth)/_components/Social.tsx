'use client';

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const Social = () => {
  return (
    <Button size="lg" className="w-full" variant="outline" onClick={() => {}}>
      <Image src="/google.svg" alt="Google" height={24} width={24} />
    </Button>
  );
};

export default Social;
