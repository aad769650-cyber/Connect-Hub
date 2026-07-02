import { useState, useRef } from "react";
import {
  Eye, EyeOff, Mail, Lock, User, AtSign,
  ArrowRight, Sparkles, Zap, Globe, Camera, X,
} from "lucide-react";
import { apiCall, Register } from "../api/apiCall";

/* ── Google icon ─────────────────────────────────────────── */
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

/* ── Mobile/tablet brand bar (shown below lg) ─────────────── */
const BrandBar = ({ mode }) => (
  <div className="lg:hidden relative overflow-hidden px-6 pt-8 pb-6">
    <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-indigo-950 to-slate-950" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(139,92,246,0.3)_0%,_transparent_70%)]" />
    <div
      className="absolute inset-0 opacity-[0.04]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    />
    <div className="relative z-10 flex flex-col items-center gap-3 text-center">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
          <Zap className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
        </div>
        <span className="text-white font-semibold text-base tracking-tight">Loopin</span>
      </div>
      {/* Tagline pill */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10">
        <Sparkles className="w-3 h-3 text-violet-400" />
        <span className="text-violet-300 text-xs font-medium">
          {mode === "login" ? "Welcome back" : "Join the loop"}
        </span>
      </div>
      {/* Headline — shorter on mobile */}
      <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight tracking-tight">
        {mode === "login" ? (
          <>The loop never{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
              stops for you.
            </span>
          </>
        ) : (
          <>Connect with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
              what matters.
            </span>
          </>
        )}
      </h2>
    </div>
  </div>
);

/* ── Desktop brand panel (hidden below lg) ───────────────── */
const BrandPanel = ({ mode }) => (
  <div className="hidden lg:flex flex-col justify-between h-full p-10 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-indigo-950 to-slate-950" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(139,92,246,0.25)_0%,_transparent_60%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(99,102,241,0.2)_0%,_transparent_60%)]" />
    <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-violet-600/10 blur-3xl" />
    <div className="absolute bottom-32 left-8 w-48 h-48 rounded-full bg-indigo-500/10 blur-3xl" />
    <div
      className="absolute inset-0 opacity-[0.04]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    />
    {/* Logo */}
    <div className="relative z-10 flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
        <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
      </div>
      <span className="text-white font-semibold text-lg tracking-tight">Loopin</span>
    </div>
    {/* Center content */}
    <div className="relative z-10 space-y-8">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10">
          <Sparkles className="w-3 h-3 text-violet-400" />
          <span className="text-violet-300 text-xs font-medium tracking-wide">
            {mode === "login" ? "Welcome back" : "Join the loop"}
          </span>
        </div>
        <h2 className="text-4xl font-bold text-white leading-tight tracking-tight">
          {mode === "login" ? (
            <>The loop never<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
                stops for you.
              </span>
            </>
          ) : (
            <>Connect with<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
                what matters.
              </span>
            </>
          )}
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
          {mode === "login"
            ? "Your threads, your people, your world — all in one place. Dive back in."
            : "Real conversations. Real connections. No noise. Start your loop today."}
        </p>
      </div>
      <div className="space-y-3">
        {[
          { icon: Globe, text: "12M+ people already looping" },
          { icon: Zap, text: "Real-time threads & reactions" },
          { icon: Sparkles, text: "Curated for your interests" },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
              <Icon className="w-3.5 h-3.5 text-violet-400" />
            </div>
            <span className="text-slate-400 text-sm">{text}</span>
          </div>
        ))}
      </div>
    </div>
    {/* Bottom avatars */}
    <div className="relative z-10 flex items-center gap-3">
      <div className="flex -space-x-2">
        {["bg-violet-500","bg-indigo-500","bg-pink-500","bg-cyan-500"].map((color, i) => (
          <div key={i} className={`w-7 h-7 rounded-full border-2 border-slate-900 ${color} flex items-center justify-center text-white text-xs font-medium`}>
            {["A","R","S","M"][i]}
          </div>
        ))}
      </div>
      <p className="text-slate-500 text-xs">
        Joined this week: <span className="text-slate-400 font-medium">+2,847</span>
      </p>
    </div>
  </div>
);

