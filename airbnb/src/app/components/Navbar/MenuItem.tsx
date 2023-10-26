"use client";

interface MenuItemProps {
    onClick: () => void;
    text: string;
}

export default function MenuItem({ onClick, text }: MenuItemProps) {
    return (
        <div
            className=" px-4 py-3 hover:bg-neutral-100 transition font-semibold"
            onClick={onClick}
        >
            {text}
        </div>
    );
}
