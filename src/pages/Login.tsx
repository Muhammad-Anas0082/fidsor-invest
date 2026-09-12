import React, { useState } from 'react';
import {
  Briefcase,
  Layers,
  BarChart3,
  Key,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DEMO_USERS, DEMO_PASSWORD } from '../lib/auth';

interface LoginProps {
  onSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSuccess }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('fakhar@fidsorholdings.pk');
  const [password, setPassword] = useState('fidsor2026');
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = login(email, password, keepSignedIn);
    if (success) {
      onSuccess();
    } else {
      setError('Invalid email or password. Use password: fidsor2026');
    }
  };

  const handleSelectDemoUser = (userEmail: string) => {
    setEmail(userEmail);
    setPassword(DEMO_PASSWORD);
    setError('');
  };

  const demoAccounts = [
    { initials: 'FM', name: 'Fakhar Memon', role: 'Administrator', email: 'fakhar@fidsorholdings.pk' },
    { initials: 'AQ', name: 'Adnan Qureshi', role: 'Investment Manager', email: 'adnan@fidsorholdings.pk' },
    { initials: 'BA', name: 'Bilal Ahmed Jat', role: 'Operations', email: 'bilal@fidsorholdings.pk' },
    { initials: 'SM', name: 'Sana Mirza', role: 'Accountant', email: 'sana@fidsorholdings.pk' },
    { initials: 'RT', name: 'Rukhsana Talpur', role: 'Viewer', email: 'rukhsana@fidsorholdings.pk' }
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#0d1b2e] text-fg select-none">
      {/* LEFT PANEL (~45% width, dark navy background gradient) */}
      <div className="login-left-panel lg:w-[45%] bg-gradient-to-b from-[#0d1b2e] to-[#14263f] p-8 lg:p-14 flex flex-col justify-between text-white border-b lg:border-b-0 lg:border-r border-white/10">
        {/* Brand header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2f6fb0] flex items-center justify-center font-bold text-xl shadow-md">
            F
          </div>
          <div>
            <div className="font-bold text-lg leading-tight tracking-tight">Fidsor Invest</div>
            <div className="text-xs text-[#a9cdea]">Investment Platform</div>
          </div>
        </div>

        {/* Middle hero block (Headline + Subtitle + 3 Feature Blocks) */}
        <div className="my-auto py-10 lg:py-0">
          {/* Headline */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white">
              Eleven businesses. One answer to what it is worth.
            </h1>
            <p className="mt-4 text-sm sm:text-base text-[#a9cdea] leading-relaxed">
              Land, property, construction, cold storage, lending, equity, currency, machinery and
              labour — each keeping its own workflow, all measured the same way.
            </p>
          </div>

          {/* 3 Feature Blocks */}
          <div className="mt-10 lg:mt-12 space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#6cb2e8] shrink-0 mt-0.5">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-sm text-white">
                  One ledger, eleven lines of business
                </div>
                <div className="text-xs text-[#a9cdea] mt-1 leading-relaxed">
                  Cold storage, farmland, property, construction, lending, equity, currency, machinery
                  and labour all post to the same ledger.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#6cb2e8] shrink-0 mt-0.5">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-sm text-white">
                  Every figure computed once
                </div>
                <div className="text-xs text-[#a9cdea] mt-1 leading-relaxed">
                  Profit, ROI, net worth and cash flow come from one financial core, so the dashboard
                  and the project it links to cannot disagree.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#6cb2e8] shrink-0 mt-0.5">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-sm text-white">
                  Reporting that stands up
                </div>
                <div className="text-xs text-[#a9cdea] mt-1 leading-relaxed">
                  Portfolio, projects, cash flow, assets, investors, microfinance, hire and profit &
                  loss — realized and unrealized always kept apart.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-[11px] text-[#74aedb]/60">
          © 2026 Fidsor Holdings · Phase 1 prototype
        </div>
      </div>

      {/* RIGHT PANEL (~55% width, light clean background) */}
      <div className="lg:w-[55%] bg-[#f7f9fc] dark:bg-[#071726] flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[440px] space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0d1b2e] dark:text-white">
              Sign in
            </h2>
            <p className="text-xs sm:text-sm text-[#697683] dark:text-[#a9cdea] mt-1">
              Welcome back. Enter your details to open the portfolio.
            </p>
          </div>

          {/* Demo Credentials Info Card */}
          <div className="bg-[#eaf2fb] dark:bg-[#0f2845] border border-[#bcd6f3] dark:border-[#1d4b7c] rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#185f9f] dark:text-[#6cb2e8]">
              <Key className="w-4 h-4" />
              <span>DEMO CREDENTIALS</span>
            </div>
            <p className="text-[11px] text-[#38434f] dark:text-[#d3e6f5] leading-relaxed">
              Any of the five accounts below, with the password{' '}
              <code className="font-mono px-1.5 py-0.5 bg-white dark:bg-black/30 border border-[#bcd6f3] dark:border-white/10 rounded text-[11px] font-semibold text-[#185f9f] dark:text-[#6cb2e8]">
                fidsor2026
              </code>
              . Each role renders a different interface.
            </p>

            {/* 5 Demo Accounts list */}
            <div className="divide-y divide-[#bcd6f3]/50 dark:divide-white/10 pt-1">
              {demoAccounts.map(account => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => handleSelectDemoUser(account.email)}
                  className={`w-full py-2 flex items-center justify-between hover:bg-white/50 dark:hover:bg-white/5 px-1.5 rounded transition-colors text-left ${
                    email === account.email ? 'bg-white/70 dark:bg-white/10 ring-1 ring-brand/30' : ''
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#185f9f]/15 dark:bg-[#6cb2e8]/20 text-[#185f9f] dark:text-[#6cb2e8] text-[10px] font-bold flex items-center justify-center">
                      {account.initials}
                    </span>
                    <span className="text-xs font-bold text-[#151b23] dark:text-white">
                      {account.name}
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-[#185f9f] dark:text-[#6cb2e8]">
                    {account.role}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-danger/10 border border-danger/20 rounded-lg text-danger text-xs font-medium">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-fg mb-1.5">
                Email address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="fakhar@fidsorholdings.pk"
                  className="w-full h-10 pl-9 pr-3 rounded-lg border border-hairline bg-card text-xs text-fg focus:outline-none focus-visible:border-sky transition-colors shadow-2xs"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-fg mb-1.5">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="w-full h-10 pl-9 pr-10 rounded-lg border border-hairline bg-card text-xs text-fg focus:outline-none focus-visible:border-sky transition-colors shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-fg"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Keep me signed in & Forgot password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-body">
                <input
                  type="checkbox"
                  checked={keepSignedIn}
                  onChange={e => setKeepSignedIn(e.target.checked)}
                  className="rounded border-hairline text-sky focus:ring-0"
                />
                <span>Keep me signed in</span>
              </label>
              <a href="#forgot" onClick={e => e.preventDefault()} className="text-sky hover:underline font-medium">
                Forgot password?
              </a>
            </div>

            {/* Sign in Button */}
            <button
              type="submit"
              className="login-submit-btn w-full h-11 rounded-lg bg-sky hover:bg-sky-light text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md mt-4 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Sign in</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </form>

          {/* Footnote */}
          <div className="flex items-start gap-2.5 text-[11px] text-[#697683] dark:text-[#74aedb]/70 pt-3 leading-relaxed">
            <Info className="w-4 h-4 text-[#185f9f] dark:text-[#6cb2e8] shrink-0 mt-0.5" />
            <span>
              Phase 1 prototype — the session is kept in this browser. Real sign-in, password hashing and role enforcement are Phase 2, on the server.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
