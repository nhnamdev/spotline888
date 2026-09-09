"use client";

import React, { useState, useEffect } from "react";
import SpotlineIndexPage from "@/components/sites/spotline888-org/pages-index-index/SpotlineIndexPage";
import SpotlineProductPage from "@/components/sites/spotline888-org/pages-product-product/SpotlineProductPage";
import SpotlineMoneyPage from "@/components/sites/spotline888-org/pages-money-money/SpotlineMoneyPage";
import SpotlineUserPage from "@/components/sites/spotline888-org/pages-user-user/SpotlineUserPage";

export default function Home() {
  const [currentRoute, setCurrentRoute] = useState<"index" | "product" | "money" | "user">("index");

  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash;
      if (hash.includes("product")) {
        setCurrentRoute("product");
      } else if (hash.includes("money")) {
        setCurrentRoute("money");
      } else if (hash.includes("user")) {
        setCurrentRoute("user");
      } else {
        setCurrentRoute("index");
      }
    };

    checkHash();
    window.addEventListener("hashchange", checkHash);
    return () => window.removeEventListener("hashchange", checkHash);
  }, []);

  if (currentRoute === "product") {
    return <SpotlineProductPage />;
  }

  if (currentRoute === "money") {
    return <SpotlineMoneyPage />;
  }

  if (currentRoute === "user") {
    return <SpotlineUserPage />;
  }

  return <SpotlineIndexPage />;
}
