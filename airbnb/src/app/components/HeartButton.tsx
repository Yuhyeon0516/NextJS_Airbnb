"use client";

import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { SafeUser } from "../types";

interface HeartButtonProps {
    listingId: string;
    currentUser?: SafeUser | null | undefined;
}

export default function HeartButton({
    listingId,
    currentUser,
}: HeartButtonProps) {
    const hasFavorited = false;
    function toggleFavorite() {}

    return (
        <div
            onClick={toggleFavorite}
            className=" relative hover:opacity-80 transition cursor-pointer"
        >
            <AiOutlineHeart
                size={28}
                className="fill-white absolute -top-[2px] -right-[2px]"
            />

            <AiFillHeart
                size={28}
                className={
                    hasFavorited ? "fill-rose-500" : "fill-neutral-500/70"
                }
            />
        </div>
    );
}
