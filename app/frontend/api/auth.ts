import axios from "axios";
import type User from "@/types/api/User";

type UserData = User["user"];

export async function getCurrentUser(): Promise<UserData> {
  const response = await axios.get<User>("/api/v1/me");
  return response.data.user;
}

export function getLoginUrl(): string {
  return "/users/auth/auth0";
}

export function getLogoutUrl(): string {
  return "/logout";
}
