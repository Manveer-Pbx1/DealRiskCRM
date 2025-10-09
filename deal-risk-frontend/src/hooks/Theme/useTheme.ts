import { useState, useEffect } from "react";

export function useTheme() {
    const [isDark, setIsDark] = useState(
        () => localStorage.getItem("theme") === "dark"
    )

    useEffect(()=> {
        const el = document.documentElement;
        el.classList.toggle("dark", isDark);
        localStorage.setItem("theme", isDark ? "dark" : "light");
    }, [isDark])

    return {isDark, toggle: () => setIsDark(!isDark)}
}