import { eventI } from "@/components/features/dashboard/components/Events";
import { resetPassFormValues } from "@/app/(auth)/resetpassword/page";
import * as apiActions from "@/app/actions/apiActions";
import { getGalleryAction, getVideosAction, uploadMediaAction } from "@/app/actions";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://dasa-api.onrender.com/api/v1";
const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('token') : null;

// Types...
export type messagesType = { content: string; userId: string; };
export type anonymousType = { name: string; members: string[]; messages: messagesType[]; };
export type anonymousResponse = { status: string; anonymous: anonymousType; };
export type LoginCredentials = { email: string; password: string; };
export type errorType = { status: string; error: { statusCode: number; status: "fail"; operational: boolean; }; message: string; };
export type dmType = { sender: signupCredentialsExtended; recipient: signupCredentialsExtended; messageType: "text" | "file"; content: string; _id: string; createdAt: string; fileURL: string; };
export type directMessageType = { messages: dmType[]; };
export type LoginResponse = { token: string; user: { id: string; name: string; email: string; }; };
export type signupCredentials = { fullName: string; email: string; password: string; contact: string; hall?: string; course?: string; confirmPassword?: string | boolean | null; };
export type signupCredentialsExtended = signupCredentials & { username: string; profileImage: string; _id: string; anonymousName: string; anonymousProfile: string; sex: "male" | "female"; role: string; };
export type logoutResponse = { status: string; };
export type userType = { status: string; user: signupCredentialsExtended; };
export type mediaType = { _id: string; asset_id: string; public_id: string; version: number; version_id: string; signature: string; width: number; height: number; format: string; resource_type: string; created_at: Date; tags: string[]; bytes: number; type: string; etag: string; placeholder: boolean; url: string; secure_url: string; asset_folder: string; display_name: string; original_filename: string; uploadedAt: Date; };
export type getGalleryResponse = { status: string; numImages: number; images: mediaType[]; };

export async function login(creds: LoginCredentials): Promise<any> {
  return await apiActions.loginAction(creds);
}

export async function logout(): Promise<any> {
  return await apiActions.logoutAction();
}

export async function signup(userInfo: signupCredentials) {
  return await apiActions.signupAction(userInfo);
}

export async function getUser(): Promise<any> {
  return await apiActions.getUserAction(getToken() || "");
}

export async function forgotPassword(email: string): Promise<any> {
  return await apiActions.forgotPasswordAction(email);
}

type resetPasswordType = { token: string; body: resetPassFormValues }
export async function resetPassword({ token, body }: resetPasswordType): Promise<any> {
  return await apiActions.resetPasswordAction(token, body);
}

export async function getUsers() {
  return await apiActions.getUsersAction(getToken() || "");
}

export async function getAnonymous(lim: number | null = null): Promise<any> {
  return await apiActions.getAnonymousAction(getToken() || "", lim);
}

export async function updateUser(update: unknown): Promise<any> {
  return await apiActions.updateUserAction(getToken() || "", update);
}

export async function changeProfile(update: unknown): Promise<any> {
  return await apiActions.changeProfileAction(getToken() || "", update);
}

export async function getGallery() {
  return await getGalleryAction();
}

export async function getVideos() {
  return await getVideosAction();
}

export async function getAnnouncements() {
  return await apiActions.getAnnouncementsAction(getToken() || "");
}

export interface announcementI { _id: string; announcer: string; announcerProfile: string; portfolio: string; date: Date | string; messageType: string; title: string; content: string; reactions: number; comments: string[]; }
export type newAnnouncementI = Omit<announcementI, '_id' | 'reactions' | 'comments'>
export interface announcementResponse { announcements: announcementI[] }
export type updateAnnouncementI = { id: string; body: announcementI; };

export async function updateAnnouncement({ id, body }: updateAnnouncementI) {
  return await apiActions.updateAnnouncementAction(getToken() || "", id, body);
}

export async function deleteAnnouncement(id: string) {
  return await apiActions.deleteAnnouncementAction(getToken() || "", id);
}

export async function createAnnouncement(body: newAnnouncementI) {
  return await apiActions.createAnnouncementAction(getToken() || "", body);
}

export async function uploadImages(update: FormData): Promise<any> {
  // Pass FormData to uploadMediaAction
  return await uploadMediaAction(update);
}

export async function removeImage(imageId: string): Promise<any> {
  return await apiActions.removeImageAction(getToken() || "", imageId);
}

export async function removeUser(id: string) {
  return await apiActions.removeUserAction(getToken() || "", id);
}

type changeRoleI = { id: string; role: string; };
export async function changeUserRole({ id, role }: changeRoleI) {
  return await apiActions.changeUserRoleAction(getToken() || "", id, role);
}

export async function getEvents() {
  return await apiActions.getEventsAction(getToken() || "");
}

export async function getNotifications() {
  return await apiActions.getNotificationsAction(getToken() || "");
}

export async function removeEvent(id: string) {
  return await apiActions.removeEventAction(getToken() || "", id);
}

export type updateEventI = { id: string; body: eventI; };
export async function updateEvent({ id, body }: updateEventI) {
  return await apiActions.updateEventAction(getToken() || "", id, body);
}

export async function createEvent(body: any) {
  return await apiActions.createEventAction(getToken() || "", body);
}
