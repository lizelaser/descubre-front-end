import { reactive, readonly } from "vue";

export const ACCESS_KEY = "descubre.access";
export const USER_KEY = "descubre.user";

export interface User {
  id: number;
  username: string;
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: "M" | "F";
  birthday: Date;
  phone: string;
  status: boolean;
}

type Mutation = (state: AuthState) => void;
type MutateCallback = (mutation: Mutation) => void;

interface AuthStore {
  authState: AuthState;
  mutate: MutateCallback;
}
interface AuthState {
  access?: string;
  user?: User;
  get isAuthenticated(): boolean;
}

const getUser = (): User | undefined => {
  const userString = localStorage.getItem(USER_KEY);

  if (userString != null) {
    return JSON.parse(userString) as User;
  }

  return undefined;
};

const _state: AuthState = reactive({
  access: localStorage.getItem(ACCESS_KEY) ?? undefined,
  user: getUser(),
  get isAuthenticated() {
    return typeof this.access === "string";
  },
});

export const authState = readonly(_state);
export const mutate: MutateCallback = (mutation) => {
  mutation(_state);
};

export const useAuthStore = (): AuthStore => {
  return { authState, mutate };
};
