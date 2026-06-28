export const getSelectedProfile = () => {
  return JSON.parse(
    localStorage.getItem("selectedProfile") || "null"
  );
};

export const isSelfProfile = () => {
  const profile = getSelectedProfile();
  return profile?.isSelf === true;
};