/* ── Reusable input ───────────────────────────────────────── */
const InputField = ({ id, label, type = "text", placeholder, icon: Icon, value, onChange, error, rightElement, autoComplete }) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="block text-sm font-medium text-slate-300 select-none">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
        <Icon className={`w-4 h-4 transition-colors duration-150 ${error ? "text-red-400" : "text-slate-500 group-focus-within:text-violet-400"}`} />
      </div>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        className={`w-full pl-10 ${rightElement ? "pr-10" : "pr-3.5"} py-3 sm:py-2.5 rounded-xl text-sm text-white placeholder:text-slate-600
          bg-white/5 border transition-all duration-150 outline-none
          ${error
            ? "border-red-500/60 focus:border-red-500 focus:ring-2 focus:ring-red-500/15"
            : "border-white/10 hover:border-white/20 focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/15"
          }`}
      />
      {rightElement && (
        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
          {rightElement}
        </div>
      )}
    </div>
    {error && (
      <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
        <span className="w-1 h-1 rounded-full bg-red-400 inline-block" />
        {error}
      </p>
    )}
  </div>
);

/* ── Spinner SVG ─────────────────────────────────────────── */
const Spinner = () => (
  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

/* ── Divider ─────────────────────────────────────────────── */
const Divider = () => (
  <div className="flex items-center gap-3">
    <div className="h-px flex-1 bg-white/[0.08]" />
    <span className="text-xs text-slate-600 select-none">or</span>
    <div className="h-px flex-1 bg-white/[0.08]" />
  </div>
);

/* ── OAuth button ────────────────────────────────────────── */
const GoogleButton = ({ label }) => (
  <button
    type="button"
    className="w-full flex items-center justify-center gap-3 py-3 sm:py-2.5 px-4 rounded-xl
      bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20
      transition-all duration-150 text-sm font-medium text-slate-300 hover:text-white group"
  >
    <GoogleIcon />
    <span>{label}</span>
    <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
  </button>
);

/* ── CTA button ──────────────────────────────────────────── */
const SubmitButton = ({ loading, label, loadingLabel }) => (
  <button
    type="submit"
    disabled={loading}
    className="w-full flex items-center justify-center gap-2 py-3 sm:py-2.5 px-4 rounded-xl
      font-medium text-sm bg-gradient-to-r from-violet-600 to-indigo-600 text-white
      hover:from-violet-500 hover:to-indigo-500 active:scale-[0.98]
      disabled:opacity-60 disabled:cursor-not-allowed
      transition-all duration-150 shadow-lg shadow-violet-500/20"
  >
    {loading ? (<><Spinner />{loadingLabel}</>) : (<>{label}<ArrowRight className="w-4 h-4" /></>)}
  </button>
);

/* ── Login form ──────────────────────────────────────────── */
const LoginForm = ({ onSwitch }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Minimum 6 characters";
    return e;
  };

  const handleSubmit = (e) => {
console.log(email,password);


    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setLoading(true);
    setTimeout(() => setLoading(false), 1800);
  };

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Sign in</h1>
        <p className="text-sm text-slate-400">
          New here?{" "}
          <button onClick={onSwitch} className="text-violet-400 hover:text-violet-300 font-medium transition-colors duration-150 hover:underline underline-offset-2">
            Create an account
          </button>
        </p>
      </div>

      <GoogleButton label="Continue with Google" />
      <Divider />

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <InputField
          id="login-email" label="Email" type="email" placeholder="you@example.com"
          icon={Mail} value={email}
          onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors(p => ({ ...p, email: "" })); }}
          error={errors.email} autoComplete="email"
        />
        <InputField
          id="login-password" label="Password" type={showPassword ? "text" : "password"}
          placeholder="Your password" icon={Lock} value={password}
          onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors(p => ({ ...p, password: "" })); }}
          error={errors.password} autoComplete="current-password"
          rightElement={
            <button type="button" onClick={() => setShowPassword(v => !v)}
              className="text-slate-500 hover:text-slate-300 transition-colors duration-150"
              aria-label={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
        />
        <div className="flex justify-end">
          <button type="button" className="text-xs text-slate-500 hover:text-violet-400 transition-colors duration-150 py-1">
            Forgot password?
          </button>
        </div>
        <SubmitButton loading={loading} label="Sign in" loadingLabel="Signing in…" />
      </form>
    </div>
  );
};

