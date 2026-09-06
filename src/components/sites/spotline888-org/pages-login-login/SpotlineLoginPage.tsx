"use client";

import React, { useState } from "react";
import { I18nProvider } from "./i18n";
import { LoginHeader } from "./LoginHeader";
import { LoginLogo } from "./LoginLogo";
import { LoginForm } from "./LoginForm";
import { LoginFooter } from "./LoginFooter";
import { LanguageDrawer } from "./LanguageDrawer";

function SpotlineLoginPageContent() {
  const [isLangOpen, setIsLangOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eef2ff] via-[#f8fafc_40%] to-white pb-8 flex flex-col justify-between select-none">
      <div className="w-full max-w-[480px] mx-auto flex-1 flex flex-col justify-between">
        {/* Top section: Header, Logo, Form */}
        <div>
          {/* Header with globe icon */}
          <LoginHeader onOpenLang={() => setIsLangOpen(true)} />

          {/* Logo & Title */}
          <LoginLogo />

          {/* Login Form */}
          <LoginForm />
        </div>

        {/* Footer Links */}
        <LoginFooter />
      </div>

      {/* Language Bottom Sheet Drawer */}
      <LanguageDrawer
        isOpen={isLangOpen}
        onClose={() => setIsLangOpen(false)}
      />
    </div>
  );
}

export default function SpotlineLoginPage() {
  return (
    <I18nProvider>
      <SpotlineLoginPageContent />
    </I18nProvider>
  );
}
