import { josmLocalStorageReflection } from "josm-adapter"

export const createLocalSetting = josmLocalStorageReflection
export default createLocalSetting



export const cookieSettings = /*#__PURE__*/createLocalSetting<boolean>("allowCookies", "unknown")




