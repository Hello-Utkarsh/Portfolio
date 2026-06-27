interface ThemeColors {
    patternbgColor: string;
    bgColor: string;
    titleTxt: string;
    secondaryText: string;
    secondaryClr: string;
    socialIcnBg: string;
    socialIcnClr: string;
    techIcn: string;
    typography: any;
}

export interface ThemeConfig {
    light: ThemeColors;
    dark: ThemeColors;
}

export interface BlogConfig {
  path: string;
  mode: string;
  type: string;
  sha: string;
  size: number;
  url: string;
  description: string;
  title: string;
  date: string;
  tags: string;
}