import Link from "next/link";

function SiteIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-8 w-8"
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="64" height="64" rx="14" fill="#0f2f7f" />
      <path d="M18 40h8v10h12V40h8V24H18v16z" fill="#ffffff" />
      <path
        d="M26 24V14h6v10M38 24v-8h6v8"
        fill="none"
        stroke="#93c5fd"
        strokeLinecap="round"
        strokeWidth="4"
      />
      <path
        d="M18 40h28"
        stroke="#93c5fd"
        strokeLinecap="round"
        strokeWidth="4"
      />
    </svg>
  );
}

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center px-4 sm:px-6">
        <Link
          className="inline-flex items-center gap-2 font-semibold text-slate-950 transition-colors hover:text-blue-700"
          href="/"
        >
          <SiteIcon />
          <span>Sauna Map</span>
        </Link>
      </div>
    </header>
  );
}
