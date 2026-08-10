import { create } from "zustand";
import { mediaType, signupCredentialsExtended, dmType } from "@/services/apiServices";

export type onlineUsersType = {
  userId: string;
  userName: string;
  isOnline: boolean;
};
export type notificationsType = {
  content: string;
  type: string;
  createdAt: string;
  _id: string;
  notificationImg: string;
};
export type anonymousMessagesType = {
  messageType: string;
  content: string;
  sender: signupCredentialsExtended;
  createdAt: string;
  anonymousName: string;
  fileURL: string;
};

export const initialNavState = {
  turnOffLight: false,
  selectFilter: "images" as "images" | "videos",
  typingUsers: [] as signupCredentialsExtended[],
  notifications: [] as notificationsType[],
  dateArr: [] as string[],
  uploadVideo: false,
  onlineUsers: [] as onlineUsersType[],
  isLoggedIn: false,
  isTyping: false,
  openEmojiMart: false,
  isOpen: false,
  openSidebar: false,
  revealCreateAnnouncementForm: false,
  openChatMenuOptions: false,
  isOpenChangePassword: false,
  showChangeContact: false,
  revealConfirmModal: false,
  revealReportIssue: false,
  revealFaq: false,
  revealUploadProfile: false,
  isOpenUploadProduct: false,
  renameImage: false,
  revealUplaoadUserImage: false,
  isAuthenticated: false,
  showToaster: false,
  page: 1,
  revealEventScheduler: false,
  images: [] as mediaType[],
  numMedia: 1,
  isLoading: false,
  user: {} as signupCredentialsExtended | object,
  isOpenAttachFile: false,
};

export const initialUserState = {
  isLiked: false,
  isAnnex: "",
  anonymousMessages: [] as anonymousMessagesType[],
  directMessages: [] as dmType[],
};

export type RootState = {
  nav: typeof initialNavState;
  user: typeof initialUserState;
};

export const useAppStore = create<RootState>((set) => ({
  nav: initialNavState,
  user: initialUserState,
}));