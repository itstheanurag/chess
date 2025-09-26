import { useAuthStore } from "@/stores";

const AuthUser = () => {
  const { authUser } = useAuthStore();
  return (
    <div className=" border-gray-200">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center">
          <p className="text-neutral-50 font-semibold text-xl">
            {authUser?.name[0]}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">{authUser?.email}</p>
          <p className="text-sm font-medium text-blue-600 pt-1">
            Rating: {"1000"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthUser;
