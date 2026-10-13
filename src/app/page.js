import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <section className="relative grid items-center gap-12 md:grid-cols-2">
        <div className="absolute -left-20 -top-20 -z-10 h-72 w-72 rounded-full bg-orange-200/50 blur-3xl" />

        <div>
          <span className="inline-block rounded-full bg-orange-100 px-4 py-1 text-sm font-semibold text-[#ff6f61]">
            🔥 Welcome to Addis Eats
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 md:text-6xl">
            Delicious Ethiopian Food,
            <span className="bg-gradient-to-r from-[#ff6f61] to-orange-400 bg-clip-text text-transparent">
              {" "}Delivered to You 🍴
            </span>
          </h1>

          <p className="mt-5 max-w-lg text-lg leading-relaxed text-gray-500">
            Enjoy your favorite Ethiopian dishes and more, freshly prepared and
            delivered straight to your door.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/menu"
              className="rounded-full bg-gradient-to-r from-[#ff6f61] to-orange-400 px-8 py-3 font-semibold text-white shadow-md shadow-orange-200 transition hover:scale-105 hover:shadow-lg active:scale-95"
            >
              Explore Menu
            </Link>

            <Link
              href="/menu"
              className="rounded-full border-2 border-[#ff6f61] px-8 py-3 font-semibold text-[#ff6f61] transition hover:bg-[#ff6f61] hover:text-white active:scale-95"
            >
              Order Now
            </Link>
          </div>
        </div>

        
         <div className="relative w-full max-w-xl">
          {/* Decorative glow / shadow */}
          <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-3xl bg-gradient-to-br from-[#ff6f61] to-orange-300 opacity-30 blur-sm" />

          {/* Image container */}
          <div className="relative overflow-hidden rounded-3xl border border-orange-100 bg-white p-2 shadow-2xl shadow-orange-200/50">
            <Image
              src="/images/logo.png"
              alt="Beyaynet - Traditional Ethiopian fast food served with injera."
              width={1200}
              height={800}
              loading="eager"
              className="h-auto w-full rounded-2xl object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>
      </section>

      <section className="mt-24 grid gap-6 sm:grid-cols-3">
        {[
          { icon: "🍲", title: "Fresh Food", text: "Freshly prepared meals using quality ingredients." },
          { icon: "🚴", title: "Fast Delivery", text: "Get your favorite meals delivered quickly." },
          { icon: "❤️", title: "Made With Love", text: "Authentic flavors prepared with care." },
        ].map((f) => (
          <div
            key={f.title}
            className="group rounded-2xl border border-orange-100 bg-white p-8 text-center shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
          >
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-3xl transition group-hover:bg-orange-100">
              {f.icon}
            </span>
            <h3 className="mt-4 text-lg font-bold text-gray-900">{f.title}</h3>
            <p className="mt-2 text-sm text-gray-500">{f.text}</p>
          </div>
        ))}
      </section>
    </main>
  );
}