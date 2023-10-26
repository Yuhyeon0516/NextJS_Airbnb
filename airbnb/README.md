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

## Prisma DB 설정

Next앱은 개발환경에서 항상 hot reload하려고 준비한다.<br>
그러면 그럴때마다 client를 호출하게 될 것이고 이 후 PrismaClient가 지속적으로 생성되고, 이러한 상황에서는 db 연결에 한계가 생기게된다.<br>

```typescript
import { PrismaClient } from "@prisma/client";

declare global {
    var prisma: PrismaClient | undefined;
}

const client = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = client;

export default client;
```

위와 같이 client는 global object에 저장된 prisma와 client는 같다고 명시를 해주고, 만약 global에 prisma가 없다면 New PrismaClient를 생성하라고 설정해준다.<br>
이렇게 하면 개발 환경에서는 최초 1회만 PrismaClient를 생성하게 되고 제품화 했을때는 hot reload와 연관 없으니 최초 배포 시 1회만 PrismaClient가 생성되게된다.

## Next-Auth

Next-Auth는 Next에서 Auth관련된 사항들을 관리를 해주는 라이브러리이다.<br>
일단 설정 방법으로는 Next13부터 app router로 변경되면서 app/api/auth/[...nextauth]/route.ts에 기본 설정을 하면된다.<br>
아래와 같이 adapter, provider 등 authOptions에 정의를 해주고, as Method와 함께 export 해주면된다.<br>

```typescript
import client from "@/app/libs/prismadb";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import prisma from "@/app/libs/prismadb";

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(client),
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string,
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "email", type: "text" },
                password: { label: "password", type: "password" },
            },
            authorize: async function (credentials) {
                if (!credentials?.email || !credentials.password) {
                    throw new Error("Invalide credentials");
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email,
                    },
                });

                if (!user || !user.hashedPassword) {
                    throw new Error("Invalide credentials");
                }

                const isCorrectPassword = await bcrypt.compare(
                    credentials.password,
                    user.hashedPassword
                );

                if (!isCorrectPassword) {
                    throw new Error("Invalide credentials");
                }

                return user;
            },
        }),
    ],
    pages: {
        signIn: "/",
    },
    debug: process.env.NODE_ENV === "development",
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const authHandler = NextAuth(authOptions);

export { authHandler as GET, authHandler as POST };
```

추가로 다른 HTTP Request/Response를 구성하고 싶을땐 api 폴더 하위에 설정하면된다.<br>
현재 프로젝트 api/register 처럼 함수의 이름을 원하는 Method로 정의하여 구현하면된다.<br>
만약 입력된 email에 맞춰 user를 찾고싶으면 prisma를 이용하여 아래와 같이 findUnique로 찾을 수 있다.<br>

```typescript
import prisma from "@/app/libs/prismadb";

const currentUser = await prisma.user.findUnique({
    where: {
        email: session.user.email as string,
    },
});
```
