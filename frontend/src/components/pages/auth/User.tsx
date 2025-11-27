import { useAuthStore } from "@/stores";

const AuthUser = () => {
  const { authUser } = useAuthStore();
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center shadow-lg">
          <p className="text-white font-bold text-lg">
            {authUser?.username?.[0]?.toUpperCase() || "U"}
          </p>
        </div>
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
      </div>

      <div className="flex flex-col min-w-0">
        <p className="text-sm font-bold truncate text-foreground">
          {authUser?.username || "User"}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground truncate max-w-[120px]">
            {authUser?.email}
          </span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-primary/10 text-primary rounded">
            1000
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuthUser;
