import { getHomePage, getRequiredRoles } from "./enumDisplayMapper";

export function getAccess(user: any, item: string): string {
  const requiredRoles = getRequiredRoles(item);

  if (user?.roles) {
    let check = false;

    user.roles.map((role:any) => {
      if (requiredRoles.includes(role)) {
        check = true;
      }
    });

    if (!check) {
      for (const role of user.roles) {
        const homePage = getHomePage(role);
        if (homePage) {
          return homePage;
        }
      }
    }
    return "";
  }

  return "";
}