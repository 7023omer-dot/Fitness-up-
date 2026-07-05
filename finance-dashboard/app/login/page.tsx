import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <div className="card w-full max-w-sm">
        <h1 className="mb-1 text-xl font-bold">צומחים מחדש</h1>
        <p className="mb-6 text-sm text-slate-500">התחברות לניהול הפיננסי של העסק</p>
        <LoginForm />
      </div>
    </div>
  );
}
