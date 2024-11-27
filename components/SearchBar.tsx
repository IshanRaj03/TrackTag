"use client";

import { scrapeAndStoreProduct } from "@/lib/actions";
import React, { FormEvent, useState } from "react";

const isValidURL = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;
    if (
      hostname.includes("amazon.com") ||
      hostname.includes("amazon.") ||
      hostname.endsWith("amazon")
    ) {
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
  }
};

const SearchBar = () => {
  const [searchPrompt, setSearchPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValidUrl = isValidURL(searchPrompt);
    if (!isValidUrl) {
      alert("Please enter a valid Amazon or Flipkart product link");
      return;
    }
    try {
      setLoading(true);
      // Scrape the product details
      await scrapeAndStoreProduct(searchPrompt);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <form
      action=""
      className="flex flex-wrap gap-4 mt-12 w-full "
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        value={searchPrompt}
        onChange={(e) => setSearchPrompt(e.target.value)}
        placeholder="Enter product link "
        className="flex-1 min-w-[200px] w-full p-3 border border-color1 bg-offwhite rounded-lg shadow-xs text-base  focus:outline-none"
      />
      <button
        type="submit"
        className="bg-color1 border border-gray-900 rounded-lg shadow-xs px-5 py-3 text-white text-base font-semibold hover:opacity-90 "
        disabled={searchPrompt === ""}
      >
        {loading ? "Searching..." : "Search"}
      </button>
    </form>
  );
};

export default SearchBar;
