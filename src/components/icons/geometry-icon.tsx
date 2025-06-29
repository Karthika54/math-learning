export function GeometryIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <circle cx="12" cy="12" r="10" />
      <path d="m12 3.5-1.5 5.5 5.5-1.5-1.5 5.5 5.5 1.5-5.5 1.5 1.5 5.5-5.5-1.5-5.5 1.5 1.5-5.5-5.5-1.5 5.5-1.5-1.5-5.5Z" />
      <path d="M3.55 12H20.5" />
    </svg>
  );
}
