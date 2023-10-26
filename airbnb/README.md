# Airbnb clone

Airbnb를 clone해보면서 배운점들을 적어놓을 예정입니다.

## Next에서 font 적용

Next13에서 font를 적용하는 방법은 아주 간단하다.<br>
import 구문을 이용하여 font를 가져오고 root에 있는 layout.tsx내 `<body>` tag에 className으로 넣어주면된다.<br>
아래에 Nunito font를 적용한 예시 참고

```JavaScript
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
    title: "Airbnb",
    description: "Airbnb clone",
};

const font = Nunito({
    subsets: ["latin"],
});

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ko">
            <body className={font.className}>{children}</body>
        </html>
    );
}
```

## React Hydration Error

화면이 처음 render 될때 종종 Next에서 Hydration Failed Error를 발생시킴<br>
공식 문서를 확인해보니 SSR에서 내려주는 UI(Pre-render된 UI)와 브라우저 즉 client component에서 첫번째로 render되는 UI DOM Tree에 차이가 있어 발생한다고한다.<br>
이를 해결하기 위해서는 아래와 같은 해결책이 있었다.<br>

1. 환경에 따라 UI가 나타나는 코드를 삭제

    - 조건부로 render되는 부분을 삭제하라고 되어있는데 이번 프로젝트에 Menu Button의 햄버거 기능을 수행하기위해 필요한 부분이라 삭제할 수 없었다.

2. useEffect를 사용하여 server component -> client component순으로 그려지게 변경
    - Next SSR에서 server component를 전부 받아오면 그 뒤에 client component가 render되는 형식으로 변경하는 원리이다.<br>그렇게 하게되면 SSR쪽 UI를 먼저 그리게 될 것이고 SSR에서 내려주는 UI와 client component가 충돌이 될 일은 없어지게 된다.

위와 같은 이유로 나는 2번 해결책을 해당 프로젝트에 적용하였다.

-   ClientOnly

    ```Javascript
    "use client";

    import { useEffect, useState } from "react";

    interface ClientOnlyProps {
        children: React.ReactNode;
    }

    export default function ClientOnly({ children }: ClientOnlyProps) {
        const [hasMounted, setHasMounted] = useState(false);

        useEffect(() => {
            setHasMounted(true);
        }, []);

        if (!hasMounted) return null;

        return <>{children}</>;
    }
    ```

-   적용 전

    ```Javascript
    import type { Metadata } from "next";
    import { Nunito } from "next/font/google";
    import "./globals.css";
    import Navbar from "./components/Navbar/Navbar";
    import ClientOnly from "./components/ClientOnly";

    export const metadata: Metadata = {
        title: "Airbnb",
        description: "Airbnb clone",
    };

    const font = Nunito({
        subsets: ["latin"],
    });

    export default function RootLayout({
        children,
    }: {
        children: React.ReactNode;
    }) {
        return (
            <html lang="ko">
                <body className={font.className}>
                    <Navbar />
                    {children}
                </body>
            </html>
        );
    }
    ```

-   적용 후

    ```Javascript
    import type { Metadata } from "next";
    import { Nunito } from "next/font/google";
    import "./globals.css";
    import Navbar from "./components/Navbar/Navbar";
    import ClientOnly from "./components/ClientOnly";

    export const metadata: Metadata = {
        title: "Airbnb",
        description: "Airbnb clone",
    };

    const font = Nunito({
        subsets: ["latin"],
    });

    export default function RootLayout({
        children,
    }: {
        children: React.ReactNode;
    }) {
        return (
            <html lang="ko">
                <body className={font.className}>
                    <ClientOnly>
                        <Navbar />
                    </ClientOnly>
                    {children}
                </body>
            </html>
        );
    }
    ```
