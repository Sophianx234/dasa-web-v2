import { mediaType, signupCredentialsExtended } from "@/services/apiServices";
import { useAppStore, initialNavState, onlineUsersType, notificationsType } from "@/store";

const updateNav = (updater: (nav: typeof initialNavState) => Partial<typeof initialNavState>) => {
  useAppStore.setState((state) => ({ nav: { ...state.nav, ...updater(state.nav) } }));
};

export const toggleNav = () => updateNav((nav) => ({ isOpen: !nav.isOpen }));
export const toggleSidebar = () => updateNav((nav) => ({ openSidebar: !nav.openSidebar }));
export const toggleChatMenu = () => updateNav((nav) => ({ openChatMenuOptions: !nav.openChatMenuOptions }));
export const toggleChangePassword = () => updateNav((nav) => ({ isOpenChangePassword: !nav.isOpenChangePassword }));
export const toggleChangeContact = () => updateNav((nav) => ({ showChangeContact: !nav.showChangeContact }));
export const toggleRevealConfirmModal = () => updateNav((nav) => ({ revealConfirmModal: !nav.revealConfirmModal }));
export const toggleRevealReportIssue = () => updateNav((nav) => ({ revealReportIssue: !nav.revealReportIssue }));
export const toggleUploadVideo = () => updateNav((nav) => ({ uploadVideo: !nav.uploadVideo }));
export const toggleRevealFaq = () => updateNav((nav) => ({ revealFaq: !nav.revealFaq }));
export const toggleOpenEmojiMart = () => updateNav((nav) => ({ openEmojiMart: !nav.openEmojiMart }));
export const toggleRevealUploadImage = () => updateNav((nav) => ({ revealUploadProfile: !nav.revealUploadProfile }));
export const toggleRevealUploadProduct = () => updateNav((nav) => ({ isOpenUploadProduct: !nav.isOpenUploadProduct }));
export const toggleRenameImage = () => updateNav((nav) => ({ renameImage: !nav.renameImage }));
export const setIsLoading = (payload: boolean) => updateNav(() => ({ isLoading: payload }));
export const setIsLoggedIn = (payload: boolean) => updateNav(() => ({ isLoggedIn: payload }));
export const setSelectFilter = (payload: "images" | "videos") => updateNav(() => ({ selectFilter: payload }));
export const toggleRevealUplaoadUserImage = () => updateNav((nav) => ({ revealUplaoadUserImage: !nav.revealUplaoadUserImage }));
export const toggleIsAuthenticated = (payload: boolean) => updateNav(() => ({ isAuthenticated: payload }));
export const toggleTurnOffLight = (payload: boolean) => updateNav(() => ({ turnOffLight: payload }));
export const toggleShowToaster = () => updateNav((nav) => ({ showToaster: !nav.showToaster }));
export const setIsOpenAttachFile = (payload: boolean) => updateNav(() => ({ isOpenAttachFile: payload }));
export const setDateArr = (payload: string) => updateNav((nav) => ({
  dateArr: nav.dateArr.includes(payload) ? nav.dateArr : [...nav.dateArr, payload]
}));
export const toggleIsOpenAttachFile = () => updateNav((nav) => ({ isOpenAttachFile: !nav.isOpenAttachFile }));
export const toggleRevealEventScheduler = () => updateNav((nav) => ({ revealEventScheduler: !nav.revealEventScheduler }));
export const toggleRevealAnnouncementForm = () => updateNav((nav) => ({ revealCreateAnnouncementForm: !nav.revealCreateAnnouncementForm }));
export const increasePageNumber = () => updateNav((nav) => ({ page: nav.page + 1 }));
export const setNumMedia = (payload: number) => updateNav(() => ({ numMedia: payload }));
export const resetPageNumber = () => updateNav(() => ({ page: 1 }));
export const resetNumMedia = () => updateNav(() => ({ numMedia: 1 }));
export const setImages = (payload: mediaType[]) => updateNav(() => ({ images: payload }));
export const setOnlineUsers = (payload: onlineUsersType) => updateNav((nav) => ({
  onlineUsers: nav.onlineUsers.some((u) => u.userId === payload.userId) ? nav.onlineUsers : [...nav.onlineUsers, payload]
}));
export const setUserIsTyping = (payload: boolean) => updateNav(() => ({ isTyping: payload }));
export const setEmojiMart = (payload: boolean) => updateNav(() => ({ openEmojiMart: payload }));
export const removeOnlineUser = (payload: onlineUsersType) => updateNav((nav) => ({
  onlineUsers: nav.onlineUsers.filter((u) => u.userId !== payload.userId)
}));
export const loadNotifications = (payload: notificationsType[]) => updateNav(() => ({ notifications: payload }));
export const addNotification = (payload: notificationsType) => updateNav((nav) => ({ notifications: [...nav.notifications, payload] }));
export const removeTypingUser = (payload: string) => updateNav((nav) => ({
  typingUsers: nav.typingUsers.filter((u) => u._id !== payload)
}));
export const setTypingUsers = (payload: signupCredentialsExtended) => updateNav((nav) => ({
  typingUsers: nav.typingUsers.some((u) => u._id === payload._id) ? nav.typingUsers : [...nav.typingUsers, payload]
}));
export const setUser = (payload: any) => updateNav(() => ({
  user: { ...payload }
}));
