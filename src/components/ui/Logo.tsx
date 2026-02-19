export default function Logo({ className = "w-6 h-6" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 100 100"
            className={className}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Main O Circle */}
            <circle
                cx="50"
                cy="50"
                r="38"
                stroke="currentColor"
                strokeWidth="12"
            />

            {/* Wave Elements on the left */}
            <path
                d="M32 25C22 35 22 65 32 75C28 65 28 35 32 25Z"
                fill="currentColor"
            />
            <path
                d="M22 35C16 45 16 55 22 65C19 55 19 45 22 35Z"
                fill="currentColor"
            />
            <path
                d="M14 42C10 48 10 52 14 58C12 52 12 48 14 42Z"
                fill="currentColor"
            />
        </svg>
    )
}
