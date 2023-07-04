import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient from "../apiClient";
import { UserInfo } from "../types/Users/UserInfo";
import { User } from "../types/Users/User";

// Defining a mutation hook to sign in a user
export const useSigninMutation = () =>
  useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) =>
      (
        await apiClient.post<UserInfo>(`api/users/signin`, {
          email,
          password,
        })
      ).data,
  });

// Defining a mutation hook to sign up a user
export const useSignupMutation = () =>
  useMutation({
    mutationFn: async ({
      name,
      email,
      password,
    }: {
      name: string;
      email: string;
      password: string;
    }) =>
      (
        await apiClient.post<UserInfo>(`api/users/signup`, {
          name,
          email,
          password,
        })
      ).data,
  });

// Defining a mutation hook to update a user's profile
export const useUpdateProfileMutation = () =>
  useMutation({
    mutationFn: async ({
      name,
      email,
      password,
    }: {
      name: string;
      email: string;
      password: string;
    }) =>
      (
        await apiClient.put<UserInfo>(`api/users/profile`, {
          name,
          email,
          password,
        })
      ).data,
  });

// Defining a hook to get all users
export const useGetUsersQuery = () =>
  useQuery({
    queryKey: ["users"],
    queryFn: async () => (await apiClient.get<[User]>(`api/users`)).data,
  });

// Defining a mutation hook to delete a user
export const useDeleteUserMutation = () =>
  useMutation({
    mutationFn: async (userId: string) =>
      (await apiClient.delete<{ message: string }>(`api/users/${userId}`)).data,
  });

// Defining a mutation hook to update a user
export const useUpdateUserMutation = () =>
  useMutation({
    mutationFn: async (user: {
      _id: string;
      name: string;
      email: string;
      isAdmin: boolean;
    }) =>
      (
        await apiClient.put<{ user: User; message: string }>(
          `api/users/${user._id}`,
          user
        )
      ).data,
  });

// Defining a hook to get the details of a specific user
export const useGetUserDetailsQuery = (userId: string) =>
  useQuery({
    queryKey: ["users", userId],
    queryFn: async () =>
      (await apiClient.get<User>(`api/users/${userId}`)).data,
  });
