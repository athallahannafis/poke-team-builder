import Landing from "./(pages)/landing/page";

export default function RootContent() {
  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-white border-b border-zinc-200 px-4 h-14 flex items-center">
        <span className="font-semibold text-lg tracking-tight">PokeTeam</span>
      </nav>
      <Landing/>
    </>
  );
}
