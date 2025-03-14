import { Theme as AruiTheme} from "@komune-io/g2";
import { DeepPartial } from "@komune-io/g2";
import {config, PermanentHeader} from "components";

export const theme: DeepPartial<AruiTheme> = {// to complete and to use
  colors: {
    primary: config().theme?.colors?.primary ?? "#EDBA27",
    secondary: config().theme?.colors?.secondary ?? "#353945",
    background: config().theme?.colors?.background ?? "#FAF8F3",
  },
  permanentHeader: PermanentHeader,
  logoUrl: config().theme?.logo?.url ?? "/logo.svg",
};
