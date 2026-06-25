import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Home,
  Compass,
  Bell,
  MessageCircle,
  Plus,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  Share2,
} from "lucide-react";
import { NavLink } from "react-router";
import { toast } from "sonner";

export default function Header() {
  const [searchValue, setSearchValue] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [activeNav, setActiveNav] = useState("home");

  const [notificationCount] = useState(7);
  const [messageCount] = useState(3);

  const dropdownRef = useRef(null);

  // Close the profile dropdown when clicking outside of it
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    function handleEscape(event) {
      if (event.key === "Escape") {
        setDropdownOpen(false);
        setMobileSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Theme tokens — driven by component state rather than Tailwind's
  // dark: variant, so the toggle works without extra Tailwind config.
  const t = {
    header: darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100",
    text: darkMode ? "text-gray-100" : "text-gray-900",
    textMuted: darkMode ? "text-gray-400" : "text-gray-500",
    hover: darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100",
    iconActive: darkMode
      ? "bg-indigo-500/15 text-indigo-400"
      : "bg-indigo-50 text-indigo-600",
    iconIdle: darkMode ? "text-gray-400" : "text-gray-500",
    inputBg: darkMode
      ? "bg-gray-800 focus-within:bg-gray-800 border-transparent"
      : "bg-gray-100 focus-within:bg-white border-transparent focus-within:border-gray-200",
    panel: darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100",
    panelHover: darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50",
    divider: darkMode ? "border-gray-700" : "border-gray-100",
  };

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "explore", label: "Explore", icon: Compass },
  ];

  function Badge({ count }) {
    if (!count) return null;
    return (
      <span
        className={`absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold leading-none text-white ring-2 ${
          darkMode ? "ring-gray-900" : "ring-white"
        }`}
        aria-hidden="true"
      >
        {count > 9 ? "9+" : count}
      </span>
    );
  }

  function IconButton({ icon: Icon, label, badge, active, onClick }) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
          active ? t.iconActive : `${t.iconIdle} ${t.hover}`
        }`}
      >
        <Icon size={20} strokeWidth={2} />
        <Badge count={badge} />
      </button>
    );
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b shadow-sm transition-colors duration-200 ${t.header}`}
    >
       
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:gap-4 sm:px-6">
        {/* ---------- Mobile search overlay ---------- */}
        {mobileSearchOpen ? (
          <div className="flex w-full items-center gap-2">
            <div
              className={`flex flex-1 items-center gap-2 rounded-full border px-3 py-2 ${t.inputBg}`}
            >
              <Search size={18} className={t.textMuted} aria-hidden="true" />
              <input
                autoFocus
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search posts, people, hashtags..."
                aria-label="Search posts, people, hashtags"
                className={`w-full bg-transparent text-sm outline-none placeholder:text-gray-400 ${t.text}`}
              />
            </div>
            <button
              type="button"
              onClick={() => setMobileSearchOpen(false)}
              aria-label="Close search"
              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${t.iconIdle} ${t.hover}`}
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <>
            {/* ---------- Left: logo ---------- */}
            <a
              href="/"
              className="flex shrink-0 items-center gap-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              aria-label="SocialHub home"
            >
             
              <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-lg font-bold tracking-tight text-transparent sm:text-xl">
               <img src="/logo.svg" alt="Logo" /> 
              </span>
            </a>

            {/* ---------- Center: search (desktop) ---------- */}
            <div className="hidden flex-1 justify-center sm:flex">
              <div
                className={`flex w-full max-w-md items-center gap-2 rounded-full border px-4 py-2 transition-colors ${t.inputBg}`}
              >
                <Search size={18} className={t.textMuted} aria-hidden="true" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search posts, people, hashtags..."
                  aria-label="Search posts, people, hashtags"
                  className={`w-full bg-transparent text-sm outline-none placeholder:text-gray-400 ${t.text}`}
                />
              </div>
            </div>

            {/* ---------- Right section ---------- */}
            <div className="ml-auto flex items-center gap-1 sm:ml-0 sm:gap-1.5">
              {/* Mobile search trigger */}
              <button
                type="button"
                onClick={() => setMobileSearchOpen(true)}
                aria-label="Open search"
                className={`flex h-10 w-10 items-center justify-center rounded-full sm:hidden ${t.iconIdle} ${t.hover}`}
              >
                <Search size={20} />
              </button>

<NavLink
  to="/login"
  className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-semibold tracking-wide transition-all duration-300  hover:scale-105 active:scale-95 hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]"
>
  Log In
</NavLink>

              {/* Nav icons — desktop only */}
              <div className="hidden items-center gap-1 sm:flex">
                {navItems.map((item) => (
                  <IconButton
                    key={item.id}
                    icon={item.icon}
                    label={item.label}
                    active={activeNav === item.id}
                    onClick={() => setActiveNav(item.id)}
                  />
                ))}
              </div>

              <IconButton icon={Bell} label="Notifications" badge={notificationCount} />
              <IconButton icon={MessageCircle} label="Messages" badge={messageCount} />

              {/* Create post — desktop / tablet */}
              <button
                type="button"
                className="ml-1 hidden items-center gap-1.5 rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-150 hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 sm:flex"
              >
                <Plus size={18} strokeWidth={2.25} />
                <span className="hidden md:inline">Create</span>
              </button>

              {/* Profile dropdown */}
              <div className="relative ml-1" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen((open) => !open)}
                  aria-haspopup="menu"
                  aria-expanded={dropdownOpen}
                  aria-label="Open profile menu"
                  className="flex items-center gap-1 rounded-full p-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  <span className="relative inline-flex">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-sm font-semibold text-white">
                      MQ
                    </span>
                    <span
                      className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ${
                        darkMode ? "ring-gray-900" : "ring-white"
                      }`}
                      aria-label="Online"
                    />
                  </span>
                  <ChevronDown
                    size={16}
                    className={`hidden transition-transform duration-150 sm:block ${t.textMuted} ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  role="menu"
                  className={`absolute right-0 mt-2 w-56 origin-top-right rounded-xl border shadow-lg transition-all duration-150 ${t.panel} ${
                    dropdownOpen
                      ? "visible scale-100 opacity-100"
                      : "invisible scale-95 opacity-0"
                  }`}
                >
                  <div className={`flex items-center gap-3 border-b px-4 py-3 ${t.divider}`}>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-sm font-semibold text-white">
                      MQ
                    </span>
                    <div className="min-w-0">
                      <p className={`truncate text-sm font-semibold ${t.text}`}>Mahar Qudoos</p>
                      <p className={`truncate text-xs ${t.textMuted}`}>@maharq</p>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      role="menuitem"
                      className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm ${t.text} ${t.panelHover}`}
                    >
                      <User size={17} className={t.textMuted} />
                      View profile
                    </button>
                    <button
                      role="menuitem"
                      className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm ${t.text} ${t.panelHover}`}
                    >
                      <Settings size={17} className={t.textMuted} />
                      Settings
                    </button>
                    <button
                      role="menuitem"
                      onClick={() => setDarkMode((d) => !d)}
                      className={`flex w-full items-center justify-between px-4 py-2.5 text-sm ${t.text} ${t.panelHover}`}
                    >
                      <span className="flex items-center gap-3">
                        {darkMode ? (
                          <Sun size={17} className={t.textMuted} />
                        ) : (
                          <Moon size={17} className={t.textMuted} />
                        )}
                        Dark mode
                      </span>
                      <span
                        className={`relative h-5 w-9 flex-shrink-0 rounded-full transition-colors duration-150 ${
                          darkMode ? "bg-indigo-600" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-150 ${
                            darkMode ? "translate-x-0" : "-translate-x-4"
                          }`}
                        />
                      </span>
                    </button>
                  </div>

                  <div className={`border-t py-1 ${t.divider}`}>
                    <button
                      role="menuitem"
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50"
                    >
                      <LogOut size={17} />
                      Log out
                    </button>
                  </div>
                </div>
              </div>

              {/* Hamburger — mobile only */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen((open) => !open)}
                aria-label="Open menu"
                aria-expanded={mobileMenuOpen}
                className={`flex h-10 w-10 items-center justify-center rounded-full sm:hidden ${t.iconIdle} ${t.hover}`}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </>
        )}
      </div>

      {/* ---------- Mobile menu panel ---------- */}
      <div
        className={`overflow-hidden border-t transition-all duration-200 sm:hidden ${
          mobileMenuOpen ? "max-h-60 border-opacity-100" : "max-h-0 border-opacity-0"
        } ${t.divider}`}
      >
        <div className="flex flex-col gap-1 px-4 py-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveNav(item.id);
                setMobileMenuOpen(false);
              }}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
                activeNav === item.id ? t.iconActive : `${t.text} ${t.hover}`
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
          <button
            className="mt-1 flex items-center justify-center gap-1.5 rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Plus size={18} strokeWidth={2.25} />
            Create post
          </button>

          <NavLink
  to="/login"
  className=" inline-flex md:hidden justify-center items-center gap-2 px-5 py-2.5 my-2 bg-linear-to-r rounded-full from-indigo-500 to-violet-600 text-white text-sm font-semibold tracking-wide transition-all duration-300  hover:scale-105 active:scale-95 hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]"
>
  Log In
</NavLink>
        </div>
      </div>
    </header>
  );
}