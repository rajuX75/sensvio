export const getAvatar = (userPicture: string | null, userEmail: string) => {
  return (
    userPicture ??
    `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
      userEmail
    )}&backgroundType=gradientLinear&fontSize=40`
  );
};
