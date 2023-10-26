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

-   참조 링크 : https://nextjs.org/docs/messages/react-hydration-error

## 외부 라이브러리 client component로 변경하기

기존에 React에서 사용하던 라이브러리를 받아서 사용하려면 전부 client component롤 변경하여야 사용이 가능하다.<br>
왜냐하면 해당 라이브러리에 해당 함수가 React hook(useState, useEffect) 등을 사용하고 있으면 server component에서 사용이 불가하기 때문이다.<br>
변경하는 방법은 사용하고 싶은 라이브러리에서 import로 불러와서 client component로 정의해주고 다시 return 해주는 방식이다.<br>
아래에 react-hot-toast 라이브러리를 예시로 ToasterProvider라는 이름으로 client component로 변경해 보았다.<br>

```Javascript
"use client";

import { Toaster } from "react-hot-toast";

export default function ToasterProvider() {
    return <Toaster />;
}
```

## Prisma

Prisma란 JS와 TS에서 DB와 상호 작용하는 ORM(Object-Relational Mapping)도구

-   사용법

    1. npm i -D prisma
    2. npx prisma init
       -> /prisma/schema.prisma와 .env가 생성됨
    3. 최초에는 postgresql이 기본 DB로 설정이 되어있으나 사용하는 DB에 따라 schema.prisma에서 바꿔주면됨(이번 프로젝트에는 mongodb를 사용해볼 예정)

        - 최초

        ```Javascript
        // This is your Prisma schema file,
        // learn more about it in the docs: https://pris.ly/d/prisma-schema

        generator client {
            provider = "prisma-client-js"
        }

        datasource db {
            provider = "postgresql"
            url      = env("DATABASE_URL")
        }
        ```

        - 변경 후

        ```Javascript
        // This is your Prisma schema file,
        // learn more about it in the docs: https://pris.ly/d/prisma-schema

        generator client {
            provider = "prisma-client-js"
        }

        datasource db {
            provider = "mongodb"
            url      = env("DATABASE_URL")
        }
        ```

    4. DB의 URL을 .env DATABASE_URL에 넣어주기
    5. schema.prisma에서 DB Model을 정의해주기

        ```prisma
        model User {
            id String @id @default(auto()) @map("_id") @db.ObjectId
            name String?
            email String? @unique
            emailVerified DateTime?
            image String?
            hashedPassword String?
            createdAt DateTime @default(now())
            updatedAt DateTime @updatedAt
            favoriteIds String[] @db.ObjectId

            accounts Account[]
            listings Listing[]
            reservations Reservation[]
        }

        model Account {
            id String @id @default(auto()) @map("_id") @db.ObjectId
            userId String @db.ObjectId
            type String
            provider String
            providerAccountId String
            refresh_token String? @db.String
            access_token String? @db.String
            expires_at Int?
            token_type String?
            scope String?
            id_token String? @db.String
            session_state String?

            user User @relation(fields: [userId], references: [id], onDelete: Cascade)

            @@unique([provider, providerAccountId])
        }

        model Listing {
            id String @id @default(auto()) @map("_id") @db.ObjectId
            title String
            description String
            imageSrc String
            createdAt DateTime @default(now())
            category String
            roomCount Int
            bathroomCount Int
            guestCount Int
            locationValue String
            userId String @db.ObjectId
            price Int

            user User @relation(fields: [userId], references: [id], onDelete: Cascade)
            reservations Reservation[]
        }

        model Reservation {
            id String @id @default(auto()) @map("_id") @db.ObjectId
            userId String @db.ObjectId
            listingId String @db.ObjectId
            startDate DateTime
            endDate DateTime
            totalPrice Int
            createdAt DateTime @default(now())

            user User @relation(fields: [userId], references: [id], onDelete: Cascade)
            listing Listing @relation(fields: [listingId], references: [id], onDelete: Cascade)
        }
        ```

    6. npx prisma db push 명령어 실행
    7. DB에 해당 모델에 대한 정보가 잘 업로드 되었는지 확인

## Next-Auth
