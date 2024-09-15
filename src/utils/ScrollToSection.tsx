export const scrollToSection = (targetId: string) => {
  const section = document.getElementById(targetId);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" }); // Smooth scroll
  }
};
