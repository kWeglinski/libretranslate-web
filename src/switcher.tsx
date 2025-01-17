import { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Translate from "./translate/App.tsx";
import LangCheck from "./languagecheck/App.tsx";

interface CustomTabPanelProps {
  children?: React.ReactNode;
  value: number;
  index: number;
  [key: string]: unknown;
}

function CustomTabPanel(props: CustomTabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export const Switcher = () => {
  const initTab = parseInt(localStorage.getItem("tab") ?? "0");
  const [status, setStatus] = useState({
    libreTranslate: false,
    languageTool: false,
    ollama: false,
  });
  const [tab, setTab] = useState(initTab);
  const tabSetter = (val: number) => {
    setTab(val);
    localStorage.setItem("tab", val.toString());
  };

  useEffect(() => {
    fetch("/api/status")
      .then((data) => data.json())
      .then((data) => {
        setStatus({
          libreTranslate: data.LIBRETRANSLATE,
          languageTool: data.LANGUAGE_TOOL,
          ollama: data.OLLAMA,
        });
      });
  }, []);

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          centered
          value={tab}
          onChange={(_, val) => tabSetter(val)}
          aria-label="basic tabs example"
        >
          {status.libreTranslate && <Tab label="Translate" {...a11yProps(0)} />}
          {status.languageTool && <Tab label="Language Check" {...a11yProps(1)} />}
        </Tabs>
      </Box>
      <CustomTabPanel value={tab} index={0}>
        <Translate ollama={status.ollama} />
      </CustomTabPanel>
      <CustomTabPanel value={tab} index={1}>
        <LangCheck />
      </CustomTabPanel>
    </>
  );
};
