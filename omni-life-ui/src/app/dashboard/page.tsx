"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

interface UserProfile {
  name: string;
  email: string;
  picture: string;
  message: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchProfile();
    }
  }, [session]);

  async function fetchProfile() {
    const idToken = (session as any)?.idToken;
    if (!idToken) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/me`,
        { headers: { Authorization: `Bearer ${idToken}` } }
      );
      if (res.ok) {
        setProfile(await res.json());
      }
    } catch {
      // backend may not be running locally; fall back to session data
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  const displayName = profile?.name ?? session.user?.name ?? "User";
  const displayEmail = profile?.email ?? session.user?.email ?? "";
  const displayImage = profile?.picture ?? session.user?.image ?? "";

  const stats = [
    { label: "Tasks", value: "12", color: "bg-blue-500" },
    { label: "Goals", value: "5", color: "bg-green-500" },
    { label: "Habits", value: "8", color: "bg-purple-500" },
    { label: "Streak", value: "7d", color: "bg-orange-500" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg">O</span>
          </div>
          <span className="text-xl font-bold text-gray-900">Omni Life</span>
        </div>
        <div className="flex items-center gap-4">
          {displayImage && (
            <Image
              src={displayImage}
              alt={displayName}
              width={36}
              height={36}
              className="rounded-full ring-2 ring-brand-500"
            />
          )}
          <span className="text-sm font-medium text-gray-700 hidden sm:block">
            {displayName}
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-sm px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-8">
        {/* Welcome */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Welcome back, {displayName.split(" ")[0]} 👋
          </h2>
          <p className="text-gray-500 mt-1">{displayEmail}</p>
          {profile?.message && (
            <p className="mt-2 text-sm text-brand-600 font-medium">
              {profile.message}
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-2"
            >
              <div className={`w-3 h-3 rounded-full ${s.color}`} />
              <span className="text-3xl font-bold text-gray-900">{s.value}</span>
              <span className="text-sm text-gray-500">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Quick sections */}
        <div className="grid sm:grid-cols-2 gap-6">
          <Section title="Today's Tasks" items={["Review project brief", "Morning run", "Read 20 pages"]} />
          <Section title="Active Goals" items={["Ship Omni Life MVP", "Exercise 5x / week", "Learn Spanish"]} />
        </div>
      </main>
    </div>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="font-semibold text-gray-800 mb-4">{title}</h3>
      <ul className="flex flex-col gap-3">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-3 text-sm text-gray-700">
            <span className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
