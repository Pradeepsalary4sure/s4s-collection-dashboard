import React from "react";

export default function BankLogo({ bank }) {
  const normalized = String(bank || "").toLowerCase();

  // Custom SVGs for a highly premium, authentic look
  if (normalized.includes("hdfc")) {
    return (
      <svg className="bank-logo-svg" viewBox="0 0 100 100" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="16" fill="#1C3F94" />
        <rect x="25" y="25" width="50" height="50" fill="white" />
        <rect x="36" y="36" width="28" height="28" fill="#1C3F94" />
        <circle cx="50" cy="50" r="6" fill="#E31E24" />
      </svg>
    );
  }

  if (normalized.includes("icici")) {
    return (
      <svg className="bank-logo-svg" viewBox="0 0 100 100" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="16" fill="#F37021" />
        <path d="M35 25H65M50 25V75M35 75H65" stroke="white" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="50" cy="18" r="7" fill="#FFC20E" />
      </svg>
    );
  }

  if (normalized.includes("bob") || normalized.includes("baroda")) {
    return (
      <svg className="bank-logo-svg" viewBox="0 0 100 100" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="16" fill="#FF5000" />
        <path d="M30 30 C30 30, 48 30, 48 48 C48 66, 30 66, 30 66 Z" stroke="white" strokeWidth="9" strokeLinecap="round" />
        <path d="M48 30 C48 30, 66 30, 66 48 C66 66, 48 66, 48 66 Z" stroke="white" strokeWidth="9" strokeLinecap="round" />
        <path d="M48 20V80" stroke="#FFF" strokeWidth="4" strokeDasharray="4 4" />
      </svg>
    );
  }

  if (normalized.includes("yes")) {
    return (
      <svg className="bank-logo-svg" viewBox="0 0 100 100" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="16" fill="#005A9C" />
        <path d="M25 25 L50 65 L75 25" stroke="white" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M50 60 V80" stroke="#E31E24" strokeWidth="12" strokeLinecap="round" />
      </svg>
    );
  }

  if (normalized === "idfc") {
    // Premium burgundy theme for IDFC Bank
    return (
      <svg className="bank-logo-svg" viewBox="0 0 100 100" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="16" fill="#8C0B2B" />
        <path d="M25 25 H60 C72 25, 75 35, 75 50 C75 65, 72 75, 60 75 H25 V25 Z" fill="none" stroke="white" strokeWidth="10" strokeLinejoin="round" />
        <path d="M40 25 V75" fill="none" stroke="#FFC20E" strokeWidth="10" />
      </svg>
    );
  }

  if (normalized.includes("idfc new") || normalized.includes("idfc-new")) {
    return (
      <svg className="bank-logo-svg" viewBox="0 0 100 100" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="16" fill="#0095AD" />
        <path d="M30 30 H55 C65 30, 68 38, 68 50 C68 62, 65 70, 55 70 H30 V30 Z" fill="none" stroke="white" strokeWidth="8" />
        <path d="M43 30 V70" stroke="#FFD700" strokeWidth="8" />
        <circle cx="50" cy="50" r="10" fill="none" stroke="white" strokeWidth="3" />
      </svg>
    );
  }

  if (normalized.includes("cashfree")) {
    return (
      <svg className="bank-logo-svg" viewBox="0 0 100 100" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="16" fill="#E31B64" />
        <path d="M30 30 H70 V45 H45 V55 H65 V70 H30 V30 Z" fill="white" />
        <rect x="52" y="55" width="13" height="15" fill="#00EFD8" rx="2" />
      </svg>
    );
  }

  // Fallback icon for other banks
  return (
    <svg className="bank-logo-svg" viewBox="0 0 100 100" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="16" fill="#667085" />
      <path d="M25 75 V45 L50 25 L75 45 V75 H25 Z" stroke="white" strokeWidth="8" strokeLinejoin="round" />
      <path d="M40 75 V55 H60 V75" stroke="white" strokeWidth="8" />
    </svg>
  );
}
