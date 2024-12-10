import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/login"); // Arahkan ke halaman login
  }, []);

  return null; // Tidak menampilkan apa pun di halaman ini
}
