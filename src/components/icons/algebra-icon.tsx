export function AlgebraIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M4 12h1.5a2.5 2.5 0 0 0 2.5-2.5V4" />
      <path d="M4 12h1.5a2.5 2.5 0 0 1 2.5 2.5V20" />
      <path d="m18 16 4-4-4-4" />
      <path d="m10 8 4 8 4-8" />
    </svg>
  );
}
