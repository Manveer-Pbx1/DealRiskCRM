import { useTheme } from "../../hooks/Theme/useTheme";
import { FaRegMoon } from "react-icons/fa";
import { FaSun } from "react-icons/fa";
export const Navbar = () => {
  const { isDark, toggle } = useTheme();

  return (
    <nav className="flex w-full items-center justify-between border-t border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
      <div className="flex items-center gap-2">
        <div className="size-7 rounded-full bg-gradient-to-br from-orange-500 to-green-500" />
        <h1 className="text-base font-bold md:text-2xl text-[rgb(var(--text))]">Deal Risk</h1>
      </div>
      <button onClick={toggle} className="w-10 h-10 transform rounded-full border-none py-2 font-medium transition-all duration-300 cursor-pointer hover:scale-105 hover:bg-gray-200 dark:border-neutral-700">
        {isDark ? <FaSun className="mx-auto text-yellow-400 font-extrabold" /> : <FaRegMoon className="mx-auto text-black font-extrabold" />}
      </button>
    </nav>
  );
};