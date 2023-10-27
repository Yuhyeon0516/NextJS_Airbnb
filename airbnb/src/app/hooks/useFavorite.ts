import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { SafeUser } from "../types";
import useLoginModal from "./useLoginModal";

interface IUseFavorite {
    listingId: string;
    currentUser?: SafeUser | null | undefined;
}

export default function useFavorite({ listingId, currentUser }: IUseFavorite) {
    const router = useRouter();
    const loginModal = useLoginModal();

    const hasFavorited = useMemo(() => {
        const list = currentUser?.favoriteIds || [];

        return list.includes(listingId);
    }, [currentUser, listingId]);

    const toggleFavorite = useCallback(
        async (e: React.MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();

            if (!currentUser) {
                return loginModal.onOpen();
            }

            try {
                let request;

                if (hasFavorited) {
                    request = async function () {
                        axios.delete(`/api/favorites/${listingId}`);
                    };
                } else {
                    request = async function () {
                        axios.post(`/api/favorites/${listingId}`);
                    };
                }

                await request();
                router.refresh();
                toast.success("Success");
            } catch (error: any) {
                toast.error(error.message);
            }
        },
        [currentUser, hasFavorited, listingId, loginModal, router]
    );

    return {
        hasFavorited,
        toggleFavorite,
    };
}
