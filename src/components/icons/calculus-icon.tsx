export function CalculusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 12c.5-2.5 2-4 4-4s4 2 4 4-2 4-4 4-3.5-1.5-4-4Z" />
      <path d="M13 12c.5-2.5 2-4 4-4s4 2 4 4-2 4-4 4-3.5-1.5-4-4Z" />
      <path d="M8 12c0-2 2-4 4-4s4 2 4 4" />
      <path d="M8 12h8" />
      <path d="M12 8v8" />
    </svg>
  );
}
