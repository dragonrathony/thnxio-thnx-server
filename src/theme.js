import { createMuiTheme } from "@material-ui/core/styles";
import { deepOrange, red } from "@material-ui/core/colors";
import theme from "@material-ui/core/styles/defaultTheme";

const drawerWidth = 240;

export default createMuiTheme({
  /*shadows: [
    {
      elevation2:
        "box-shadow: 0px 1px 8px 0px rgba(73,100,141,0.2), 0px 3px 4px 0px rgba(73,100,141,0.14), 0px 3px 3px -2px rgba(73,100,141,0.12);"
    }
  ],*/
  palette: {
    primary: { 500: "#BD0F68" }, // custom color in hex
    secondary: { main: "#28ade1" }, // custom color in hex
    success: { 500: "#86BC25", main: "#86BC25", other: "#21C19B" },
    accent: deepOrange,
    error: red,
    text: {
      primary: "#374359",
      secondary: "#49648D",
      white: "#fff"
    },
    background: {
      default: "#F7FAFC",
      light: "#fff",
      dark: "#323D51"
    }
  },
  typography: {
    fontFamily: ["Roboto", "sans-serif"].join(","),
    h1: {
      fontFamily: ["Roboto", "sans-serif"].join(",")
    },
    h2: {
      fontFamily: ["Roboto", "sans-serif"].join(",")
    },
    h3: {
      fontFamily: ["Roboto", "sans-serif"].join(",")
    },
    h4: {
      fontFamily: ["Roboto", "sans-serif"].join(",")
    },
    h5: {
      fontFamily: ["Roboto", "sans-serif"].join(","),
      fontWeight: 400
    },
    h6: {
      fontFamily: ["Roboto", "sans-serif"].join(","),
      fontWeight: 500
    }
  },
  root: {
    display: "flex"
    //background: "rgb(50, 61, 81)"
  },
  button: {
    margin: theme.spacing(1),
    color: {
      default: "#fff"
    }
  },
  toolbar: {
    paddingRight: 24 // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px"
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: 36
  },
  menuButtonHidden: {
    display: "none"
  },
  title: {
    flexGrow: 1
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9)
    }
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto"
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column"
  },
  borderRadius: "8px",
  shape: {
    borderRadius: "8px"
    // other shape properties...
  },
  fixedHeight: {
    height: 500
  },
  overrides: {
    MuiFab: {
      primary: {
        "&:hover": {
          backgroundColor: "#db4b86"
        }
      }
    },
    MuiCheckbox: {
      root: {
        color: "#A0AEC0"
      }
    },
    MuiIconButton: {
      root: {
        color: "#A0AEC0",
        "&:hover": {
          backgroundColor: "transparent"
        }
      }
    },
    MuiTableCell: {
      root: {
        padding: theme.spacing(1)
      }
    },
    MuiAppBar: {
      colorDefault: {
        backgroundColor: "#EDF2F7"
      }
    },
    MuiDivider: {
      root: { backgroundColor: "#BD0F68", margin: theme.spacing(2) }
    }
  }
});
