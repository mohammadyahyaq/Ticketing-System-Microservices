import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="container flex flex-col gap-4">
      <Link href="/register">Register</Link>
    </main>
  );
}