/* ── Signup form ─────────────────────────────────────────── */
const SignupForm = ({ onSwitch }) => {
  const [form, setForm] = useState({ fullName: "", username: "", email: "", password: "" });
  const [avatar, setAvatar] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);

  const handleAvatarFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
 const photo = event.target.files[0];

  const reader = new FileReader();
    reader.onload = (e) => setAvatar(e.target.result);
    reader.readAsDataURL(file);

    setProfile(file)
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleAvatarFile(e.dataTransfer.files[0]);
  };

  const update = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!form.username.trim()) e.username = "Username is required";
    else if (form.username.length < 3) e.username = "At least 3 characters";
    else if (!/^[a-zA-Z0-9_.]+$/.test(form.username)) e.username = "Letters, numbers, _ or . only";
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 8) e.password = "Minimum 8 characters";
    return e;
  };

  const passwordStrength = (() => {
    const p = form.password;
    if (!p) return null;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    if (score <= 1) return { label: "Weak",   color: "bg-red-500",     width: "25%" };
    if (score === 2) return { label: "Fair",   color: "bg-amber-500",   width: "50%" };
    if (score === 3) return { label: "Good",   color: "bg-green-500",   width: "75%" };
    return               { label: "Strong", color: "bg-emerald-500", width: "100%" };
  })();

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setLoading(true);
    const submittedData={
        fullName: form.fullName,
        username: form.username,
        email: form.email,
        password: form.password,
        avatar: avatar ? profile : null,
      }



  const formData=new FormData();



formData.append("fullName",submittedData.fullName)
formData.append("username",submittedData.username)
formData.append("email",submittedData.email);
formData.append("password",submittedData.password)
formData.append("profileImage",submittedData.avatar)



