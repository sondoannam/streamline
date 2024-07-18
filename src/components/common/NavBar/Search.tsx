"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import qs from "query-string";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon, X } from "lucide-react";

export const Search = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!searchTerm) return;

    const url = qs.stringifyUrl(
      {
        url: "/search",
        query: { term: searchTerm },
      },
      { skipEmptyString: true }
    );

    router.push(url);
  };

  const onClear = () => {
    setSearchTerm("");
  };

  return (
    <form
      onSubmit={onSubmit}
      className="relative w-full lg:w-[400px] flex items-center"
    >
      <Input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Tìm kiếm"
        className="rounded-r-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
      />
      {searchTerm && (
        <X
          className="absolute top-1/2 -translate-y-1/2 right-14 h-5 w-5 text-muted-foreground cursor-pointer hover:opacity-75 transition"
          onClick={onClear}
        />
      )}
      <Button
        type="submit"
        size="sm"
        variant="secondary"
        className="rounded--l-none"
      >
        <SearchIcon className="h-5 w-5 text-muted-foreground" />
      </Button>
    </form>
  );
};
