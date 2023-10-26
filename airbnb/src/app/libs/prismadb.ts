import { PrismaClient } from "@prisma/client";

declare global {
    var prisma: PrismaClient | undefined;
}

const client = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = client;

export default client;

// Next앱은 개발환경에서 항상 hot reload하려고 준비한다.
// 그러면 그럴때마다 client를 호출하게 될 것이고 이 후 PrismaClient가 지속적으로 생성되고, 이러한 상황에서는 db 연결에 한계가 생기게된다.
// 위와 같이 client는 global object에 저장된 prisma와 client는 같다고 명시를 해주고, 만약 global에 prisma가 없다면 New PrismaClient를 생성하라고 설정해준다.
// 이렇게 하면 개발 환경에서는 최초 1회만 PrismaClient를 생성하게 되고 제품화 했을때는 hot reload와 연관 없으니 최초 배포 시 1회만 PrismaClient가 생성되게된다.
