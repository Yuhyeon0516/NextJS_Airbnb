"use client";

import { AiOutlineMenu } from "react-icons/ai";
import Avatar from "../Avatar";
import { useCallback, useState } from "react";
import MenuItem from "./MenuItem";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import useLoginModal from "@/app/hooks/useLoginModal";
import { User } from "@prisma/client";
import { signOut } from "next-auth/react";

interface UserMenuProps {
    currentUser?: User | null;
}

export default function UserMenu({ currentUser }: UserMenuProps) {
    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);

    function onClickLogin() {
        setIsOpen(false);
        loginModal.onOpen();
    }

    function onClickSignup() {
        setIsOpen(false);
        registerModal.onOpen();
    }

    return (
        <div className="relative">
            <div className=" flex flex-row items-center gap-3">
                <div
                    className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer"
                    onClick={() => {}}
                >
                    Airbnb your home
                </div>
                <div
                    className="p-4 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition"
                    onClick={toggleOpen}
                >
                    <AiOutlineMenu />
                    <div className="hidden md:block">
                        <Avatar />
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className=" absolute rounded-xl shadow-md w-[40vw] md:w-3/4 bg-white overflow-hidden right-0 top-12 text-sm">
                    <div className=" flex flex-col cursor-pointer">
                        {currentUser ? (
                            <>
                                <MenuItem onClick={() => {}} text="My trips" />
                                <MenuItem
                                    onClick={() => {}}
                                    text="My favorites"
                                />
                                <MenuItem
                                    onClick={() => {}}
                                    text="My reservations"
                                />
                                <MenuItem
                                    onClick={() => {}}
                                    text="My properties"
                                />
                                <MenuItem
                                    onClick={() => {}}
                                    text="Airbnb my home"
                                />
                                <hr />
                                <MenuItem
                                    onClick={() => signOut()}
                                    text="Logout"
                                />
                            </>
                        ) : (
                            <>
                                <MenuItem onClick={onClickLogin} text="Login" />
                                <MenuItem
                                    onClick={onClickSignup}
                                    text="Sign up"
                                />
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