Register(formData)
// apiCall()

    setTimeout(() => {
      console.log("📋 New Account Data:", submittedData);
      // setForm({ fullName: "", username: "", email: "", password: "" });
      // setAvatar(null);
      setErrors({});
      setLoading(false);
    }, 1800);
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Create account</h1>
        <p className="text-sm text-slate-400">
          Already have one?{" "}
          <button onClick={onSwitch} className="text-violet-400 hover:text-violet-300 font-medium transition-colors duration-150 hover:underline underline-offset-2">
            Sign in
          </button>
        </p>
      </div>

      <GoogleButton label="Sign up with Google" />
      <Divider />

      <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>

        {/* ── Avatar uploader ── */}
        <div className="flex flex-col items-center gap-2 py-1">
          <div
            className={`relative w-[72px] h-[72px] sm:w-20 sm:h-20 rounded-full cursor-pointer group transition-all duration-200
              ${isDragging ? "ring-2 ring-violet-500 ring-offset-2 ring-offset-slate-900" : ""}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            role="button"
            aria-label="Upload profile picture"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
          >
            {avatar ? (
              <>
                <img src={avatar} alt="Profile preview" className="w-full h-full rounded-full object-cover ring-2 ring-violet-500/50" />
                <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setAvatar(null); }}
                  className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-slate-800 border border-white/15 flex items-center justify-center hover:bg-red-500/80 transition-colors duration-150 z-10"
                  aria-label="Remove photo"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </>
            ) : (
              <div className={`w-full h-full rounded-full border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-all duration-150
                ${isDragging ? "border-violet-400 bg-violet-500/15" : "border-white/15 bg-white/5 group-hover:border-violet-500/60 group-hover:bg-violet-500/[0.08]"}`}>
                <Camera className={`w-5 h-5 transition-colors duration-150 ${isDragging ? "text-violet-400" : "text-slate-500 group-hover:text-violet-400"}`} />
                <span className={`text-[10px] font-medium leading-none transition-colors duration-150 ${isDragging ? "text-violet-400" : "text-slate-600 group-hover:text-slate-400"}`}>
                  {isDragging ? "Drop it!" : "Photo"}
                </span>
              </div>
            )}
          </div>
          <p className="text-xs text-slate-600">
            {avatar
              ? <span className="text-violet-400 font-medium">Looking good ✓</span>
              : "Click or drag · optional"}
          </p>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => handleAvatarFile(e.target.files[0])}  name="profileImage"/>
        </div>

        {/* Name + Username — stack on mobile, side-by-side on sm+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InputField
            id="signup-fullname" label="Full name" placeholder="Alex Rivera"
            icon={User} value={form.fullName} onChange={update("fullName")}
            error={errors.fullName} autoComplete="name"
          />
          <InputField
            id="signup-username" label="Username" placeholder="alexrivera"
            icon={AtSign} value={form.username} onChange={update("username")}
            error={errors.username} autoComplete="username"
          />
        </div>

        <InputField
          id="signup-email" label="Email" type="email" placeholder="you@example.com"
          icon={Mail} value={form.email} onChange={update("email")}
          error={errors.email} autoComplete="email"
        />

        {/* Password + strength bar */}
        <div className="space-y-1.5">
          <InputField
            id="signup-password" label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Min. 8 characters" icon={Lock}
            value={form.password} onChange={update("password")}
            error={errors.password} autoComplete="new-password"
            rightElement={
              <button type="button" onClick={() => setShowPassword(v => !v)}
                className="text-slate-500 hover:text-slate-300 transition-colors duration-150"
                aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />
          {passwordStrength && (
            <div className="space-y-1">
              <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color}`} style={{ width: passwordStrength.width }} />
              </div>
              <p className="text-xs text-slate-500">
                Strength:{" "}
                <span className={`font-medium ${
                  passwordStrength.label === "Weak"   ? "text-red-400"   :
                  passwordStrength.label === "Fair"   ? "text-amber-400" : "text-green-400"
                }`}>{passwordStrength.label}</span>
              </p>
            </div>
          )}
        </div>

        <p className="text-xs text-slate-600 pt-0.5">
          By creating an account you agree to our{" "}
          <button type="button" className="text-slate-500 hover:text-violet-400 transition-colors duration-150">Terms</button>
          {" "}and{" "}
          <button type="button" className="text-slate-500 hover:text-violet-400 transition-colors duration-150">Privacy Policy</button>.
        </p>

        <SubmitButton loading={loading} label="Create account" loadingLabel="Creating account…" />
      </form>
    </div>
  );
};

/* ── Page shell ──────────────────────────────────────────── */
export default function AuthPage() {
  const [mode, setMode] = useState("login");

  return (
    <div className="min-h-screen flex items-start sm:items-center justify-center bg-slate-950 px-0 sm:px-4 py-0 sm:py-8 lg:py-12">

      {/* Ambient glows — hidden on tiny screens for perf */}
      <div className="hidden sm:block absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-violet-600/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full bg-indigo-600/5 blur-3xl" />
      </div>

      <div
        className="relative w-full sm:max-w-md lg:max-w-4xl sm:rounded-2xl overflow-hidden
          shadow-none sm:shadow-2xl sm:shadow-black/60 border-0 sm:border border-white/[0.08]"
        style={{ background: "rgba(15,15,25,0.92)", backdropFilter: "blur(24px)" }}
      >
        {/* Two-column on lg+, single column below */}
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_1.1fr]">

          {/* Mobile/tablet: compact brand bar at top */}
          <BrandBar mode={mode} />

          {/* Desktop: full brand panel on the left */}
          <div className="hidden lg:block lg:min-h-[540px]">
            <BrandPanel mode={mode} />
          </div>

          {/* Form panel */}
          <div className="flex flex-col justify-center px-5 py-7 sm:px-8 sm:py-8 lg:px-10 lg:py-10 bg-slate-900/60">
            <div key={mode} className="animate-in fade-in slide-in-from-bottom-2 duration-300 w-full max-w-sm mx-auto lg:max-w-none">
              {mode === "login"
                ? <LoginForm onSwitch={() => setMode("signup")} />
                : <SignupForm onSwitch={() => setMode("login")} />
              }
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}