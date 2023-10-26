# Airbnb clone

Airbnb를 clone해보면서 배운점들을 적어놓을 예정입니다.

# Next에서 font 적용

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
