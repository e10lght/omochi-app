import { Route, Routes } from "react-router-dom";
import { CalendarHandler } from "../pages/calendar";
import { CommetsHandler } from "../pages/comments";
import { HomeHandler } from "../pages/home";
import { LoginHandler } from "../pages/login";
import { NotFound } from "../pages/NotFound";
import { SettingHandler } from "../pages/setting";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginHandler />} />
      <Route path="/home" element={<HomeHandler />} />
      <Route path="/calendar" element={<CalendarHandler />} />
      <Route path="/comments" element={<CommetsHandler />} />
      <Route path="/setting" element={<SettingHandler />} />
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
};
