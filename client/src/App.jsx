import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import ResumeBuilder from "./pages/ResumeBuilder";
import Preview from "./pages/Preview";
import Login from "./pages/Login";
import { useDispatch } from "react-redux";
import api from "./configs/api";
import { login, logout, setLoading } from "./app/features/authSlice";
import { Toaster } from "react-hot-toast";

const App = () => {
  const dispatch = useDispatch();

  const getUserData = async () => {
    dispatch(setLoading(true));
    try {
      const response = await api.get("/api/users/data");

      if (response.data) {
        const authData = JSON.parse(localStorage.getItem("auth"));
        dispatch(
          login({
            user: response.data.user,
            token: authData?.token,
          }),
        );
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error.response?.status);

      if (error.response?.status === 401) {
        localStorage.removeItem("auth");
        dispatch(logout());
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    // Check if auth data exists
    const authData = localStorage.getItem("auth");
    if (authData) {
      try {
        const parsedAuth = JSON.parse(authData);
        if (parsedAuth.token) {
          getUserData();
        } else {
          dispatch(setLoading(false));
        }
      } catch (err) {
        console.error("Error parsing auth data:", err);
        localStorage.removeItem("auth");
        dispatch(setLoading(false));
      }
    } else {
      dispatch(setLoading(false));
    }
  }, []);

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route path="app" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="builder/:resumeId" element={<ResumeBuilder />} />
        </Route>

        <Route path="view/:resumeId" element={<Preview />} />
      </Routes>
    </>
  );
};

export default App;
