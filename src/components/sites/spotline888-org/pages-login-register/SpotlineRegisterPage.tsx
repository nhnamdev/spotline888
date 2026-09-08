"use client";

import React, { useState } from "react";
import { I18nProvider } from "./registerI18n";
import { RegisterHeader } from "./RegisterHeader";
import { RegisterLogo } from "./RegisterLogo";
import { RegisterForm } from "./RegisterForm";
import { RegisterFooter } from "./RegisterFooter";
import { LanguageDrawer } from "./LanguageDrawer";

function SpotlineRegisterPageContent() {
  const [isLangOpen, setIsLangOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eef2ff] via-[#f8fafc_40%] to-white pb-8 flex flex-col justify-between select-none">
      <div className="w-full max-w-[480px] mx-auto flex-1 flex flex-col justify-between">
        {/* Top section: Header, Logo, Form */}
        <div>
          {/* Header with back arrow & language button */}
          <RegisterHeader onOpenLang={() => setIsLangOpen(true)} />

          {/* Logo & Title */}
          <RegisterLogo />

          {/* Register Form */}
          <RegisterForm />
        </div>

        {/* Footer Links */}
        <RegisterFooter />
      </div>

      {/* Language Bottom Sheet Drawer */}
      <LanguageDrawer
        isOpen={isLangOpen}
        onClose={() => setIsLangOpen(false)}
      />
    </div>
  );
}

export default function SpotlineRegisterPage() {
  return (
    <I18nProvider>
      <SpotlineRegisterPageContent />
    </I18nProvider>
  );
}
