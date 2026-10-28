import type { RegionId } from "@/lib/regions";

export default function Flag({ region, className = "h-3.5 w-5" }: { region: RegionId; className?: string }) {
    if (region === "EG") {
        return (
            <svg viewBox="0 0 30 20" aria-hidden className={`shrink-0 overflow-hidden rounded-[3px] ring-1 ring-black/10 ${className}`}>
                <rect width="30" height="20" fill="#000" />
                <rect width="30" height="13.34" fill="#fff" />
                <rect width="30" height="6.67" fill="#ce1126" />
                <circle cx="15" cy="10" r="2" fill="#c09300" />
            </svg>
        );
    }
    return (
        <svg viewBox="0 0 30 20" aria-hidden className={`shrink-0 overflow-hidden rounded-[3px] ring-1 ring-black/10 ${className}`}>
            <rect width="30" height="20" fill="#005430" />
            <rect x="8" y="6" width="14" height="1.6" rx=".8" fill="#fff" />
            <rect x="9" y="9" width="12" height="1.2" rx=".6" fill="#fff" opacity=".85" />
            <path d="M8 13.6h13l1.5-.8-1.5-.8H8z" fill="#fff" />
        </svg>
    );
}
