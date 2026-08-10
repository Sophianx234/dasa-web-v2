import { dmType, signupCredentialsExtended } from "@/services/apiServices";
import { useAppStore, initialUserState, anonymousMessagesType } from "@/store";

const updateUserState = (updater: (user: typeof initialUserState) => Partial<typeof initialUserState>) => {
  useAppStore.setState((state) => ({ user: { ...state.user, ...updater(state.user) } }));
};

export const toggleLike = () => updateUserState((user) => ({ isLiked: !user.isLiked }));
export const setAnnex = (payload: string) => updateUserState(() => ({ isAnnex: payload }));
export const sendAnonymousMessage = (payload: anonymousMessagesType) => updateUserState((user) => ({
  anonymousMessages: [...user.anonymousMessages, payload]
}));
export const sendMessage = (payload: dmType) => updateUserState((user) => ({
  directMessages: [...user.directMessages, payload]
}));
export const loadDirectMessage = (payload: dmType[]) => updateUserState(() => ({ directMessages: payload }));
export const loadAnonymousMessage = (payload: anonymousMessagesType[]) => updateUserState(() => ({ anonymousMessages: payload }));
