import { Theme as AruiTheme} from "@komune-io/g2";
import { DeepPartial } from "@komune-io/g2";
import { PermanentHeader } from "components";

export const theme: DeepPartial<AruiTheme> = {// to complete and to use
  colors: {
    primary: "#EDBA27",
    secondary: "#353945",
    background: "#FAF8F3"
  },
  permanentHeader: PermanentHeader as React.ElementType<any>,
  logoUrl: "/connect.png"
};
