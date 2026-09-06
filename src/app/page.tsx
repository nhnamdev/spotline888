"use client";

import React, { useState, useEffect } from "react";
import SpotlineIndexPage from "@/components/sites/spotline888-org/pages-index-index/SpotlineIndexPage";
import SpotlineLoginPage from "@/components/sites/spotline888-org/pages-login-login/SpotlineLoginPage";

export default function Home() {
  const [isLoginHash, setIsLoginHash] = useState(false);

  useEffect(() => {
    const checkHash = () => {
      setIsLoginHash(window.location.hash.includes("login"));
    };

    checkHash();
    window.addEventListener("hashchange", checkHash);
    return () => window.removeEventListener("hashchange", checkHash);
  }, []);

  if (isLoginHash) {
    return <SpotlineLoginPage />;
  }

  return <SpotlineIndexPage />;
}
