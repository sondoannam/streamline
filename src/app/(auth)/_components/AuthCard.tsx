import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BackButton } from "./BackButton";
import Social from "./Social";

interface AuthCardProps {
  title: string;
  desc: string;
  children: React.ReactNode;
  showSocial?: boolean;
  backButtonLabel: string;
  backButtonHref: string;
}

export const AuthCard = ({
  title,
  desc,
  children,
  showSocial,
  backButtonHref,
  backButtonLabel,
}: AuthCardProps) => {
  return (
    <Card className="max-w-[400px] w-full h-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{desc}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSocial && (
        <CardFooter className="flex-col gap-3">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-primary" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Hoặc tiếp tục với
              </span>
            </div>
          </div>
          <Social />
        </CardFooter>
      )}
      <CardFooter>
        <BackButton label={backButtonLabel} href={backButtonHref} />
      </CardFooter>
    </Card>
  );
};
